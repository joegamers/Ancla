import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsModal, ZenToast, AffirmationOverlay, Onboarding } from './components';
import { ZenBackground } from './components/ZenBackground';
import { affirmationEngine } from './services/AffirmationEngine';
import { shareAffirmation } from './services/ShareService';
import { notificationService } from './services/NotificationService';
import { useStore } from './store/useStore';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { RefreshCw, Share2, Settings, Coffee, Bell, Users } from 'lucide-react';
import { Button } from './components/ui/button';

function App() {
  const {
    currentVibe,
    setVibe,
    setLastAffirmation,
    lastAffirmation,
    notificationAffirmation,
    setNotificationAffirmation,
    notificationsEnabled,
    setNotificationsEnabled,
    hasCompletedOnboarding,
  } = useStore();

  const [showSettings, setShowSettings] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding);

  const moods = useMemo(() => affirmationEngine.getMoods(), []);

  const handleInvite = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Ancla — Tu espacio de calma',
          text: 'Te comparto esta app de afirmaciones que me está ayudando mucho a mantener la calma y reprogramar pensamientos negativos. Es gratuita y Zen. ✨',
          url: 'https://anclas.vercel.app', // Final production URL
        });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error(err);
    }
  };

  // Load initial affirmation
  useEffect(() => {
    if (!lastAffirmation) {
      const aff = affirmationEngine.getRandomAffirmation(currentVibe);
      setLastAffirmation(aff);
    }
  }, [lastAffirmation, setLastAffirmation, currentVibe]);

  // Re-schedule notifications on app open
  useEffect(() => {
    notificationService.rescheduleFromSettings().catch((err) => {
      console.warn('[Ancla] Failed to reschedule notifications:', err);
    });
  }, []);

  // Listen for notification taps
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
    return () => { LocalNotifications.removeAllListeners(); };
  }, [setNotificationAffirmation]);

  const handleNewAffirmation = () => {
    const { refreshGeometry } = useStore.getState();
    const newAff = affirmationEngine.getRandomAffirmation(currentVibe);
    setLastAffirmation(newAff);
    refreshGeometry();
  };

  const handleShare = async () => {
    if (!lastAffirmation || isSharing) return;
    setIsSharing(true);
    try {
      await shareAffirmation({
        text: lastAffirmation.text,
        author: lastAffirmation.author,
        source: lastAffirmation.source,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const hasPermission = await notificationService.requestPermission();
      if (hasPermission) {
        setNotificationsEnabled(true);
        await notificationService.rescheduleFromSettings();
      }
    } else {
      setNotificationsEnabled(false);
      await notificationService.cancelAll();
    }
  };

  return (
    <>
      {/* Three.js Zen Background */}
      <ZenBackground />

      {/* Onboarding overlay */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="relative z-10 h-[100dvh] w-full flex flex-col px-5 py-3 sm:py-6 overflow-hidden">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center flex-1 min-h-0">

          {/* Top bar */}
          <div className="w-full flex justify-between items-center shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleNotifications}
              className={`rounded-full h-8 w-8 ${notificationsEnabled ? 'text-teal-400' : 'text-white/30'} hover:bg-white/10`}
              title={notificationsEnabled ? 'Notificaciones activadas' : 'Activar notificaciones'}
            >
              <Bell size={16} />
            </Button>

            {/* Brand badge (inline with top bar) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center space-x-2"
            >
              <div className="h-[1px] w-6 bg-teal-400/20" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-teal-300/50 font-bold">
                Ancla
              </span>
              <div className="h-[1px] w-6 bg-teal-400/20" />
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="rounded-full h-8 w-8 text-white/30 hover:text-white hover:bg-white/10"
            >
              <Settings size={16} />
            </Button>
          </div>

          {/* Category pills (compact, scrollable horizontally) */}
          <div className="w-full shrink-0 overflow-x-auto overflow-y-hidden no-scrollbar">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-start sm:justify-center gap-1.5 mt-3 mb-3 pb-1 w-max mx-auto px-2"
            >
              {['Todas', ...moods.filter(m => m !== 'Todas')].map((mood) => (
                <button
                  key={mood}
                  onClick={() => {
                    setVibe(mood);
                    const newAff = affirmationEngine.getRandomAffirmation(mood);
                    setLastAffirmation(newAff);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold transition-all duration-300 shrink-0 ${currentVibe === mood
                    ? 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/30'
                    : 'text-white/25 hover:text-white/50 hover:bg-white/5'
                    }`}
                >
                  {mood}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Affirmation Card — takes remaining space */}
          <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {lastAffirmation && (
                <motion.div
                  key={lastAffirmation.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center flex flex-col items-center justify-center max-h-full overflow-y-auto no-scrollbar"
                >
                  {/* Category tag */}
                  <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3 shrink-0">
                    <div className="w-1 h-1 rounded-full bg-teal-400/40" />
                    <span className="text-[8px] uppercase tracking-[0.25em] text-teal-300/40 font-bold">
                      {lastAffirmation.category}
                    </span>
                  </div>

                  {/* The affirmation */}
                  <p className="text-lg sm:text-2xl md:text-3xl font-light leading-snug text-white/85 italic mb-3 sm:mb-4 px-1"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                    "{lastAffirmation.text}"
                  </p>

                  {/* Author */}
                  <div className="space-y-0.5 shrink-0 pb-2">
                    <p className="text-xs font-medium text-white/50">
                      — {lastAffirmation.author}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-white/20">
                      {lastAffirmation.source}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom actions — pinned */}
          <div className="shrink-0 w-full flex flex-col items-center gap-3 pb-2 pt-2">
            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-2 sm:gap-3"
            >
              <button
                onClick={handleNewAffirmation}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/30 text-white/60 hover:text-teal-300 transition-all duration-300 text-[10px] uppercase tracking-[0.15em] font-semibold backdrop-blur-sm"
              >
                <RefreshCw size={12} />
                Nueva
              </button>
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-teal-300/70 hover:text-teal-300 transition-all duration-300 text-[10px] uppercase tracking-[0.15em] font-semibold backdrop-blur-sm disabled:opacity-50"
              >
                <Share2 size={12} />
                {isSharing ? 'Creando...' : 'Compartir'}
              </button>
              <button
                onClick={handleInvite}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/30 text-white/50 hover:text-white transition-all duration-300 text-[10px] uppercase tracking-[0.15em] font-semibold backdrop-blur-sm"
                title="Invitar amigos"
              >
                <Users size={12} />
                Invitar
              </button>
            </motion.div>

            {/* Donate */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col items-center gap-1.5"
            >
              <a
                href="https://ko-fi.com/joegamersdev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-300/60 hover:text-amber-300 transition-all duration-300 text-[10px] uppercase tracking-[0.1em] font-semibold"
              >
                <Coffee size={12} />
                Apoya este proyecto
              </a>
              <p className="text-[8px] text-white/15 uppercase tracking-[0.2em] font-medium hidden sm:block">
                Desarrollado por JoeGamers Dev
              </p>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Notification tap overlay */}
      <AnimatePresence>
        {notificationAffirmation && (
          <AffirmationOverlay
            text={notificationAffirmation}
            onClose={() => setNotificationAffirmation(null)}
          />
        )}
      </AnimatePresence>

      <ZenToast />
    </>
  );
}

export default App;
