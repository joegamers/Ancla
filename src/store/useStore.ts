import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Affirmation } from '../services/AffirmationEngine';

interface AppState {
    currentVibe: string;
    notificationsEnabled: boolean;
    checkInterval: number; // minutes
    activePeriod: 'day' | 'night' | 'always';
    notificationTime: string; // "HH:MM"
    notificationIntention: string;
    lastAffirmation: Affirmation | null;
    notificationAffirmation: string | null;
    geometrySeed: number; // For triggering random geometry changes

    // Toast State
    toast: { message: string, visible: boolean };
    showToast: (message: string) => void;
    hideToast: () => void;

    setVibe: (vibe: string) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    setCheckInterval: (interval: number) => void;
    setActivePeriod: (period: 'day' | 'night' | 'always') => void;
    setNotificationTime: (time: string) => void;
    setNotificationIntention: (intention: string) => void;
    setLastAffirmation: (aff: Affirmation) => void;
    setNotificationAffirmation: (text: string | null) => void;
    completeOnboarding: () => void;
    refreshGeometry: () => void;

    // Onboarding State
    hasCompletedOnboarding: boolean;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            currentVibe: 'Todas',
            notificationsEnabled: false,
            checkInterval: 60,
            activePeriod: 'day', // Default to day mode
            notificationTime: '09:00',
            notificationIntention: 'Todas',
            lastAffirmation: null,
            notificationAffirmation: null,
            geometrySeed: 0,
            hasCompletedOnboarding: false,

            toast: { message: '', visible: false },

            setVibe: (vibe) => set({ currentVibe: vibe }),
            setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
            setCheckInterval: (interval) => set({ checkInterval: interval }),
            setActivePeriod: (period) => set({ activePeriod: period }),
            setNotificationTime: (time) => set({ notificationTime: time }),
            setNotificationIntention: (intention) => set({ notificationIntention: intention }),
            setLastAffirmation: (aff) => set({ lastAffirmation: aff }),
            setNotificationAffirmation: (text) => set({ notificationAffirmation: text }),
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
            refreshGeometry: () => set((state) => ({ geometrySeed: state.geometrySeed + 1 })),

            showToast: (message) => {
                set({ toast: { message, visible: true } });
                setTimeout(() => {
                    set((state) => ({ toast: { ...state.toast, visible: false } }));
                }, 3000);
            },
            hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } })),
        }),
        {
            name: 'ancla-storage',
            partialize: (state) => {
                // Exclude toast and transient states from persistence
                const { toast, notificationAffirmation, geometrySeed, ...rest } = state;
                return rest;
            }
        }
    )
);
