
const CACHE_NAME = 'remuneraciones-v3.0.0';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Priorizar red para evitar que una versión corrupta se quede pegada
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
