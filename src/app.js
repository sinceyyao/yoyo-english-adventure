const words=[['sun','☀️','I can see the sun.'],['moon','🌙','I can see the moon.'],['star','⭐','I can see a star.'],['cloud','☁️','I can see a cloud.'],['rainbow','🌈','I can see a rainbow.'],['bird','🦅','I can see a bird.'],['airplane','✈️','I can see an airplane.'],['rain','🌧️','I can see rain.'],['kite','🪁','I can see a kite.'],['helicopter','🚁','I can see a helicopter.'],['rocket','🚀','I can see a rocket.'],['planet','🌍','I can see a planet.'],['hot air balloon','🎈','I can see a hot air balloon.'],['snow','❄️','I can see snow.'],['lightning','⚡','I can see lightning.'],['comet','☄️','I can see a comet.'],['satellite','🛰️','I can see a satellite.'],['blimp','🎈','I can see a blimp.'],['aurora borealis','🌌','I can see the northern lights.'],['bat','🦇','I can see a bat.']];
const quiz=[{q:'Find the sun!',a:0,opts:[0,1,2,3]},{q:'Where is the moon?',a:1,opts:[4,0,1,6]},{q:'Find the rainbow!',a:4,opts:[3,4,7,2]},{q:'Find the airplane!',a:6,opts:[9,5,10,6]},{q:'Where is the star?',a:2,opts:[1,0,2,4]},{q:'Find the clouds!',a:3,opts:[3,13,7,1]},{q:'What can you see at night?',a:1,opts:[0,1,4,8]},{q:'What can you see on a sunny day?',a:0,opts:[0,13,14,1]},{q:'Which one can fly in the sky?',a:6,opts:[11,3,6,7]},{q:'I can see the sun and clouds.',scene:'☀️ ☁️',a:0,opts:[1,0,4,2]},{q:'I can see the moon and stars.',scene:'🌙 ⭐ ⭐',a:1,opts:[0,6,4,1]},{q:'I can see a rainbow and a bird.',scene:'🌈 🦅',a:4,opts:[4,1,10,0]}];

// Stable array positions are the V1.0 persistent IDs. Never reorder these words.
const illustrationNames = words.map(word => word[0].replaceAll(' ', '-'));
const progressStore = YoyoStorage.create(() => window.localStorage, showStorageStatus);
let data = progressStore.data;
let view = 'home', wordIndex = 0, filter = 'core', qi = 0, selected = null;
let wrongThisRun = [], firstTry = {};
const voice = YoyoSpeech.create({onStatus: showSpeechStatus});
const h = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function icon(name, extra = '') {
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
    learn: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    quiz: '<path d="M8 7h8c5 0 7 12 3 12l-4-3H9l-4 3C1 19 3 7 8 7Z"/><path d="M8 10v4M6 12h4m6-1h.1m2 3h.1"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9Z"/>',
    review: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
    sound: '<path d="m11 4-5 4H3v8h3l5 4Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    left: '<path d="m14 6-6 6 6 6M8 12h13"/>',
    right: '<path d="m10 6 6 6-6 6M3 12h13"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>'
  };
  return `<svg class="icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
}
function art(id, className = '', {clouds = false} = {}) {
  const source = `./assets/illustrations/${illustrationNames[id]}.webp`;
  const image = `<img src="${source}" alt="${h(clouds ? 'clouds' : words[id][0])}" width="512" height="512" draggable="false">`;
  return `<span class="word-art ${className} ${clouds ? 'cloud-pair' : ''}">${image}${clouds ? image.replace('alt="clouds"', 'alt=""') : ''}<span class="art-fallback" aria-hidden="true">${words[id][1]}</span></span>`;
}
function audioButton(text, label, action = 'speak', extra = '') {
  return `<button class="speak ${extra}" data-action="${action}" data-text="${h(text)}" data-speech="${h(text)}" aria-pressed="false">${icon('sound')}<span>${label}</span></button>`;
}
function showStorageStatus(message) {
  const el = document.getElementById('storage-status');
  el.textContent = message;
  if (message) {
    const retry = document.createElement('button');
    retry.textContent = 'Try saving again'; retry.onclick = () => save(); el.append(retry);
  }
}
function save() {return progressStore.save(data);}
function showSpeechStatus(state, message) {
  document.getElementById('speech-status').textContent = message;
  const local = document.querySelector?.('[data-voice-status]');
  if (local) {
    local.textContent = state === 'speaking' ? 'Listen closely…' : state === 'loading' ? 'Getting the voice ready…' : state === 'error' ? 'No sound? Tap the speaker to try again.' : 'Tap the speaker to listen again.';
    local.dataset.state = state;
  }
  document.querySelectorAll('[data-speech]').forEach(button => {
    const active = state === 'speaking' && button.dataset.speech === voice.currentText;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('is-speaking', active);
  });
}
function speak(text) {voice.play([text], {toggle: true});}
function questionText() {const x = quiz[qi]; return x.scene ? `${x.q} Tap the ${words[x.a][0]}.` : x.q;}
function readQuestion() {voice.play([questionText()]);}
function enterQuestion() {readQuestion();}
function go(nextView) {
  voice.stop(); view = nextView; render(); window.scrollTo(0, 0);
  document.querySelector?.('h1')?.focus({preventScroll: true});
  if (view === 'quiz') enterQuestion();
}
function head(title, kicker = 'SKY EXPLORER') {
  return `<header class="page-head"><button class="back" data-action="go" data-view="home" aria-label="Back to Home">${icon('left')}</button><div><span class="eyebrow">${kicker}</span><h1 tabindex="-1">${title}</h1></div><span class="tiny-sun" aria-hidden="true">☀</span></header>`;
}
function nav() {
  return `<nav class="nav" aria-label="Main navigation">${[['home','home','Home'],['learn','learn','Words'],['quiz','quiz','Quiz'],['progress','star','My Stars']].map(([id, symbol, label]) => `<button class="${view === id ? 'active' : ''}" data-action="${id === 'quiz' ? 'startQuiz' : 'go'}" data-view="${id}" ${view === id ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span></button>`).join('')}</nav>`;
}
function progress(current, total) {
  return `<div class="progress" role="progressbar" aria-label="Learning progress" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${current}"><span style="width:${current / total * 100}%"></span></div>`;
}
function trickyWords() {return Object.entries(data.misses).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1]);}
function wordChips(ids, showCounts = false) {
  return `<div class="wordchips">${ids.map(id => `<span class="chip">${art(id)}<span>${h(words[id][0])}</span>${showCounts ? `<small class="miss-count" aria-label="${data.misses[id]} incorrect choices">×${data.misses[id]}</small>` : ''}</span>`).join('')}</div>`;
}
function renderHome() {
  return `<header class="home-head"><span class="brand"><span class="brand-mark" aria-hidden="true">☀</span> Yoyo's English</span><span class="version">Sky · 1.1</span></header>
    <section class="hero"><span class="eyebrow">LET'S LOOK UP</span><h1 tabindex="-1">Sky Explorer</h1><p>A little wonder. A big blue sky.</p><div class="sky-art" aria-hidden="true">${art(0, 'hero-sun')}${art(4, 'hero-rainbow')}${art(3, 'hero-cloud')}</div><button class="button wide" data-action="go" data-view="learn">${icon('learn')} Explore the sky ${icon('right')}</button><span class="hero-note">20 picture cards · Listen & say</span></section>
    <button class="quiz-entry" data-action="startQuiz"><span class="entry-icon">${icon('quiz')}</span><span><strong>Play Sky Quiz</strong><small>12 questions · 3 little adventures</small></span>${icon('right')}</button>
    <div class="quick-links"><button class="quick-link" data-action="go" data-view="review"><span class="quick-icon lavender">${icon('review')}</span><strong>A little practice</strong><small>Listen & try again</small></button><button class="quick-link" data-action="go" data-view="progress"><span class="quick-icon yellow">${icon('star')}</span><strong>My Stars</strong><small>${data.sessions.length ? `${data.sessions.length} adventure${data.sessions.length === 1 ? '' : 's'} finished` : 'Watch your learning grow'}</small></button></div>
    <p class="home-foot">Made for Yoyo <span>·</span> Wonders GK · Unit 8 Week 3</p>`;
}
function renderLearn() {
  const ids = filter === 'core' ? [...Array(8).keys()] : [...Array(12).keys()].map(i => i + 8);
  if (!ids.includes(wordIndex)) wordIndex = ids[0];
  const w = words[wordIndex], pos = ids.indexOf(wordIndex);
  if (!data.seen.includes(wordIndex)) {data.seen.push(wordIndex); save();}
  return head('Word cards') + `<div class="switch" role="group" aria-label="Word group"><button class="${filter === 'core' ? 'on' : ''}" data-action="filter" data-filter="core" aria-pressed="${filter === 'core'}">${icon('star')} Core <span>8</span></button><button class="${filter === 'more' ? 'on' : ''}" data-action="filter" data-filter="more" aria-pressed="${filter === 'more'}">${icon('learn')} Explore <span>12</span></button></div>
    <div class="card-position"><span>Card <b>${pos + 1}</b> of ${ids.length}</span><span>${filter === 'core' ? 'Core words' : 'More to discover'}</span></div>${progress(pos + 1, ids.length)}
    <section class="flash"><button class="picture-listen" data-action="speak" data-text="${h(w[0])}" data-speech="${h(w[0])}" aria-label="Listen to ${h(w[0])}" aria-pressed="false">${art(wordIndex)}<span class="picture-sound">${icon('sound')}</span></button><h2>${h(w[0])}</h2><p class="sentence">${h(w[2])}</p>${audioButton(w[2], 'Hear the sentence', 'speak', 'sentence-button')}</section>
    <div class="voice-hint" data-voice-status>Tap the picture to hear the word.</div><div class="word-controls"><button class="button secondary" data-action="moveWord" data-step="-1" aria-label="Previous word">${icon('left')} Previous</button><button class="button" data-action="moveWord" data-step="1" aria-label="Next word">Next ${icon('right')}</button></div>`;
}
function renderQuiz() {
  const x = quiz[qi], correct = selected === x.a;
  const levels = ['LOOK & FIND', 'SKY DETECTIVE', 'LISTEN & SAY'];
  const level = qi < 6 ? 0 : qi < 9 ? 1 : 2;
  const sceneIds = [[0, 3, 3], [1, 2, 2], [4, 5]][qi - 9];
  return head('Sky Quiz', `LEVEL ${level + 1} · ${levels[level]}`) + `<div class="quiz-position"><span>${level === 0 ? 'Look. Listen. Find it!' : level === 1 ? 'What do you see in the sky?' : 'Listen to the whole sentence.'}</span><b>${qi + 1}<span> / 12</span></b></div>${progress(qi + 1, quiz.length)}
    ${x.scene ? `<div class="scene" role="img" aria-label="${h(x.q)}">${sceneIds.map(id => art(id)).join('')}</div>` : ''}<h2 class="question" tabindex="-1">${h(x.q)}</h2>${x.scene ? `<p class="tap-instruction">Tap the ${h(words[x.a][0])}.</p>` : ''}
    ${audioButton(questionText(), 'Listen to the question', 'readQuestion', 'question-speaker')}<div class="voice-hint" data-voice-status>Listen, then choose a picture.</div>
    <div class="choices" role="group" aria-label="Picture answers">${x.opts.map(id => `<button class="choice ${selected === id ? correct ? 'correct' : 'wrong' : ''}" data-action="choose" data-id="${id}" aria-label="${h(qi === 5 && id === 3 ? 'clouds' : words[id][0])}" ${correct ? 'disabled' : ''}>${art(id, '', {clouds: qi === 5 && id === 3})}${selected === id ? `<span class="answer-mark">${icon(correct ? 'star' : 'review')}</span>` : ''}${correct && id === x.a ? `<span class="choiceText">${h(words[id][0])}</span>` : ''}</button>`).join('')}</div>
    <div class="feedback ${correct ? 'success' : selected !== null ? 'retry' : ''}" aria-live="polite">${selected === null ? '<span class="feedback-prompt">Take your time. You can listen again.</span>' : `<span class="feedback-symbol">${icon(correct ? 'star' : 'review')}</span><strong>${correct ? 'Great job! A star for you.' : 'Nice try. Have another go!'}</strong>${correct ? audioButton(x.scene ? x.q : words[x.a][2], 'Listen & say it', 'speak', 'feedback-listen') : ''}`}</div>
    <button class="button wide next-question" ${!correct ? 'disabled' : ''} data-action="nextQuestion">${qi === 11 ? 'Finish adventure' : 'Next'} ${icon(qi === 11 ? 'star' : 'right')}</button>`;
}
function renderResult() {
  const score = Object.values(firstTry).filter(Boolean).length;
  const ids = [...new Set(wrongThisRun)];
  return head('You did it!', 'ADVENTURE COMPLETE') + `<section class="result-celebration">${art(2)}<h2>A sky full of discoveries.</h2><p>You finished all 12 questions!</p></section><section class="panel parent-summary"><span class="eyebrow">A NOTE FOR GROWN-UPS</span><div class="result-score"><div><strong>${score}<span> / 12</span></strong><p>First-try correct answers</p></div><span class="score-percent">${Math.round(score / quiz.length * 100)}%</span></div><p class="hint">A first try is one step in learning. Keep listening and exploring together.</p>${ids.length ? `<h3>A little more practice</h3>${wordChips(ids)}` : '<p class="perfect-note">Every question right on the first try. Lovely listening!</p>'}</section><button class="button wide" data-action="go" data-view="${ids.length ? 'review' : 'learn'}">${icon(ids.length ? 'review' : 'learn')}${ids.length ? 'Practice together' : 'Explore more words'}</button><div class="result-links"><button class="text-button" data-action="startQuiz">Play again</button><button class="text-button" data-action="go" data-view="progress">My learning stars ${icon('right')}</button></div>`;
}
function renderProgress() {
  const total = data.sessions.length;
  const avg = total ? Math.round(data.sessions.reduce((sum, s) => sum + s.score, 0) / total) : 0;
  const tricky = trickyWords();
  return head('My learning stars') + `<p class="page-intro">Little steps, lovely discoveries.</p><div class="stats"><div class="stat"><span class="stat-icon blue">${icon('learn')}</span><strong>${data.seen.length}<small>/20</small></strong><span>Words explored</span></div><div class="stat"><span class="stat-icon yellow">${icon('star')}</span><strong>${total}</strong><span>Quizzes finished</span></div><div class="stat"><strong>${avg}<small>/12</small></strong><span>Average first try</span></div><div class="stat"><strong>${total ? Math.max(...data.sessions.map(s => s.score)) : 0}<small>/12</small></strong><span>Best first try</span></div></div><p class="hint stats-note">Explored means seen, not yet mastered.</p>
    <section class="panel"><div class="section-heading"><h2>A little practice</h2>${icon('review')}</div>${tricky.length ? wordChips(tricky.map(([id]) => Number(id)), true) : '<p class="muted">No tricky words yet. Try a sky quiz!</p>'}${tricky.length ? '<p class="hint practice-count-note">Numbers show past incorrect choices.</p>' : ''}<button class="button secondary wide" data-action="go" data-view="review">${icon('sound')} Listen & practice</button></section>
    <section class="panel recent"><h2>Recent adventures</h2>${total ? `<ul>${data.sessions.slice(-5).reverse().map(s => `<li><span class="session-star">${icon('star')}</span><span><strong>${s.score} / 12</strong><small>First-try correct</small></span><time datetime="${new Date(s.time).toISOString()}">${new Date(s.time).toLocaleDateString('en', {month:'short', day:'numeric', year:'numeric'})}</time></li>`).join('')}</ul>` : '<p class="muted">Your first adventure is waiting.</p>'}</section><p class="device-note">Saved in this browser, on this device.<br>Clearing website data can erase your progress.</p>`;
}
function renderReview() {
  const ids = trickyWords().map(([id]) => Number(id));
  return head('A little practice') + `<p class="page-intro">Listen, say it, and try again.</p>${ids.length ? `<div class="review-list">${ids.map(id => `<article class="review-card"><button class="review-picture" data-action="speak" data-text="${h(words[id][0])}" data-speech="${h(words[id][0])}" aria-label="Listen to ${h(words[id][0])}" aria-pressed="false">${art(id)}<span>${icon('sound')}</span></button><div><h2>${h(words[id][0])}</h2><p>${h(words[id][2])}</p>${audioButton(words[id][2], 'Hear sentence', 'speak', 'small-speak')}</div></article>`).join('')}</div>` : `<section class="empty-state">${art(2)}<h2>A fresh sky!</h2><p>Play a quiz to find words<br>we can practice together.</p></section>`}<div class="voice-hint" data-voice-status>Tap a picture to hear the word.</div><button class="button wide" data-action="startQuiz">${icon('quiz')} Play Sky Quiz ${icon('right')}</button>`;
}
function render() {
  const renderers = {home:renderHome, learn:renderLearn, quiz:renderQuiz, result:renderResult, progress:renderProgress, review:renderReview};
  document.getElementById('root').innerHTML = `<main class="view view-${view}">${renderers[view]()}</main>${nav()}`;
  document.title = `${{home:'Sky Explorer', learn:'Word cards', quiz:'Sky Quiz', result:'Adventure complete', progress:'My learning stars', review:'A little practice'}[view]} · Yoyo's English Adventure`;
  document.querySelectorAll('.word-art img').forEach(image => {
    image.addEventListener('error', () => image.parentElement.classList.add('is-missing'), {once:true});
    if (image.complete && !image.naturalWidth) image.parentElement.classList.add('is-missing');
  });
}
function setFilter(next) {voice.stop(); filter = next; wordIndex = next === 'core' ? 0 : 8; render();}
function moveWord(step) {
  voice.stop(); const ids = filter === 'core' ? [...Array(8).keys()] : [...Array(12).keys()].map(i => i + 8);
  wordIndex = ids[(ids.indexOf(wordIndex) + step + ids.length) % ids.length]; render();
}
function startQuiz() {qi = 0; selected = null; wrongThisRun = []; firstTry = {}; go('quiz');}
function choose(id) {
  const x = quiz[qi]; if (view !== 'quiz' || !x.opts.includes(id) || selected === x.a) return;
  voice.stop(); if (firstTry[qi] === undefined) firstTry[qi] = id === x.a;
  if (id !== x.a) {data.misses[x.a] = (data.misses[x.a] || 0) + 1; wrongThisRun.push(x.a); save();}
  selected = id; render();
  // Preserve keyboard continuity after replacing the selected answer DOM.
  document.querySelector?.(`[data-action="${id === x.a ? 'nextQuestion' : 'choose'}"]${id === x.a ? '' : `[data-id="${id}"]`}`)?.focus({preventScroll:true});
  if (id === x.a) voice.play(['Great job!', x.scene ? x.q : words[id][2]]);
}
function nextQuestion() {
  if (view !== 'quiz' || selected !== quiz[qi].a) return;
  voice.stop();
  if (qi === quiz.length - 1) {
    data.sessions.push({time:Date.now(), score:Object.values(firstTry).filter(Boolean).length}); save(); go('result');
  } else {qi++; selected = null; render(); window.scrollTo(0, 0); document.querySelector?.('.question')?.focus({preventScroll:true}); enterQuestion();}
}
document.getElementById('root').addEventListener?.('click', event => {
  const button = event.target.closest('button[data-action]'); if (!button || button.disabled) return;
  const {action} = button.dataset;
  if (action === 'go') go(button.dataset.view);
  if (action === 'speak') speak(button.dataset.text);
  if (action === 'filter') setFilter(button.dataset.filter);
  if (action === 'moveWord') moveWord(Number(button.dataset.step));
  if (action === 'choose') choose(Number(button.dataset.id));
  if (action === 'readQuestion') readQuestion();
  if (action === 'startQuiz') startQuiz();
  if (action === 'nextQuestion') nextQuestion();
});
render(); YoyoPWA.start(() => view === 'quiz');
