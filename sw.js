const CACHE_NAME = 'directlychat-v2';
const FONT_CACHE = 'directlychat-fonts-v1';

// Assets to cache on install (including Google Fonts CSS)
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/style.css',
  '/script.js',
  '/favicon-32x32.png',
  '/android-icon-192x192.png',
  '/android-icon-512x512.png',
  '/apple-icon-180x180.png',
  '/logo.png',
  'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap'
];

// Font file URL patterns (will be cached on demand)
const FONT_URLS = [
  'https://fonts.gstatic.com/',
  'fonts.gstatic.com'
];

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== FONT_CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for fonts, then cache-first for assets, network fallback
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Special handling for font files (Google Fonts)
  if (FONT_URLS.some(fontUrl => url.includes(fontUrl))) {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => {
      // Offline fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    })
  );
});
