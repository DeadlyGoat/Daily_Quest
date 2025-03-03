const CACHE_NAME = "manhwa-quest-cache-v1";
const urlsToCache = ["/", "/index.html", "/logo192.png", "/logo512.png"];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Manhwa Quest Reminder";
  const options = {
    body: data.body || "Don't forget to complete your workout and lifestyle quests today!",
    icon: "/logo192.png",
    badge: "/logo192.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
