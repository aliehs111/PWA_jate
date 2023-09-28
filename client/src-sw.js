const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching

//Cache Phase - Install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('assets').then((cache) => {
      return cache.addAll([
        '/index.html',
        '/src/images/logo.png',
        '/src/css/styles.css',
        '/src/js/index.js',
        '/src/js/install.js',
        '/src-sw.js',
      ]);
    })
  );
});
// Cache Phase - Activate service worker after it's installed
self.addEventListener('activate', (e) => 
  e.waitUntil(caches.keys().then((keyList) => 
    Promise.all(keyList.map((key) => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    })
  ))));

  // Cache Phase - Claim (when sw is initially registered, pages won't use it until the next load)
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Cache-first network first - sw checking the cache for a response and if it doesn't find it, it will fetch it:
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});


registerRoute();
