/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = 'swayam-examcard-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/types.ts',
  '/src/data/translations.ts',
  '/src/data/exams.ts',
  '/src/db/localDb.ts',
  '/src/logic/wellnessRules.ts',
  '/src/logic/tests.ts',
  '/metadata.json'
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // We can do an optional pre-cache. In dev mode sometimes index paths have cache hits
        return cache.addAll(ASSETS_TO_CACHE).catch(e => {
          console.warn("Pre-cache asset warning (non-blocking in dev mode):", e);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Avoid non-GET request cache attempts (e.g. Chrome-extension etc)
  if (event.request.method !== 'GET') return;
  // Ignore analytics, browser-sync, or hot reload endpoints
  const urlStr = event.request.url;
  if (urlStr.includes('/ws') || urlStr.includes('__vite_') || urlStr.includes('localhost:')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch updated asset behind the scenes to refresh cache
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {/* ignore fetch errors offline */});
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        }).catch(() => {
          // Offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
