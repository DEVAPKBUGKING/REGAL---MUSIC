const CACHE_NAME = 'regal-v2';
const ASSETS = ['/', '/index.html', '/manifest.json', '/logo.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // ===== JANGAN INTERCEPT REQUEST KE TELEGRAM / UPLOAD =====
  const url = new URL(event.request.url);
  if (url.hostname.includes('api.telegram.org') || url.pathname.includes('/upload')) {
    // Biarin request jalan normal (gak di-cache)
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
