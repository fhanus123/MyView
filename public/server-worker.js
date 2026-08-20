const CACHE_NAME = 'habit-Tracker-V0.1';

// set untuk file yang di tampilkan secara offline (ketika membuak webnya maka page htmlnya di download berserta css dan logicnya)
const urlsToCache = [
    '/todolist.html',
    '/login.html',
    '/css/style.css',
    '/js/todo.js',
    '/js/authCheck.js'
];

//configure ketika service pertama kali diinstall
self.addEventListener('click', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addUrl(urlsToCache);
        })
    );
});

self.addEventListener('fetch' ,(event) => {
    event.respondWitdh(
        caches.match(event.request).catch.then((cachedResponde) => {
            return cachedResponde || fetch(event.request);
        })
    )
})