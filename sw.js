// const CACHE_NAME = 'my-site-cache-v1';
// const urlsToCache = [
//     './css/main.css',
//     './img/arrow_down.svg',
//     './css/bootstrap.css',
//     './img/arrow_up.svg',
//     './img/reddit-sheet.png',
//     './img/updoot.png',
//     './js/main.js'
// ];

// addEventListener('install', e => {
//     browser.webRequest.onBeforeRequest.addListener(
//         logURL, {
//             urls: ["<all_urls>"]
//         }
//     );
// })


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