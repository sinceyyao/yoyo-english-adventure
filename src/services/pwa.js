(function (global) {
  'use strict';
  function start(isQuiz) {
    if (!('serviceWorker' in navigator) || !global.isSecureContext) return;
    const panel = document.getElementById('update-status');
    let accepted = false, waitingWorker = null, displayedWorker = null;
    function drawOffer() {
      if (!waitingWorker) return;
      if (isQuiz()) {panel.textContent = ''; displayedWorker = null; return;}
      if (displayedWorker === waitingWorker) return;
      const worker = waitingWorker;
      displayedWorker = worker;
      panel.textContent = 'A new version is ready. Update after your quiz.';
      const button = document.createElement('button');
      button.textContent = 'Update now';
      button.onclick = () => {
        if (isQuiz()) {
          panel.firstChild.textContent = 'Finish your quiz or return Home before updating. ';
          return;
        }
        accepted = true;
        button.disabled = true;
        worker.postMessage({type: 'SKIP_WAITING'});
      };
      panel.append(button);
    }
    function offer(worker) {waitingWorker = worker; drawOffer();}
    // App click delegation runs first, so view transitions can safely reveal a waiting update.
    document.getElementById('root').addEventListener('click', drawOffer);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (accepted) global.location.reload();
    });
    navigator.serviceWorker.register('./sw.js').then(reg => {
      if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) offer(worker);
        });
      });
    }).catch(() => {panel.textContent = 'Offline setup is unavailable. You can keep learning online.';});
  }
  global.YoyoPWA = {start};
})(globalThis);
