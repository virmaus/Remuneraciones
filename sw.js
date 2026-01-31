
const CACHE_NAME = 'remuneraciones-pro-v3';
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com'
];

// Instalación inmediata
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usamos addAll de forma individual para evitar que un fallo bloquee todo
      return Promise.allSettled(ASSETS.map(url => cache.add(url)));
    })
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Estrategia: Network-First con fallback a Cache para asegurar actualizaciones
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar y guardar en caché si la respuesta es válida
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar desde el caché
        return caches.match(event.request);
      })
  );
});
