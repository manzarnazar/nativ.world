importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: "enter_here_your_api_key",
  authDomain: "enter_here_your_auth_domain",
  projectId: "enter_here_your_project_id",
  storageBucket: "enter_here_your_storage_bucket",
  messagingSenderId: "enter_here_your_messaging_sender_id",
  appId: "enter_here_your_app_id",
  measurementId: "enter_here_your_measurement_id"
};

firebase?.initializeApp(firebaseConfig)
const messaging = firebase.messaging();

// ─── PWA Cache Config ────────────────────────────────────────────────────────
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `estay-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `estay-images-${CACHE_VERSION}`;
const ALL_CACHES = [STATIC_CACHE, IMAGE_CACHE];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're offline – eStay</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 100dvh; gap: 16px;
      padding: 32px; text-align: center; background: #fff; color: #111;
    }
    img { width: 80px; height: 80px; border-radius: 18px; }
    h1 { font-size: 22px; font-weight: 600; }
    p { font-size: 14px; color: #666; max-width: 280px; line-height: 1.5; }
    button {
      margin-top: 8px; padding: 10px 28px; font-size: 14px; font-weight: 500;
      color: #fff; background: #111; border: none; border-radius: 10px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <img src="/web-app-manifest-192x192.png" alt="eStay" />
  <h1>You're offline</h1>
  <p>No internet connection. Check your network and try again.</p>
  <button onclick="location.reload()">Retry</button>
</body>
</html>`;

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return Promise.allSettled([
        cache.add('/web-app-manifest-192x192.png'),
        cache.add('/apple-touch-icon.png'),
      ]);
    })
  );
});

self.addEventListener('activate', function (event) {
  // Remove old caches
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) { return !ALL_CACHES.includes(key); })
            .map(function (key) { return caches.delete(key); })
        );
      })
    ])
  );
});

// ─── Fetch Interception ──────────────────────────────────────────────────────
self.addEventListener('fetch', function (event) {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin API calls, and Next.js internals
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.hostname !== self.location.hostname) return;
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  // Images → cache-first
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(function (cache) {
        return cache.match(request).then(function (cached) {
          if (cached) return cached;
          return fetch(request).then(function (response) {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(function () { return cached; });
        });
      })
    );
    return;
  }

  // Static assets (_next/static) → stale-while-revalidate
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(function (cache) {
        return cache.match(request).then(function (cached) {
          const networkFetch = fetch(request).then(function (response) {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // Navigation (HTML pages) → network-first, fallback to inline offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(function () {
        return new Response(OFFLINE_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      })
    );
    return;
  }
});

// ─── Firebase Background Messages ───────────────────────────────────────────
const BOOKING_TYPES = ['booking', 'refund_completed', 'refund_failed', 'booking_updates', 'reminders', 'payments', 'refund_updates'];

function getClickUrl(data) {
  if (!data) return '/';
  let parsed = data;
  if (typeof data === 'string') {
    try { parsed = JSON.parse(data); } catch { return '/'; }
  }
  const type = parsed?.type;
  if (type === 'marketing') return parsed?.redirect_url || '/';
  const bookingId = parsed?.booking_id;
  if (BOOKING_TYPES.includes(type) && bookingId) {
    return `/en/my-bookings/${bookingId}`;
  }
  return '/';
}

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data?.title || payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.data?.body || payload.notification?.body || '',
    icon: payload.data?.image || payload.notification?.image || '/web-app-manifest-192x192.png',
    badge: '/favicon-96x96.png',
    data: payload.data || {},
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = getClickUrl(event.notification.data);
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
