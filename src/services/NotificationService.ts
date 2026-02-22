import { LocalNotifications } from '@capacitor/local-notifications';
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

export abstract class NotificationService {
    abstract schedule(options: NotificationOptions): Promise<void>;
    abstract scheduleRandom(options: NotificationOptions): Promise<void>;
    abstract scheduleDaily(text: string, time: { hour: number, minute: number }): Promise<void>;
    abstract scheduleQueue(affirmations: string[], intervalMinutes: number, activePeriod: 'day' | 'night' | 'always'): Promise<void>;
    abstract cancelAll(): Promise<void>;
    abstract requestPermission(): Promise<boolean>;
    abstract rescheduleFromSettings(directConfig?: DirectScheduleConfig): Promise<void>;
    abstract sendTestNotification(): Promise<void>;
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
                    visibility: 1,
                    sound: 'zen_bell.mp3' // Note: For Android, put zen_bell.mp3 in res/raw
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
        await this.ensureChannel();
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

    async scheduleDaily(text: string, time: { hour: number, minute: number }): Promise<void> {
        await this.ensureChannel();
        await LocalNotifications.schedule({
            notifications: [{
                title: "Ancla",
                body: text,
                id: 1001,
                schedule: {
                    on: { hour: time.hour, minute: time.minute },
                    allowWhileIdle: true,
                    every: 'day'
                },
                channelId: 'affirmations',
                sound: 'zen_bell.mp3'
            }]
        });
    }

    /**
     * Schedules notifications for the NEXT 24 hours only.
     * Each time the app opens, rescheduleFromSettings() will re-call this
     * to keep the next 24h always populated.
     *
     * The loop iterates ALL time slots in the 24h window. Affirmations are
     * recycled if there are more valid slots than texts.
     */
    async scheduleQueue(affirmations: string[], intervalMinutes: number, activePeriod: 'day' | 'night' | 'always'): Promise<void> {
        await this.ensureChannel();

        if (affirmations.length === 0) return;

        // Immediate confirmation notification (1s delay)
        setTimeout(() => {
            this.schedule({ text: `✨ Ritmo iniciado. Tu primera afirmación llegará en breve.` });
        }, 1000);

        const notifications: any[] = [];
        const now = new Date();
        const maxTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
        let date = new Date(now);
        let scheduledCount = 0;

        // Iterate ALL time slots in the next 24 hours
        while (true) {
            // Advance time by interval
            date = new Date(date.getTime() + intervalMinutes * 60 * 1000);

            // Stop after 24 hours
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
                // Recycle affirmations using modulo so we never run out
                const affIndex = scheduledCount % affirmations.length;
                notifications.push({
                    title: "Ancla",
                    body: affirmations[affIndex],
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
            console.log(`[Ancla] scheduled ${notifications.length} native notifications`);
        } else {
            console.log('[Ancla] No valid time slots found for the current active period in the next 24h');
        }
    }

    /**
     * Re-schedules notifications based on saved settings or direct config.
     * Called every time the app opens to ensure continuous delivery.
     * When called from handleSave, directConfig avoids reading stale store values.
     */
    async rescheduleFromSettings(directConfig?: DirectScheduleConfig): Promise<void> {
        // Import store dynamically to avoid circular deps
        const { useStore } = await import('../store/useStore');
        const { affirmationEngine } = await import('./AffirmationEngine');

        const state = useStore.getState();

        if (!state.notificationsEnabled) return;

        // Only cancel if we are explicitly re-configuring (not just app load)
        const isInitialLoad = !directConfig;
        if (!isInitialLoad) await this.cancelAll();

        // Use direct config if provided, otherwise read from store
        const intention = directConfig?.intention ?? state.notificationIntention ?? 'Todas';
        const interval = directConfig?.interval ?? state.checkInterval;
        const period = directConfig?.period ?? state.activePeriod;
        const notifTime = directConfig?.notificationTime ?? state.notificationTime ?? '09:00';

        if (interval === 1440) {
            // Daily mode: schedule a repeating notification
            const [hour, minute] = notifTime.split(':').map(Number);
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
        try {
            // Get all pending notifications and cancel them robustly
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel({
                    notifications: pending.notifications.map(n => ({ id: n.id }))
                });
                console.log(`[Ancla] Cancelled ${pending.notifications.length} pending notifications`);
            }

            // Also remove any already-delivered ones from the tray
            await LocalNotifications.removeAllDeliveredNotifications();
        } catch (e) {
            console.error("Error canceling notifications:", e);
        }
    }
}

import { useStore } from '../store/useStore';

export class WebNotificationService extends NotificationService {
    private activeTimer: any = null;

    private playSound() {
        try {
            const audio = new Audio('/zen_bell.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { });
        } catch (e) { }
    }

    async requestPermission(): Promise<boolean> {
        if (!("Notification" in window)) return false;
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    async schedule(options: NotificationOptions): Promise<void> {
        if (Notification.permission === "granted") {
            setTimeout(() => {
                new Notification("Ancla", {
                    body: options.text,
                    icon: '/notification-icon.svg'
                });
                this.playSound();
            }, 100);
        }
        useStore.getState().showToast(`Notificación: "${options.text.substring(0, 30)}..."`);
    }

    async scheduleRandom(options: NotificationOptions): Promise<void> {
        await this.schedule(options);
    }

    async sendTestNotification(): Promise<void> {
        await this.schedule({ text: "✨ ¡Prueba de Ancla exitosa! Estás listo para recibir calma." });
    }

    async scheduleDaily(text: string, time: { hour: number, minute: number }): Promise<void> {
        useStore.getState().showToast(`Recordatorio programado (${time.hour}:${time.minute.toString().padStart(2, '0')}): "${text.substring(0, 20)}..."`);
    }

    async scheduleQueue(affirmations: string[], intervalMinutes: number, activePeriod: 'day' | 'night' | 'always'): Promise<void> {
        if (this.activeTimer) clearInterval(this.activeTimer);

        // Immediate visual/audit confirmation
        this.schedule({ text: `✨ Ritmo iniciado. Recibirás mensajes cada ${intervalMinutes}m.` });

        this.activeTimer = setInterval(() => {
            const now = new Date();
            const hour = now.getHours();
            let isValid = true;
            if (activePeriod === 'day') isValid = hour >= 8 && hour < 22;
            else if (activePeriod === 'night') isValid = hour >= 22 || hour < 8;

            if (isValid && Notification.permission === "granted") {
                const text = affirmations[Math.floor(Math.random() * affirmations.length)];
                this.schedule({ text });
            }
        }, intervalMinutes * 60 * 1000);
    }

    async rescheduleFromSettings(directConfig?: DirectScheduleConfig): Promise<void> {
        const { useStore } = await import('../store/useStore');
        const { affirmationEngine } = await import('./AffirmationEngine');
        const state = useStore.getState();

        if (!state.notificationsEnabled) {
            if (this.activeTimer) clearInterval(this.activeTimer);
            return;
        }

        const intention = directConfig?.intention ?? state.notificationIntention ?? 'Todas';
        const interval = directConfig?.interval ?? state.checkInterval;
        const period = directConfig?.period ?? state.activePeriod;

        const allAffirmations = affirmationEngine.getAffirmationsByMood(intention);
        const queue = allAffirmations.map(a => a.text);

        // For web, we only start the timer if it's an explicit re-scheduling (user clicked Save)
        // because we don't want to start multiple confirmation notifications on every reload.
        if (directConfig) {
            await this.scheduleQueue(queue, interval, period);
        } else {
            // Background silent start for refreshes
            this.activeTimer = setInterval(() => {
                const now = new Date();
                const hour = now.getHours();
                let isValid = true;
                if (period === 'day') isValid = hour >= 8 && hour < 22;
                else if (period === 'night') isValid = hour >= 22 || hour < 8;
                if (isValid && Notification.permission === "granted") {
                    const text = queue[Math.floor(Math.random() * queue.length)];
                    this.schedule({ text });
                }
            }, interval * 60 * 1000);
        }
    }

    async cancelAll(): Promise<void> {
        if (this.activeTimer) {
            clearInterval(this.activeTimer);
            this.activeTimer = null;
        }
    }
}

export const getNotificationService = (): NotificationService => {
    if (Capacitor.isNativePlatform()) {
        return new CapacitorNotificationService();
    }
    return new WebNotificationService();
};

export const notificationService = getNotificationService();
