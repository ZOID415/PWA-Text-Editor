const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  // name of the cache storage
  cacheName: 'page-cache',
  plugins: [
    // name of plugin that will cache responses witht hese headers to a maximum age of 30 days
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, //30 days
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Implements asset caching
registerRoute(({ request }) => ['style', 'script', 'worker'].includes(request.destination),
new offlineFallback({
  // name of the cache storage.
  cacheName: 'asset-cache',
  plugins: [
    // name of plugin that will cache responses witht hese headers to a maximum age of 30 days
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 60,
      maxAgeSeconds: 30 * 24 * 60 * 60, //30 days
    })
  ],
})
);
