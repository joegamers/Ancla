import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, SettingsModal, ZenToast, IntentionsModal, Onboarding, AffirmationOverlay } from './components';
import { affirmationEngine } from './services/AffirmationEngine';
import { notificationService } from './services/NotificationService';
import { useStore } from './store/useStore';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  Sparkles,
  Wind,
  Heart,
  Zap,
  Leaf,
  Sun,
  Waves,
  ChevronRight,
  X,
  Bell,
  Settings,
  LayoutGrid,
  Shield,
  Eye
} from 'lucide-react';
import { Button } from './components/ui/button';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

const MOOD_ICONS: Record<string, any> = {
  'Calma': Wind,
  'Fuerza': Zap,
  'Amor': Heart,
  'Crecimiento': Leaf,
  'Bienestar': Sparkles,
  'Abundancia': Sun,
  'Confianza': Shield,
  'Claridad': Eye,
  'Todas': Waves
};

function App() {
  const { currentVibe, setVibe, setLastAffirmation, lastAffirmation, hasCompletedOnboarding, notificationAffirmation, setNotificationAffirmation } = useStore();
  const [showReveal, setShowReveal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showIntentionsModal, setShowIntentionsModal] = useState(false);
  const moods = useMemo(() => affirmationEngine.getMoods(), []);

  // Re-schedule notifications every time the app opens
  // This ensures the next 24h of notifications are always queued
  useEffect(() => {
    notificationService.rescheduleFromSettings().catch((err) => {
      console.warn('[Ancla] Failed to reschedule notifications:', err);
    });
  }, []);

  // Listen for notification taps to show the affirmation
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupListener = async () => {
      await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
        const body = action.notification.body;
        if (body) {
          console.log('[Ancla] Notification tapped:', body);
          setNotificationAffirmation(body);
        }
      });
    };

    setupListener();

    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, [setNotificationAffirmation]);

  const handleVibeSelect = (mood: string) => {
    setVibe(mood);
    const newAff = affirmationEngine.getRandomAffirmation(mood);
    setLastAffirmation(newAff);
    setShowReveal(true);
  };

  const scheduleTestNotification = async () => {
    const hasPermission = await notificationService.requestPermission();
    if (hasPermission) {
      const aff = affirmationEngine.getRandomAffirmation(currentVibe);
      await notificationService.schedule({ text: aff.text });
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full relative overflow-x-hidden bg-background dark:bg-slate-950 transition-colors duration-500">

        {/* Onboarding Overlay */}
        <AnimatePresence>
          {!hasCompletedOnboarding && (
            <Onboarding onComplete={() => { }} />
          )}
        </AnimatePresence>

        {/* Background Layers */}
        <div className="bg-zen-layers dark:opacity-30" />
        <div className="bg-zen-blobs dark:opacity-20">
          <div className="blob bg-[#E0F2F1] dark:bg-teal-900/30 -top-[10%] -left-[10%]" />
          <div className="blob bg-[#F1F8E9] dark:bg-slate-800/30 top-[20%] -right-[20%] [animation-delay:-5s]" />
          <div className="blob bg-[#E3F2FD] dark:bg-cyan-900/30 -bottom-[10%] left-[10%] [animation-delay:-10s]" />
        </div>
        <div className="bg-noise dark:opacity-[0.02]" />

        {/* Main Container - Constrained for Desktop */}
        <div className="relative z-10 w-full max-w-[480px] mx-auto min-h-screen shadow-2xl bg-white/5 dark:bg-black/20 backdrop-blur-[1px] flex flex-col items-center px-6 py-8 md:py-12 transition-all duration-500">

          <header className="mb-8 text-center w-full relative">
            <div className="absolute left-0 top-0">
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="rounded-full text-zen-secondary dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10">
                <Settings size={20} />
              </Button>
            </div>
            <div className="absolute right-0 top-0">
              <ModeToggle />
            </div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <div className="h-[1px] w-4 bg-teal-900/20 dark:bg-white/20" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-teal-900/60 dark:text-teal-100/60 font-bold">Ancla</span>
              <div className="h-[1px] w-4 bg-teal-900/20 dark:bg-white/20" />
            </motion.div>

            <h1 className="text-3xl font-medium tracking-tight text-zen-primary dark:text-slate-100 mb-2">
              Tu centro de calma
            </h1>
            <p className="text-zen-secondary dark:text-slate-400 text-sm font-medium">
              Elige una intención para tu momento
            </p>
          </header>

          <AnimatePresence mode="wait">
            {!showReveal ? (
              <motion.div
                key="mood-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full space-y-5"
              >
                <div className="grid grid-cols-2 gap-3">
                  {moods.map((mood) => {
                    if (mood === 'Todas') return null;
                    const Icon = MOOD_ICONS[mood] || Waves;
                    return (
                      <Button
                        key={mood}
                        variant="zen"
                        size="xl"
                        onClick={() => handleVibeSelect(mood)}
                        className="h-auto flex-col py-4 gap-2 rounded-2xl hover:scale-[1.02] active:scale-[0.98] border-teal-900/20 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      >
                        <div className="p-2 rounded-xl bg-white/60 text-teal-700 transition-colors group-hover:bg-teal-50 dark:bg-white/10 dark:text-teal-300 dark:group-hover:bg-teal-900/30">
                          <Icon size={24} strokeWidth={2} />
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-zen-primary dark:text-slate-200 uppercase tracking-wider truncate w-full">
                          {mood}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="zen"
                  size="xl"
                  onClick={() => setShowIntentionsModal(true)}
                  className="w-full justify-between py-4 rounded-2xl h-auto border-teal-900/20 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700 dark:bg-white/10 dark:text-teal-300">
                      <LayoutGrid size={20} strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-zen-primary dark:text-slate-200 tracking-wide">Explorar todas las intenciones</span>
                  </div>
                  <ChevronRight size={16} className="text-teal-900/40 dark:text-white/40" />
                </Button>

                <div className="pt-8 text-center">
                  <Button
                    variant="outline"
                    onClick={scheduleTestNotification}
                    className="rounded-full border-teal-900/10 text-teal-900/60 hover:text-teal-800 hover:bg-teal-50 text-[10px] tracking-[0.2em] uppercase px-6 py-2 h-9 font-semibold dark:border-white/10 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10"
                  >
                    <Bell size={12} className="mr-2" />
                    <span>Susurro de conciencia</span>
                  </Button>

                  <p className="mt-8 text-[10px] text-teal-900/30 dark:text-white/20 uppercase tracking-widest font-medium">
                    Desarrollado por JoeGamers
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reveal-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                className="w-full"
              >
                <GlassCard className="w-full min-h-[460px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  {/* Visual Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-100 via-white/40 to-teal-50 opacity-50" />

                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-teal-200" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-teal-800/40 dark:text-teal-200/60 font-bold">
                        {lastAffirmation?.category}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowReveal(false)}
                      className="rounded-full hover:bg-teal-50 text-teal-800/20 hover:text-teal-600 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10"
                    >
                      <X size={18} />
                    </Button>
                  </div>

                  <div className="mb-16">
                    <p className="text-3xl md:text-4xl font-light leading-relaxed text-zen-primary dark:text-slate-100 italic">
                      "{lastAffirmation?.text}"
                    </p>
                  </div>

                  <div className="space-y-10">
                    <div className="flex flex-col border-l-2 border-teal-50 dark:border-white/10 pl-5">
                      <span className="text-2xl font-medium text-zen-primary/80 dark:text-slate-200 mb-1">
                        {lastAffirmation?.author}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-teal-800/30 dark:text-white/30">
                        {lastAffirmation?.source}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        const newAff = affirmationEngine.getRandomAffirmation(currentVibe);
                        setLastAffirmation(newAff);
                      }}
                      className="w-full py-8 rounded-2xl bg-teal-600/5 hover:bg-teal-600/10 text-teal-700 font-bold uppercase tracking-[0.3em] text-xs h-auto dark:bg-white/10 dark:text-teal-200 dark:hover:bg-white/20"
                    >
                      Nueva Perspectiva
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
          <IntentionsModal
            isOpen={showIntentionsModal}
            onClose={() => setShowIntentionsModal(false)}
            onSelect={(category: string) => {
              handleVibeSelect(category);
              setShowIntentionsModal(false);
            }}
          />
          <ZenToast />

          {/* Notification tap overlay */}
          <AnimatePresence>
            {notificationAffirmation && (
              <AffirmationOverlay
                text={notificationAffirmation}
                onClose={() => setNotificationAffirmation(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
