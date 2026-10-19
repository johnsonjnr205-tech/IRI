/* Iconic Research Institute — Service Worker */
/* Bump CACHE_VERSION whenever you deploy changes so old caches get replaced. */
const CACHE_VERSION = 'iri-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/service.html',
  '/payment.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

/* Install: pre-cache the core pages/assets */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

/* Activate: remove any old-version caches */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* Fetch: cache-first for same-origin GET requests, fall back to network, then offline page if available */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests on our own origin — let everything else (POST to
  // Formspree, WhatsApp links, Google Fonts, etc.) go straight to the network.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Cache a copy of newly-fetched same-origin pages/assets for next time
          const responseClone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Offline fallback for page navigations
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
