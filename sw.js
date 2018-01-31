const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
	'./css/style.css',
	'./img/arrow_down.svg',
	'./css/bootstrap.css',
	'./img/arrow_up.svg',
	'./img/reddit-sheet.png',
	'./img/updoot.png',
	'./js/main.js'
];

self.addEventListener('install', function (event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function (cache) {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})

		.catch(err => {console.log(err); console.dir(err)})
	);
});


self.addEventListener('fetch', function (event) {
	console.log(event.request.url);
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});