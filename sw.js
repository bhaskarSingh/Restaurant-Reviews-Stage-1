var CACHE_NAME = 'restaurant-review-cache-v1';
var urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/main.js',
  '/data/restaurants.json',
  './index.html',
  './restaurant.html',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(function(err){
          console.error('Error, not able to cache resources', err);
      })
  );
});

self.addEventListener('activate', function(event) {

    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1 && cacheName.startsWith('restaurant-review')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
});



self.addEventListener('fetch', function(event) {

    event.respondWith(
      caches.match(event.request, {ignoreSearch: true})
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
      .catch(function(err){
          console.error('Error fetching resources', err);
      })
    );
});