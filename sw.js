const CACHE = 'ok-v1';
const ASSETS = [
  './',
  './index.html',
  './assets/icon.svg',
  './src/app.js',
  './src/lib/router.js',
  './src/components/shell/app-root.js',
  './src/workbench/db.js',
  './src/views/view-dashboard.js',
  './src/views/view-tasks.js',
  './src/views/view-notes.js',
  './src/views/view-pomodoro.js',
  './src/views/view-habits.js',
  './src/views/view-kanban.js',
  './src/views/view-calendar.js',
  './src/views/view-docs.js',
  './src/views/view-search.js',
  './src/views/view-settings.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  // Cache-first for same-origin; network-first for CDN ESM with fallback
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match('./index.html')))
    );
  } else if (url.hostname.endsWith('esm.run') || url.hostname.endsWith('unpkg.com') || url.hostname.endsWith('cdn.jsdelivr.net')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
  }
});

