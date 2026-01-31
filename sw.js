
const CACHE_NAME = 'remuneraciones-v2.9.0';

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
  // En Netlify dejamos que la red maneje las peticiones de módulos para evitar el error 404
  if (event.request.method !== 'GET' || event.request.url.includes('esm.sh')) return;
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
