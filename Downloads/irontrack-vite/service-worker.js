// ── IRON TRACK Service Worker ─────────────────────────────────────────────
const CACHE_NAME = 'irontrack-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;900&display=swap',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
];

// ── Install: cachear assets críticos ──────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cachear lo que se pueda, ignorar fallos individuales
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => null))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: limpiar caches viejos ───────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: network-first con fallback a cache ──────────────────────────────
self.addEventListener('fetch', (e) => {
  // Solo interceptar GET
  if (e.request.method !== 'GET') return;

  // Supabase y APIs externas: siempre network (no cachear datos)
  const url = new URL(e.request.url);
  if (url.hostname.includes('supabase') || 
      url.hostname.includes('onesignal') ||
      url.hostname.includes('api.')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Guardar copia fresca en cache
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sin red: intentar desde cache
        return caches.match(e.request).then(cached => {
          if (cached) return cached;
          // Fallback final: página principal cacheada
          return caches.match('/') || caches.match('/index.html');
        });
      })
  );
});

// ── Push Notifications ────────────────────────────────────────────────────
self.addEventListener('push', (e) => {
  const data = e.data?.json() || {};
  const title = data.title || 'IRON TRACK';
  const options = {
    body: data.body || 'Tenés un entrenamiento pendiente',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open',    title: 'Ver entrenamiento' },
      { action: 'dismiss', title: 'Más tarde' },
    ],
    tag: data.tag || 'irontrack-notif',
    renotify: true,
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// ── Notification click ────────────────────────────────────────────────────
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(url));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
