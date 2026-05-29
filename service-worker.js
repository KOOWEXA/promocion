const CACHE_NAME = 'koowexa-cache-v4';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './offline.html',
    './koo.jpg',
    './banner.jpg',
    './service.jpg',
    './shop.jpg',
    './perfil.jpg',
    './maqueta.jpg',
    './favicon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) return response;
                return fetch(event.request).catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./offline.html');
                    }
                    return new Response('Sin conexión', { status: 503, statusText: 'Service Unavailable' });
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});