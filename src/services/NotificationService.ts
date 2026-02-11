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
}

export class CapacitorNotificationService extends NotificationService {
    async requestPermission(): Promise<boolean> {
        const perm = await LocalNotifications.requestPermissions();
        return perm.display === 'granted';
    }

    async schedule(options: NotificationOptions): Promise<void> {
        await this.scheduleRandom(options);
    }

    async scheduleRandom(options: NotificationOptions): Promise<void> {
        await LocalNotifications.schedule({
            notifications: [{
                title: "",
                body: options.text,
                id: Math.floor(Math.random() * 100000),
                schedule: options.scheduleAt ? { at: options.scheduleAt } : undefined,
            }]
        });
    }

    async scheduleDaily(text: string, time: { hour: number, minute: number }): Promise<void> {
        await LocalNotifications.schedule({
            notifications: [{
                title: "",
                body: text,
                id: 1001,
                schedule: {
                    on: {
                        hour: time.hour,
                        minute: time.minute
                    }
                }
            }]
        });
    }

    async scheduleQueue(affirmations: string[], intervalMinutes: number, activePeriod: 'day' | 'night' | 'always'): Promise<void> {
        const notifications: any[] = [];
        let scheduledCount = 0;
        let attempt = 0;
        let date = new Date();

        // Safety break after 500 attempts to prevent infinite loops (e.g. if period is impossible)
        while (scheduledCount < affirmations.length && attempt < 500) {
            attempt++;

            // Advance time
            date.setMinutes(date.getMinutes() + intervalMinutes);

            const hour = date.getHours();
            let isValidTime = true;

            if (activePeriod === 'day') {
                // Day: 08:00 to 22:00 (Inclusive start, exclusive end)
                isValidTime = hour >= 8 && hour < 22;
            } else if (activePeriod === 'night') {
                // Night: 22:00 to 08:00
                isValidTime = hour >= 22 || hour < 8;
            }

            if (isValidTime) {
                notifications.push({
                    title: "",
                    body: affirmations[scheduledCount],
                    id: 2000 + scheduledCount,
                    schedule: { at: new Date(date) },
                    silent: false
                });
                scheduledCount++;
            }
        }

        if (notifications.length > 0) {
            await LocalNotifications.schedule({ notifications });
        }
    }

    async cancelAll(): Promise<void> {
        // Cancel daily ID and a range of queue IDs
        const ids = [1001];
        for (let i = 0; i < 60; i++) ids.push(2000 + i);
        await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
    }
}

import { useStore } from '../store/useStore';

// ... (CapacitorNotificationService remains the same)

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

        // 1. Confirm schedule
        useStore.getState().showToast(`Ritmo activado. Recibirás mensajes positivos cada ${intervalMinutes}m.`);

        // 2. Show immediate preview if available
        if (affirmations.length > 0) {
            setTimeout(() => {
                const previewText = affirmations[0];
                if (Notification.permission === "granted") {
                    new Notification(previewText);
                } else {
                    // Fallback to toast if no native permission or on mobile web
                    useStore.getState().showToast(`Ejemplo: "${previewText}"`);
                }
            }, 1500); // Small delay to separate from the confirmation toast
        }
    }

    async cancelAll(): Promise<void> {
        console.log("Web Cancel All");
        // Optional: show toast for cancel
        // useStore.getState().showToast("Notificaciones desactivadas");
    }
}

export const getNotificationService = (): NotificationService => {
    if (Capacitor.isNativePlatform()) {
        return new CapacitorNotificationService();
    }
    return new WebNotificationService();
};

export const notificationService = getNotificationService();
