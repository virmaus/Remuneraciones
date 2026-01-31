const CACHE_NAME = 'remun-offline-v4.3.5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url))
      );
    })
  );
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
  // Solo procesar peticiones GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  // IMPORTANTE: Solo interceptar peticiones http o https. 
  // Ignora protocolos chrome-extension:// que causan errores de put en caché.
  if (!url.protocol.startsWith('http')) return;

  // Ignorar dominios de terceros que están fallando por CSP (ej: excalidraw de extensiones)
  if (url.hostname.includes('excalidraw')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Solo cachear respuestas válidas de nuestro origen o de CDNs de confianza
        const isSelf = url.origin === self.location.origin;
        const isCdn = url.hostname.includes('esm.sh') || url.hostname.includes('tailwindcss.com');
        
        if (networkResponse && networkResponse.status === 200 && (isSelf || isCdn)) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(e => console.debug('Cache put failed', e));
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});