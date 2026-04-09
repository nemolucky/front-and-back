const CACHE_NAME = 'app-shell-v4';
const DYNAMIC_CACHE_NAME = 'dynamic-content-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/content/home.html',
  '/content/about.html',
  '/icons/favicon-16x16.png',
  '/icons/favicon-32x32.png',
  '/icons/apple-touch-icon.png',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  // Не перехватываем long-polling/WebSocket handshake и служебные API,
  // чтобы исключить ошибки respondWith при сетевых колебаниях.
  if (url.pathname.startsWith('/socket.io/') || url.pathname === '/subscribe' || url.pathname === '/unsubscribe') {
    return;
  }

  if (url.pathname.startsWith('/content/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/content/home.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
    })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Новое уведомление', body: '', reminderId: null, actions: [] };
  if (event.data) {
    data = event.data.json();
  }

  const reminderId = data.reminderId ? Number(data.reminderId) : null;
  const actions = Array.isArray(data.actions) ? data.actions : [];

  const options = {
    body: data.body,
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/favicon-32x32.png',
    data: { reminderId },
    actions
  };

  if (actions.length > 0 || reminderId) {
    options.requireInteraction = true;
  }

  if (reminderId) {
    options.tag = `reminder-${reminderId}`;
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  const { action, notification } = event;
  const reminderId = notification?.data?.reminderId;

  if (action === 'snooze' && reminderId) {
    event.waitUntil(
      fetch(`/snooze?reminderId=${encodeURIComponent(reminderId)}`, { method: 'POST' })
        .then((res) => res.json().catch(() => null))
        .then((payload) =>
          clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            windowClients.forEach((client) => {
              client.postMessage({
                type: 'REMINDER_SNOOZED',
                reminderId: payload?.reminderId ?? reminderId,
                reminderTime: payload?.reminderTime ?? null
              });
            });
          })
        )
        .then(() => notification.close())
        .catch((err) => console.error('Snooze failed:', err))
    );
    return;
  }

  notification.close();
  event.waitUntil(clients.openWindow('/'));
});
