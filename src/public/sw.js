importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.core.setCacheNameDetails({
  prefix: 'dicoding-story',
});

const CACHE_NAME = 'dicoding-story-v3';

const APP_SHELL = [
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/favicon-192.png', revision: '1' },
  { url: '/favicon-512.png', revision: '1' },
  { url: '/favicon-96.png', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/images/pribadi-kartun.png', revision: '1' },
  { url: '/images/screenshot-desktop.png', revision: '1' },
  { url: '/images/screenshot-mobile.png', revision: '1' },
  { url: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css', revision: null },
  { url: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js', revision: null },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', revision: null },
];

workbox.precaching.precacheAndRoute(APP_SHELL, {
  ignoreURLParametersMatching: [/.*/],
  directoryIndex: '/',
});

workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev',
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-responses',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pages',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

self.addEventListener('push', (event) => {
  let body = event.data ? event.data.text() : 'New story added!';

  const options = {
    body,
    icon: '/favicon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification('Dicoding Story', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('dicoding-story-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});