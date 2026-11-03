/* Bump CACHE whenever a shipped application asset changes. */
const CACHE = 'yoyo-sky-v1.1-visual-4';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg',
  './styles/app.css', './src/app.js', './src/services/storage.js',
  './src/services/speech.js', './src/services/pwa.js',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png', './assets/icons/apple-touch-icon.png',
  './assets/illustrations/airplane.webp',
  './assets/illustrations/aurora-borealis.webp',
  './assets/illustrations/bat.webp',
  './assets/illustrations/bird.webp',
  './assets/illustrations/blimp.webp',
  './assets/illustrations/cloud.webp',
  './assets/illustrations/comet.webp',
  './assets/illustrations/helicopter.webp',
  './assets/illustrations/hot-air-balloon.webp',
  './assets/illustrations/kite.webp',
  './assets/illustrations/lightning.webp',
  './assets/illustrations/moon.webp',
  './assets/illustrations/planet.webp',
  './assets/illustrations/rain.webp',
  './assets/illustrations/rainbow.webp',
  './assets/illustrations/rocket.webp',
  './assets/illustrations/satellite.webp',
  './assets/illustrations/snow.webp',
  './assets/illustrations/star.webp',
  './assets/illustrations/sun.webp'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('yoyo-sky-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {return await fetch(event.request);} catch {
      // index.html and the directory URL are precached. Do not return HTML for missing JS/images.
      return new Response('This resource is not available offline. Please reconnect.', {
        status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
      });
    }
  })());
});
