import { Capacitor } from '@capacitor/core';

export interface NotificationOptions {
    text: string;
    scheduleAt?: Date;
}

export interface DirectScheduleConfig {
    interval: number;
    period: 'day' | 'night' | 'always';
    intention: string;
    notificationTime: string;
}

// ── Worker API URL ─────────────────────────────────────────────────
const PUSH_WORKER_URL = 'https://ancla-push.joel22sd.workers.dev';
const VAPID_PUBLIC_KEY = 'BLuldDuA543vUH4DnHBPACCFHu6mzECBuFlG8IXp0dpCtCai4N2zhcveley9v-u6RGNHmxIqc6ZZcUMoACRgXBA';

// Storage key for the subscription ID returned by the Worker
const SUB_ID_KEY = 'ancla-push-sub-id';

function getSubId(): string | null {
    return localStorage.getItem(SUB_ID_KEY);
}
function setSubId(id: string): void {
    localStorage.setItem(SUB_ID_KEY, id);
}
function clearSubId(): void {
    localStorage.removeItem(SUB_ID_KEY);
}

// Convert VAPID key to Uint8Array for PushManager
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const output = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
    return output;
}

// ── Abstract service ───────────────────────────────────────────────

export abstract class NotificationService {
    abstract schedule(options: NotificationOptions): Promise<void>;
    abstract scheduleRandom(options: NotificationOptions): Promise<void>;
    abstract scheduleDaily(text: string, time: { hour: number, minute: number }): Promise<void>;
    abstract scheduleQueue(affirmations: string[], intervalMinutes: number, activePeriod: 'day' | 'night' | 'always', silent?: boolean): Promise<void>;
    abstract cancelAll(): Promise<void>;
    abstract requestPermission(): Promise<boolean>;
    abstract rescheduleFromSettings(directConfig?: DirectScheduleConfig): Promise<void>;
    abstract sendTestNotification(): Promise<void>;
}

// ── Capacitor (Android) — Push via FCM + Worker ────────────────────

export class CapacitorNotificationService extends NotificationService {
    private channelCreated = false;

    private async ensureChannel(): Promise<void> {
        if (this.channelCreated) return;
        if (Capacitor.getPlatform() === 'android') {
            try {
                const { LocalNotifications } = await import('@capacitor/local-notifications');
                await LocalNotifications.createChannel({
                    id: 'affirmations',
                    name: 'Afirmaciones',
                    description: 'Notificaciones periódicas de afirmaciones positivas',
                    importance: 4,
                    visibility: 1,
                    sound: 'zen_bell.mp3'
                });
                this.channelCreated = true;
            } catch (e) {
                console.warn('Error creating notification channel:', e);
            }
        }
    }

    async requestPermission(): Promise<boolean> {
        try {
            const { PushNotifications } = await import('@capacitor/push-notifications');
            const perm = await PushNotifications.requestPermissions();
            if (perm.receive === 'granted') {
                await PushNotifications.register();
                return true;
            }
            return false;
        } catch (e) {
            console.warn('[Ancla] PushNotifications not available, falling back to local:', e);
            // Fallback to local notifications permission
            const { LocalNotifications } = await import('@capacitor/local-notifications');
            const perm = await LocalNotifications.requestPermissions();
            return perm.display === 'granted';
        }
    }

    async schedule(options: NotificationOptions): Promise<void> {
        await this.ensureChannel();
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        await LocalNotifications.schedule({
            notifications: [{
                title: "Ancla",
                body: options.text,
                id: Math.floor(Math.random() * 100000),
                schedule: options.scheduleAt ? { at: options.scheduleAt, allowWhileIdle: true } : undefined,
                channelId: 'affirmations',
                sound: 'zen_bell.mp3'
            }]
        });
    }

    async scheduleRandom(options: NotificationOptions): Promise<void> {
        await this.schedule(options);
    }

    async sendTestNotification(): Promise<void> {
        await this.schedule({ text: "✨ ¡Prueba de Ancla exitosa! Tu sistema de notificaciones está configurado correctamente." });
    }

    async scheduleDaily(_text: string, _time: { hour: number, minute: number }): Promise<void> {
        // Handled by the Worker now
    }

    async scheduleQueue(_affirmations: string[], _intervalMinutes: number, _activePeriod: 'day' | 'night' | 'always', _silent = false): Promise<void> {
        // Handled by the Worker now
    }

    /**
     * Subscribe to push via FCM + Worker.
     * Also registers a listener for FCM token.
     */
    async rescheduleFromSettings(directConfig?: DirectScheduleConfig): Promise<void> {
        const { useStore } = await import('../store/useStore');
        const state = useStore.getState();

        if (!state.notificationsEnabled) return;

        const intention = directConfig?.intention ?? state.notificationIntention ?? 'Todas';
        const interval = directConfig?.interval ?? state.checkInterval;
        const period = directConfig?.period ?? state.activePeriod;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        try {
            const { PushNotifications } = await import('@capacitor/push-notifications');

            // Get FCM token
            const fcmToken = await new Promise<string>((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('FCM token timeout')), 10000);

                PushNotifications.addListener('registration', (token) => {
                    clearTimeout(timeout);
                    resolve(token.value);
                });
                PushNotifications.addListener('registrationError', (error) => {
                    clearTimeout(timeout);
                    reject(error);
                });
                PushNotifications.register();
            });

            console.log('[Ancla] FCM token:', fcmToken.substring(0, 20) + '...');

            const existingId = getSubId();
            if (existingId) {
                // Update existing subscription config
                await fetch(`${PUSH_WORKER_URL}/config`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: existingId, interval, period, intention, timezone }),
                });
            } else {
                // New subscription
                const response = await fetch(`${PUSH_WORKER_URL}/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        platform: 'android',
                        fcmToken,
                        interval,
                        period,
                        intention,
                        timezone,
                    }),
                });
                const data = await response.json() as { ok: boolean; id: string };
                if (data.ok) setSubId(data.id);
            }

            if (directConfig) {
                // User explicitly saved — show confirmation
                await this.schedule({ text: `✨ Ritmo iniciado. Tu primera afirmación llegará en breve.` });
            }

            console.log('[Ancla] Push subscription active via Worker');
        } catch (e) {
            console.warn('[Ancla] FCM push failed, falling back to local notifications:', e);
            // Fallback: schedule local notifications
            await this.fallbackToLocal(directConfig);
        }
    }

    /**
     * Fallback to local notifications if push is not available.
     */
    private async fallbackToLocal(directConfig?: DirectScheduleConfig): Promise<void> {
        const { useStore } = await import('../store/useStore');
        const { affirmationEngine } = await import('./AffirmationEngine');
        const state = useStore.getState();

        if (!state.notificationsEnabled) return;

        const { LocalNotifications } = await import('@capacitor/local-notifications');
        await this.ensureChannel();

        // Cancel existing
        try {
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel({
                    notifications: pending.notifications.map(n => ({ id: n.id }))
                });
            }
            await LocalNotifications.removeAllDeliveredNotifications();
        } catch (e) {
            console.error("Error canceling local notifications:", e);
        }

        const intention = directConfig?.intention ?? state.notificationIntention ?? 'Todas';
        const interval = directConfig?.interval ?? state.checkInterval;
        const period = directConfig?.period ?? state.activePeriod;
        const notifTime = directConfig?.notificationTime ?? state.notificationTime ?? '09:00';

        if (interval === 1440) {
            const [hour, minute] = notifTime.split(':').map(Number);
            const aff = affirmationEngine.getRandomAffirmation(intention);
            await LocalNotifications.schedule({
                notifications: [{
                    title: "Ancla",
                    body: aff.text,
                    id: 1001,
                    schedule: { on: { hour, minute }, allowWhileIdle: true, every: 'day' },
                    channelId: 'affirmations',
                    sound: 'zen_bell.mp3'
                }]
            });
        } else {
            const allAffirmations = affirmationEngine.getAffirmationsByMood(intention);
            const shuffled = [...allAffirmations].sort(() => 0.5 - Math.random());
            const queue = shuffled.slice(0, 50).map(a => a.text);
            const notifications: any[] = [];
            const now = new Date();
            const maxTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            let date = new Date(now);
            let scheduledCount = 0;

            while (true) {
                date = new Date(date.getTime() + interval * 60 * 1000);
                if (date >= maxTime) break;
                const hour = date.getHours();
                let isValidTime = true;
                if (period === 'day') isValidTime = hour >= 8 && hour < 22;
                else if (period === 'night') isValidTime = hour >= 22 || hour < 8;
                if (isValidTime) {
                    notifications.push({
                        title: "Ancla",
                        body: queue[scheduledCount % queue.length],
                        id: 2000 + scheduledCount,
                        schedule: { at: new Date(date), allowWhileIdle: true },
                        channelId: 'affirmations',
                        sound: 'zen_bell.mp3'
                    });
                    scheduledCount++;
                }
            }

            if (notifications.length > 0) {
                await LocalNotifications.schedule({ notifications });
            }
        }

        if (directConfig) {
            await this.schedule({ text: `✨ Ritmo iniciado (local). Tu primera afirmación llegará en breve.` });
        }
    }

    async cancelAll(): Promise<void> {
        // Unsubscribe from Worker
        const subId = getSubId();
        if (subId) {
            try {
                await fetch(`${PUSH_WORKER_URL}/unsubscribe`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: subId }),
                });
            } catch (e) {
                console.warn('[Ancla] Failed to unsubscribe from worker:', e);
            }
            clearSubId();
        }

        // Also cancel any local notifications
        try {
            const { LocalNotifications } = await import('@capacitor/local-notifications');
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel({
                    notifications: pending.notifications.map(n => ({ id: n.id }))
                });
            }
            await LocalNotifications.removeAllDeliveredNotifications();
        } catch (e) {
            console.error("Error canceling local notifications:", e);
        }
    }
}

// ── Web (PWA) — Push via Service Worker + Worker ───────────────────

export class WebNotificationService extends NotificationService {

    async requestPermission(): Promise<boolean> {
        if (!("Notification" in window)) return false;
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    async schedule(options: NotificationOptions): Promise<void> {
        // For immediate notifications (test, confirmation) — use Notification API directly
        if (Notification.permission === "granted") {
            new Notification("Ancla", {
                body: options.text,
                icon: '/app-icon.svg',
            });
        }
    }

    async scheduleRandom(options: NotificationOptions): Promise<void> {
        await this.schedule(options);
    }

    async sendTestNotification(): Promise<void> {
        await this.schedule({ text: "✨ ¡Prueba de Ancla exitosa! Estás listo para recibir calma." });
    }

    async scheduleDaily(_text: string, _time: { hour: number, minute: number }): Promise<void> {
        // Handled by the Worker
    }

    async scheduleQueue(_affirmations: string[], _intervalMinutes: number, _activePeriod: 'day' | 'night' | 'always', _silent = false): Promise<void> {
        // Handled by the Worker
    }

    /**
     * Subscribe to Web Push and register with the Worker.
     */
    async rescheduleFromSettings(directConfig?: DirectScheduleConfig): Promise<void> {
        const { useStore } = await import('../store/useStore');
        const state = useStore.getState();

        if (!state.notificationsEnabled) return;

        const intention = directConfig?.intention ?? state.notificationIntention ?? 'Todas';
        const interval = directConfig?.interval ?? state.checkInterval;
        const period = directConfig?.period ?? state.activePeriod;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        try {
            // Get the Service Worker registration
            const registration = await navigator.serviceWorker.ready;

            // Subscribe to Web Push
            let subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
                });
            }

            const subJson = subscription.toJSON();
            const webPush = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subJson.keys?.p256dh || '',
                    auth: subJson.keys?.auth || '',
                },
            };

            const existingId = getSubId();
            if (existingId && !directConfig) {
                // App load — just update config silently (no re-subscribe needed)
                await fetch(`${PUSH_WORKER_URL}/config`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: existingId, interval, period, intention, timezone }),
                });
            } else {
                // New subscription or config change — subscribe fresh
                if (existingId) {
                    // Unsubscribe old first
                    try {
                        await fetch(`${PUSH_WORKER_URL}/unsubscribe`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: existingId }),
                        });
                    } catch (e) { /* ignore */ }
                }

                const response = await fetch(`${PUSH_WORKER_URL}/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        platform: 'web',
                        webPush,
                        interval,
                        period,
                        intention,
                        timezone,
                    }),
                });
                const data = await response.json() as { ok: boolean; id: string };
                if (data.ok) setSubId(data.id);
            }

            if (directConfig) {
                // User explicitly saved — show immediate confirmation
                await this.schedule({ text: `✨ Ritmo iniciado. Tu primera afirmación llegará en breve.` });
            }

            console.log('[Ancla] Web Push subscription active via Worker');
        } catch (e) {
            console.error('[Ancla] Web Push subscription failed:', e);
            // Show toast with error for debugging
            const { useStore } = await import('../store/useStore');
            useStore.getState().showToast('Error al activar push: ' + String(e).substring(0, 50));
        }
    }

    async cancelAll(): Promise<void> {
        // Unsubscribe from Worker
        const subId = getSubId();
        if (subId) {
            try {
                await fetch(`${PUSH_WORKER_URL}/unsubscribe`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: subId }),
                });
            } catch (e) {
                console.warn('[Ancla] Failed to unsubscribe from worker:', e);
            }
            clearSubId();
        }

        // Also unsubscribe from browser push
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) await subscription.unsubscribe();
        } catch (e) {
            console.warn('[Ancla] Failed to unsubscribe browser push:', e);
        }
    }
}

// ── Factory ────────────────────────────────────────────────────────

export const getNotificationService = (): NotificationService => {
    if (Capacitor.isNativePlatform()) {
        return new CapacitorNotificationService();
    }
    return new WebNotificationService();
};

export const notificationService = getNotificationService();
