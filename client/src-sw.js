const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);
//set up service worker to use cashe first strategy which means that it will first check if the resource is available in the cache and if it is not it will fetch it from the network and then store it in the cache
const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});
//Use the workbox library to specify the url to use to prepopulate the cache
warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});
//when a user clicks on a link or a url it checks if the request's mode is navigate.  If so it will use the pageCache strategy to fetch the page
registerRoute(({ request }) => request.mode === "navigate", pageCache);

registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "asset-cache", //where the assets will be stored
    plugins: [
      new CacheableResponsePlugin({
        //only cache responses with a status of 0 or 200 should be cacheable
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, //cache will be stored and available for 30 days
        maxEntries: 60, //up to 60 entries will be stored
      }),
    ],
  })
);

// TODO: Implement asset caching
