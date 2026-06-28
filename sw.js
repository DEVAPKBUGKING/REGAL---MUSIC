// ============================================================
// SERVICE WORKER — REGAL MUSIC
// ============================================================

const CACHE_NAME = 'regal-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

// === INSTALL: cache aset penting ===
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache terbuka');
        return cache.addAll(ASSETS);
      })
      .catch(err => console.log('❌ Gagal cache aset:', err))
  );
});

// === ACTIVATE: hapus cache lama ===
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// === FETCH: ambil dari cache dulu, kalo gak ada baru dari network ===
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // dari cache
        }
        return fetch(event.request).then(networkResponse => {
          // Simpan response ke cache buat下次
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return networkResponse;
        });
      })
  );
});
