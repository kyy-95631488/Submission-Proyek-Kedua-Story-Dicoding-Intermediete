importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.core.setCacheNameDetails({
  prefix: 'dicoding-story',
});

const CACHE_NAME = 'dicoding-story-v2';

const APP_SHELL = [
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/assets/index-cccboano.js', revision: '1' },
  // { url: '/scripts/index.js', revision: '1' },
  { url: '/assets/index-yrpki-zw.css', revision: '1' },
  // { url: '/styles/styles.css', revision: '1' },
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
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pages',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.setCatchHandler(({ event }) => {
  if (event.request.mode === 'navigate') {
    return caches.match('/index.html');
  }
  return Response.error();
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
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
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
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => ['script', 'style'].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

self.addEventListener('push', (event) => {
  let data = { title: 'Dicoding Story', body: 'New story added!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.options?.body || data.body,
    icon: '/favicon-192.png',
    badge: '/favicon-96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});

workbox.core.clientsClaim();

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});