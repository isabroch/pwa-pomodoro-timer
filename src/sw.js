const cacheName = "static-cache-v1";
const cacheAllowList = ["static-cache-v1"];
const urlsToCache = [
  "/",
  "index.html",
  "App.js",
  "img/icon_512.png",
  "img/icon_192.png",
];

self.addEventListener("install", function (e) {
  // if any part fails, install fails
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", function (e) {
  // if any part fails, activating fails
  e.waitUntil(
    // map through all existing caches
    caches.keys().then((activeCaches) =>
      Promise.all(
        activeCaches.map((activeCacheName) => {
          // if old cache isn't on allowed cache list, delete
          if (cacheAllowList.indexOf(activeCacheName) === -1) {
            return caches.delete(activeCacheName);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", function (e) {
  // hijack fetch request to check for cached versions
  e.respondWith(
    caches.match(e.request).then((cacheResponse) => {
      // if cached version exists, return
      if (cacheResponse) {
        return cacheResponse;
      }

      return fetch(e.request).then((fetchResponse) => {
        // check for valid fetched response
        // do not cache if invalid
        if (
          !fetchResponse ||
          fetchResponse.status !== 200 ||
          fetchResponse.type == "opaque"
        ) {
          return fetchResponse;
        }

        // cloning response. response is stream and is 'consumed', so we need one for browser to consume and one for cache to consume.
        const responseToCache = fetchResponse.clone();

        console.log(fetchResponse, responseToCache);

        // caching fetched response
        caches
          .open(cacheName)
          .then((cache) => cache.put(e.request, responseToCache));

        return fetchResponse;
      });
    })
  );
});

// handle notifications
self.addEventListener("notificationclick", function (event) {
  // event.notification.close();

  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (clients.length) {
        // check if at least one tab is already open
        clients[0].focus(); // focus on tab
        if (event.action) {
          clients[0].postMessage(event.action); // send message to trigger action
        }
      } else {
        self.clients.openWindow("/"); // open app
      }
    })
  );
});
