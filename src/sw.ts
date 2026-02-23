/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

// ── Workbox (existing PWA functionality) ───────────────────────────
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ── Push notification handler ──────────────────────────────────────
self.addEventListener('push', (event) => {
    if (!event.data) return;

    let data: { title?: string; body?: string; icon?: string };
    try {
        data = event.data.json();
    } catch {
        data = { title: '✨ Ancla', body: event.data.text() };
    }

    const options = {
        body: data.body || 'Tu afirmación ha llegado',
        icon: data.icon || '/app-icon.svg',
        badge: '/app-icon.svg',
        tag: 'ancla-affirmation',
        renotify: true,
        vibrate: [100, 50, 100],
        data: { body: data.body },
    };

    event.waitUntil(
        self.registration.showNotification(data.title || '✨ Ancla', options)
    );
});

// ── Notification click handler ─────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const affirmationText = event.notification.data?.body;

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            // If the app is already open, focus it and send the affirmation
            for (const client of clients) {
                if (client.url.includes(self.location.origin)) {
                    client.focus();
                    if (affirmationText) {
                        client.postMessage({ type: 'NOTIFICATION_CLICK', text: affirmationText });
                    }
                    return;
                }
            }
            // Otherwise, open the app
            return self.clients.openWindow('/');
        })
    );
});
