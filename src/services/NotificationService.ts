import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationOptions {
    text: string;
    scheduleAt?: Date;
}

export abstract class NotificationService {
    abstract schedule(options: NotificationOptions): Promise<void>;
    abstract scheduleRandom(options: NotificationOptions): Promise<void>;
    abstract scheduleDaily(text: string, time: { hour: number, minute: number }): Promise<void>;
    abstract scheduleQueue(affirmations: string[], intervalMinutes: number, activePeriod: 'day' | 'night' | 'always'): Promise<void>;
    abstract cancelAll(): Promise<void>;
    abstract requestPermission(): Promise<boolean>;
    abstract rescheduleFromSettings(): Promise<void>;
}

export class CapacitorNotificationService extends NotificationService {
    private channelCreated = false;

    private async ensureChannel(): Promise<void> {
        if (this.channelCreated) return;
        if (Capacitor.getPlatform() === 'android') {
            try {
                await LocalNotifications.createChannel({
                    id: 'affirmations',
                    name: 'Afirmaciones',
                    description: 'Notificaciones periódicas de afirmaciones positivas',
                    importance: 4,
                    visibility: 1
                });
                this.channelCreated = true;
            } catch (e) {
                console.warn('Error creating notification channel:', e);
            }
        }
    }

    async requestPermission(): Promise<boolean> {
        const perm = await LocalNotifications.requestPermissions();
        return perm.display === 'granted';
    }

    async schedule(options: NotificationOptions): Promise<void> {
        await this.scheduleRandom(options);
    }

    async scheduleRandom(options: NotificationOptions): Promise<void> {
        await this.ensureChannel();
        await LocalNotifications.schedule({
            notifications: [{
                title: "Ancla",
                body: options.text,
                id: Math.floor(Math.random() * 100000),
                schedule: options.scheduleAt ? { at: options.scheduleAt, allowWhileIdle: true } : undefined,
                extra: { type: 'random' },
                channelId: 'affirmations'
            }]
        });
    }

    async scheduleDaily(text: string, time: { hour: number, minute: number }): Promise<void> {
        await this.ensureChannel();
        await LocalNotifications.schedule({
            notifications: [{
                title: "Ancla",
                body: text,
                id: 1001,
                schedule: {
                    on: {
                        hour: time.hour,
                        minute: time.minute
                    },
                    allowWhileIdle: true,
                    every: 'day'
                },
                channelId: 'affirmations'
            }]
        });
    }

    /**
     * Schedules notifications for the NEXT 24 hours only.
     * Each time the app opens, rescheduleFromSettings() will re-call this
     * to keep the next 24h always populated.
     */
    async scheduleQueue(affirmations: string[], intervalMinutes: number, activePeriod: 'day' | 'night' | 'always'): Promise<void> {
        await this.ensureChannel();

        const notifications: any[] = [];
        const now = new Date();
        const maxTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
        let date = new Date(now);
        let scheduledCount = 0;

        // Keep scheduling until we've covered the next 24 hours
        while (date < maxTime && scheduledCount < affirmations.length) {
            // Advance time by interval
            date = new Date(date.getTime() + intervalMinutes * 60 * 1000);

            // Don't schedule past 24 hours
            if (date >= maxTime) break;

            const hour = date.getHours();
            let isValidTime = true;

            if (activePeriod === 'day') {
                isValidTime = hour >= 8 && hour < 22;
            } else if (activePeriod === 'night') {
                isValidTime = hour >= 22 || hour < 8;
            }
            // 'always' → isValidTime stays true

            if (isValidTime) {
                notifications.push({
                    title: "Ancla",
                    body: affirmations[scheduledCount],
                    id: 2000 + scheduledCount,
                    schedule: {
                        at: new Date(date),
                        allowWhileIdle: true
                    },
                    silent: false,
                    channelId: 'affirmations'
                });
                scheduledCount++;
            }
        }

        if (notifications.length > 0) {
            console.log(`[Ancla] Scheduling ${notifications.length} notifications for the next 24h`);
            await LocalNotifications.schedule({ notifications });
        } else {
            console.log('[Ancla] No notifications to schedule for the current active period');
        }
    }

    /**
     * Re-schedules notifications based on saved settings.
     * Called every time the app opens to ensure continuous delivery.
     */
    async rescheduleFromSettings(): Promise<void> {
        // Import store dynamically to avoid circular deps
        const { useStore } = await import('../store/useStore');
        const { affirmationEngine } = await import('./AffirmationEngine');

        const state = useStore.getState();

        if (!state.notificationsEnabled) return;

        // Cancel all existing before rescheduling
        await this.cancelAll();

        const intention = state.notificationIntention || 'Todas';
        const interval = state.checkInterval;
        const period = state.activePeriod;

        if (interval === 1440) {
            // Daily mode: schedule a repeating notification
            const [hour, minute] = (state.notificationTime || '09:00').split(':').map(Number);
            const aff = affirmationEngine.getRandomAffirmation(intention);
            await this.scheduleDaily(aff.text, { hour, minute });
        } else {
            // Interval mode: schedule next 24h of notifications
            const allAffirmations = affirmationEngine.getAffirmationsByMood(intention);
            const shuffled = [...allAffirmations].sort(() => 0.5 - Math.random());
            const queue = shuffled.slice(0, 50).map(a => a.text);
            await this.scheduleQueue(queue, interval, period);
        }
    }

    async cancelAll(): Promise<void> {
        const ids: number[] = [1001];
        for (let i = 0; i < 200; i++) ids.push(2000 + i);

        try {
            await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });

            const delivered = await LocalNotifications.getDeliveredNotifications();
            if (delivered.notifications.length > 0) {
                await LocalNotifications.removeAllDeliveredNotifications();
            }
        } catch (e) {
            console.error("Error canceling notifications:", e);
        }
    }
}

import { useStore } from '../store/useStore';

export class WebNotificationService extends NotificationService {
    async requestPermission(): Promise<boolean> {
        if (!("Notification" in window)) return false;
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    async schedule(options: NotificationOptions): Promise<void> {
        console.log("Web Schedule:", options);
        if (Notification.permission === "granted") {
            new Notification(options.text);
        }
        useStore.getState().showToast(`Notificación enviada: "${options.text.substring(0, 30)}..."`);
    }

    async scheduleRandom(options: NotificationOptions): Promise<void> {
        this.schedule(options);
    }

    async scheduleDaily(text: string, time: { hour: number, minute: number }): Promise<void> {
        console.log(`Web Daily (${time.hour}:${time.minute}):`, text);
        useStore.getState().showToast(`Recordatorio programado para las ${time.hour}:${time.minute.toString().padStart(2, '0')}`);
    }

    async scheduleQueue(affirmations: string[], intervalMinutes: number, _activePeriod: 'day' | 'night' | 'always'): Promise<void> {
        console.log("Queue:", affirmations);
        useStore.getState().showToast(`Ritmo activado. Recibirás mensajes positivos cada ${intervalMinutes}m.`);

        if (affirmations.length > 0) {
            setTimeout(() => {
                const previewText = affirmations[0];
                if (Notification.permission === "granted") {
                    new Notification(previewText);
                } else {
                    useStore.getState().showToast(`Ejemplo: "${previewText}"`);
                }
            }, 1500);
        }
    }

    async rescheduleFromSettings(): Promise<void> {
        // No-op on web — notifications are not persistent
        console.log('[Ancla Web] rescheduleFromSettings called (no-op)');
    }

    async cancelAll(): Promise<void> {
        console.log("Web Cancel All");
    }
}

export const getNotificationService = (): NotificationService => {
    if (Capacitor.isNativePlatform()) {
        return new CapacitorNotificationService();
    }
    return new WebNotificationService();
};

export const notificationService = getNotificationService();
