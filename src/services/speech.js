(function (global) {
  'use strict';
  function create({onStatus = () => {}, synth = global.speechSynthesis,
    Utterance = global.SpeechSynthesisUtterance} = {}) {
    let generation = 0, currentText = '', timer, state = 'idle', utterance;
    const status = (next, message = '') => {state = next; onStatus(next, message);};
    function stop() {
      generation++; clearTimeout(timer); currentText = ''; utterance = null;
      if (synth) synth.cancel();
      status('idle');
    }
    function play(texts, {toggle = false} = {}) {
      if (toggle && state === 'speaking' && currentText === texts[0]) {stop(); return;}
      stop();
      if (!synth || !Utterance) {status('error', 'Voice is unavailable on this browser. Try another browser.'); return;}
      const request = generation;
      function next(index) {
        if (request !== generation || index >= texts.length) {
          if (request === generation) {currentText = ''; status('idle');}
          return;
        }
        currentText = texts[index];
        utterance = new Utterance(currentText);
        utterance.lang = 'en-US'; utterance.rate = 0.78; utterance.pitch = 1.08;
        const voices = synth.getVoices();
        utterance.voice = voices.find(v => v.lang === 'en-US' && /Samantha|Ava|female/i.test(v.name)) ||
          voices.find(v => v.lang === 'en-US') || voices.find(v => /^en[-_]/i.test(v.lang)) || null;
        status('loading', 'Getting the voice ready… Tap the speaker if you cannot hear it.');
        let started = false;
        const failed = () => {
          if (request !== generation) return;
          generation++; clearTimeout(timer); synth.cancel(); currentText = '';
          status('error', 'Tap the speaker to listen. Check your volume if it stays quiet.');
        };
        utterance.onstart = () => {
          if (request !== generation) return;
          started = true; clearTimeout(timer); status('speaking', '🔊 Listening…');
          // Prevent a missing end callback from leaving the UI busy forever.
          timer = setTimeout(failed, Math.max(15000, currentText.length * 250));
        };
        utterance.onend = () => {
          if (request !== generation) return;
          clearTimeout(timer); next(index + 1);
        };
        utterance.onerror = failed;
        timer = setTimeout(() => {if (!started) failed();}, 5000);
        try {synth.speak(utterance);} catch {failed();}
      }
      // Call speak in the current click stack, even if voices are not loaded yet.
      // Browsers can choose their default voice; later requests use the new list.
      next(0);
    }
    function refreshVoices() {if (synth) synth.getVoices();}
    if (synth) {
      refreshVoices();
      synth.addEventListener?.('voiceschanged', refreshVoices);
    }
    global.addEventListener?.('pagehide', stop);
    return {play, stop, get currentText() {return currentText;}, get state() {return state;}};
  }
  global.YoyoSpeech = {create};
})(globalThis);
