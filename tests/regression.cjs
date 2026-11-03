// Run with Node 18+; no packages or browser globals required.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
let checks = 0;
function check(name, fn) {fn(); checks++; console.log('PASS', name);}
function memory(initial = null) {
  const values = new Map(initial === null ? [] : [['yoyo_sky_v1', initial]]);
  return {values, getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,String(v))};
}
function element() {return {innerHTML:'',textContent:'',children:[],append(v){this.children.push(v);},setAttribute(){}};}
function app(storage = memory()) {
  const nodes = new Map(); const calls = [];
  const ctx = {console, localStorage:storage, document:{getElementById(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)},createElement:element,querySelectorAll:()=>[]},
    navigator:{}, isSecureContext:false, location:{}, setTimeout:()=>1, clearTimeout(){}, addEventListener(){},scrollTo(){},
    speechSynthesis:{cancel(){},getVoices:()=>[],speak(u){calls.push(u.text)},addEventListener(){}},SpeechSynthesisUtterance:class{constructor(text){this.text=text}}};
  ctx.window=ctx;vm.createContext(ctx);
  for(const f of ['src/services/storage.js','src/services/speech.js','src/services/pwa.js','src/app.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
  return {run:code=>vm.runInContext(code,ctx),storage,calls,nodes};
}
check('20 words, exact V1.0 order and valid 12 question answer mappings',()=>{
  const a=app();assert.equal(a.run('words.length'),20);
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(words.map(w=>w[0]))')),['sun','moon','star','cloud','rainbow','bird','airplane','rain','kite','helicopter','rocket','planet','hot air balloon','snow','lightning','comet','satellite','blimp','aurora borealis','bat']);
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(quiz.map(q=>q.a))')),[0,1,4,6,2,3,1,0,6,0,1,4]);
  assert(a.run('quiz.every(q=>q.opts.length===4&&new Set(q.opts).size===4&&q.opts.includes(q.a)&&q.opts.every(id=>Number.isInteger(id)&&id>=0&&id<20))'));
});
check('all 20 cards tracked exactly once, core/more loops preserved',()=>{
  const a=app();a.run("go('learn');for(let n=0;n<8;n++)moveWord(1);setFilter('more');for(let n=0;n<12;n++)moveWord(1)");assert.equal(a.run('data.seen.length'),20);assert.equal(a.run('wordIndex'),8);
});
check('all correct scores 12, completion recorded once, labels match result',()=>{
  const a=app();a.run("startQuiz();while(view==='quiz'){choose(quiz[qi].a);nextQuestion()}nextQuestion()");assert.equal(a.run('data.sessions.length'),1);assert.equal(a.run('data.sessions[0].score'),12);assert(a.nodes.get('root').innerHTML.includes('100%'));
});
check('retries retain 11/12 score, repeated wrong count, incomplete quiz not saved',()=>{
  const a=app();a.run('startQuiz();choose(1);choose(1)');assert.equal(a.run('data.misses[0]'),2);assert.equal(a.run('data.sessions.length'),0);
  assert(!a.nodes.get('root').innerHTML.includes('choice correct'));assert(!a.nodes.get('root').innerHTML.includes('choiceText'));
  a.run("choose(0);while(view==='quiz'){nextQuestion();if(view==='quiz')choose(quiz[qi].a)}");assert.equal(a.run('data.sessions[0].score'),11);
});
check('each new question speaks once; re-render/retry does not replay prompt; full Level 3 sentences',()=>{
  const a=app();a.run('startQuiz();choose(1);render()');assert.deepEqual(a.calls,['Find the sun!']);
  a.run('choose(0)');assert.equal(a.calls.at(-1),'Great job!');a.run('nextQuestion()');assert.equal(a.calls.at(-1),'Where is the moon?');
  a.run("qi=9;selected=null;enterQuestion()");assert.equal(a.calls.at(-1),'I can see the sun and clouds. Tap the sun.');
});
check('valid historical records stay unchanged across load/save and render',()=>{
  const old={seen:[0,5,19],sessions:[{time:1700000000000,score:9},{time:1700000001000,score:11}],misses:{'0':2,'19':3}};
  const m=memory(JSON.stringify(old)),a=app(m);a.run("go('progress');go('review');save()");assert.deepEqual(JSON.parse(m.getItem('yoyo_sky_v1')),old);
});
check('invalid JSON and incomplete JSON recover only after original backup',()=>{
  for(const raw of ['{bad','{}','null','{"seen":[0,99],"sessions":[],"misses":{"99":1}}']){
    const m=memory(raw),a=app(m);assert.equal(m.getItem('yoyo_sky_v1'),raw);a.run('save()');assert([...m.values.entries()].some(([k,v])=>k.startsWith('yoyo_sky_v1_backup_')&&v===raw));assert(Array.isArray(JSON.parse(m.getItem('yoyo_sky_v1')).sessions));
  }
});
check('backup quota failure never overwrites original and offers retry',()=>{
  const m=memory('{}');m.setItem=()=>{throw Error('quota')};const a=app(m);assert.equal(a.run('save()'),false);assert.equal(m.getItem('yoyo_sky_v1'),'{}');assert(a.nodes.get('storage-status').textContent.includes('could not be saved'));
});
check('storage getter denial does not crash learning',()=>{
  const a=app(memory()); // service is also tested with a throwing getter
  assert.doesNotThrow(()=>a.run("YoyoStorage.create(()=>{throw Error('denied')})"));
});
check('speech sequence, cancellation and stale callbacks',()=>{
  const a=app();a.run('globalThis.played=[];globalThis.fake={getVoices:()=>[],cancel(){},speak(u){played.push(u)}};globalThis.s=YoyoSpeech.create({synth:fake,Utterance:SpeechSynthesisUtterance});s.play(["Great job!","I can see the sun and clouds."])');
  assert.equal(a.run('played.length'),1);a.run('played[0].onend()');assert.equal(a.run('played[1].text'),'I can see the sun and clouds.');
  a.run('s.stop();played[1].onend()');assert.equal(a.run('played.length'),2);
});
async function swChecks(){
  const events={}, deleted=[], calls=[], store=new Map();let skipped=0;
  const caches={open:async key=>({addAll:async assets=>{for(const f of assets)assert(fs.existsSync(f));calls.push(assets)},match:async req=>store.get(key+req.url)}),keys:async()=>['yoyo-sky-v1','other-app-v1','yoyo-sky-v1.1-foundation-3'],delete:async key=>deleted.push(key)};
  const ctx={URL,Response,caches,fetch:async()=>{throw Error('offline')},self:{registration:{scope:'https://example.com/yoyo-english-adventure/'},clients:{claim:async()=>{}},skipWaiting(){skipped++},addEventListener:(name,fn)=>events[name]=fn}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('sw.js','utf8'),ctx);
  const dispatch=async name=>{let p;events[name]({waitUntil:v=>p=v});await p;};
  await dispatch('install');assert.equal(calls[0].length,13);assert.equal(skipped,0);
  await dispatch('activate');assert.deepEqual(deleted,['yoyo-sky-v1']);events.message({data:{type:'SKIP_WAITING'}});assert.equal(skipped,1);
  let response;events.fetch({request:{method:'GET',url:'https://example.com/yoyo-english-adventure/missing.js'},respondWith:p=>response=p});assert.equal((await response).status,503);
  store.set('yoyo-sky-v1.1-foundation-3https://example.com/yoyo-english-adventure/index.html',new Response('current'));
  events.fetch({request:{method:'GET',url:'https://example.com/yoyo-english-adventure/index.html'},respondWith:p=>response=p});assert.equal(await (await response).text(),'current');
  let intercepted=false;events.fetch({request:{method:'GET',url:'https://example.com/other-app/'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
  checks++;console.log('PASS SW precache paths, project-only cleanup/scope, waiting update, current cache, offline 503');
  const m=JSON.parse(fs.readFileSync('manifest.webmanifest'));for(const icon of m.icons)assert(fs.existsSync(icon.src));checks++;console.log('PASS manifest icon assets');
}
swChecks().then(()=>console.log(`${checks} regression groups passed. Browser/real-device tests remain separate.`)).catch(e=>{console.error(e);process.exitCode=1});
