const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  './img/arrow_down.svg',
  './img/reddit-sheet.png',
  './img/updoot.png'
];

addEventListener('install', e => {
  fetch('./rev-manifest.json')
  .then(blob => blob.json())
  .then(blob => Object.keys(blob).forEach(cur => urlsToCache.push(blob[cur])));
  debugger
  e.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log(err))
  )

})


// addEventListener('fetch', e => {
//     e.respondWith(
//         caches.match(e.request)
//         .then(res => console.log(res))
//         .then(res => res || fetch(e.request))
//     )
// })

// // self.addEventListener('fetch', function (event) {
// // 	event.respondWith(
// // 		caches.match(event.request)
// // 		.then(function (response) {
// // 			return response || fetch(event.request);
// // 		})

// // 		.catch(err => console.log(err))
// // 	)
// // });

// // self.addEventListener('install', function (event) {
// //   // Perform install steps
// //   event.waitUntil(
// //     caches.open(CACHE_NAME)
// //     .then(function (cache) {
// //       console.log('Opened cache');
// //       return cache.addAll(urlsToCache);
// //     })

// //     .catch(err => console.log(err))
// //   );
// // });
