import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { affirmationEngine } from './services/AffirmationEngine';
import { notificationService } from './services/NotificationService';
import { useStore } from './store/useStore';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { RefreshCw, Share2, Settings, Coffee, Bell, Users } from 'lucide-react';
import { Button } from './components/ui/button';
import { getFontSize } from './lib/utils';

// Lazy load non-critical components
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const ZenToast = lazy(() => import('./components/ZenToast').then(m => ({ default: m.ZenToast })));
const AffirmationOverlay = lazy(() => import('./components/AffirmationOverlay').then(m => ({ default: m.AffirmationOverlay })));
const Onboarding = lazy(() => import('./components/Onboarding').then(m => ({ default: m.Onboarding })));
const SupportModal = lazy(() => import('./components/SupportModal').then(m => ({ default: m.SupportModal })));

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
  const [showSupportModal, setShowSupportModal] = useState(false);
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

  // Load initial affirmation (or check deep link from notification)
  useEffect(() => {
    if (!lastAffirmation) {
      // Check if we were opened via a notification click (Cold Start)
      const params = new URLSearchParams(window.location.search);
      const forcedText = params.get('t');

      if (forcedText) {
        const decoded = decodeURIComponent(forcedText);
        setNotificationAffirmation(decoded);

        // Optional: Clean up URL without reloading page
        window.history.replaceState({}, document.title, window.location.pathname);

        // We still need a default background affirmation to fade from
        setLastAffirmation(affirmationEngine.getRandomAffirmation(currentVibe));
      } else {
        const aff = affirmationEngine.getRandomAffirmation(currentVibe);
        setLastAffirmation(aff);
      }
    }
  }, [lastAffirmation, setLastAffirmation, currentVibe, setNotificationAffirmation]);

  // Re-schedule notifications on app open
  useEffect(() => {
    notificationService.rescheduleFromSettings().catch((err) => {
      console.warn('[Ancla] Failed to reschedule notifications:', err);
    });

    // PWA Service Worker message listener (for when a notification is clicked)
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK' && event.data.text) {
        setNotificationAffirmation(event.data.text);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [setNotificationAffirmation]);

  // Listen for notification taps
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupListener = async () => {
      await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
        const body = action.notification.body;
        if (body) {
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

  const [preloadedShareBlob, setPreloadedShareBlob] = useState<Blob | null>(null);

  // Pre-generate image to avoid "User Gesture Timeout" on Web Share
  useEffect(() => {
    if (!lastAffirmation) return;
    let isMounted = true;
    import('./services/ShareService').then(({ generateImage }) => {
      generateImage({
        text: lastAffirmation.text,
        author: lastAffirmation.author,
        source: lastAffirmation.source,
      }).then(blob => {
        if (isMounted) setPreloadedShareBlob(blob);
      }).catch(err => console.warn('Home preload share image failed:', err));
    });
    return () => { isMounted = false; };
  }, [lastAffirmation]);

  const handleShare = () => {
    if (!lastAffirmation || isSharing) return;

    // Check native share first
    const isNative = !!(window as any).Capacitor?.isNativePlatform?.();

    // Fast path for PWA to avoid timeout: STRICTLY SYNCHRONOUS BEFORE AWAIT
    if (!isNative && navigator.share && navigator.canShare && preloadedShareBlob) {
      setIsSharing(true); // Se pone *después* de iniciar la request si es posible, pero es mejor ni bloquear
      const file = new File([preloadedShareBlob], `ancla-afirm-${Date.now()}.jpeg`, { type: 'image/jpeg' });

      if (navigator.canShare({ files: [file] })) {
        navigator.share({
          title: 'Ancla — Tu espacio de calma',
          text: `"${lastAffirmation.text}" — ${lastAffirmation.author}\n\nEncuentra paz en: https://anclas.vercel.app`,
          files: [file],
        })
          .then(() => setIsSharing(false))
          .catch((err) => {
            setIsSharing(false);
            if (err.name !== 'AbortError') console.warn('Share error', err);
          });
        return; // early exit success
      }
    }

    // Fallback if not PWA or no blob preloaded
    setIsSharing(true);
    import('./services/ShareService').then(({ shareAffirmation }) => {
      shareAffirmation({
        text: lastAffirmation.text,
        author: lastAffirmation.author,
        source: lastAffirmation.source,
        preloadedBlob: preloadedShareBlob || undefined,
      }).finally(() => setIsSharing(false));
    });
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
    <LazyMotion features={domAnimation}>
      {/* ─── Background: radial gradient with warm center ─── */}
      <div className="bg-main-radial" />

      {/* ─── Nebula Layer — Enhanced Waves (visible on all devices) ─── */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Teal aurora — top */}
        <div
          className="absolute"
          style={{
            width: '140vw',
            height: '60vh',
            top: '-10%',
            left: '-20%',
            background: 'radial-gradient(ellipse at 50% 90%, rgba(20,184,166,0.85) 0%, rgba(6,95,70,0.45) 30%, transparent 60%)',
            filter: 'blur(35px)',
            animation: 'nebula-drift-1 20s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        />
        {/* Cyan wave — bottom-right */}
        <div
          className="absolute"
          style={{
            width: '120vw',
            height: '55vh',
            bottom: '-8%',
            right: '-25%',
            background: 'radial-gradient(ellipse at 40% 10%, rgba(34,211,238,0.70) 0%, rgba(8,145,178,0.35) 30%, transparent 60%)',
            filter: 'blur(40px)',
            animation: 'nebula-drift-2 25s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        />
        {/* Violet mist — left side */}
        <div
          className="absolute"
          style={{
            width: '90vw',
            height: '70vh',
            top: '10%',
            left: '-25%',
            background: 'radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.55) 0%, rgba(67,56,202,0.25) 35%, transparent 60%)',
            filter: 'blur(45px)',
            animation: 'nebula-drift-3 28s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        />
        {/* Emerald glow — bottom-left */}
        <div
          className="absolute"
          style={{
            width: '80vw',
            height: '50vh',
            bottom: '0%',
            left: '-5%',
            background: 'radial-gradient(ellipse at 60% 30%, rgba(16,185,129,0.50) 0%, rgba(5,150,105,0.20) 35%, transparent 60%)',
            filter: 'blur(35px)',
            animation: 'nebula-drift-1 24s ease-in-out infinite reverse',
            willChange: 'transform, opacity',
          }}
        />

        {/* ─── Organic Wave Blobs ─── */}
        {/* Wave blob 1 — teal-cyan organic shape */}
        <div
          className="absolute"
          style={{
            width: '60vw',
            height: '40vh',
            top: '20%',
            left: '10%',
            background: 'linear-gradient(135deg, rgba(20,184,166,0.50) 0%, rgba(34,211,238,0.30) 50%, rgba(6,182,212,0.15) 100%)',
            filter: 'blur(25px)',
            animation: 'wave-flow 18s ease-in-out infinite',
            willChange: 'transform, border-radius',
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          }}
        />
        {/* Wave blob 2 — emerald-indigo organic shape */}
        <div
          className="absolute"
          style={{
            width: '55vw',
            height: '45vh',
            bottom: '15%',
            right: '5%',
            background: 'linear-gradient(225deg, rgba(16,185,129,0.45) 0%, rgba(99,102,241,0.25) 50%, rgba(20,184,166,0.15) 100%)',
            filter: 'blur(30px)',
            animation: 'wave-flow 22s ease-in-out infinite reverse',
            willChange: 'transform, border-radius',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          }}
        />

        {/* Central focus glow — behind the affirmation */}
        <div
          className="absolute"
          style={{
            width: '80vw',
            height: '50vh',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(20,184,166,0.55) 0%, rgba(13,148,136,0.25) 30%, transparent 55%)',
            filter: 'blur(20px)',
            animation: 'pulse-glow 7s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        />

        {/* Shimmer sweep — subtle light streak */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(94,234,212,0.08) 50%, transparent 60%)',
            animation: 'shimmer-drift 12s ease-in-out infinite',
            willChange: 'transform, opacity',
          }}
        />

        {/* Noise texture for premium feel */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Onboarding overlay */}
      {showOnboarding && (
        <Suspense fallback={null}>
          <Onboarding onComplete={() => setShowOnboarding(false)} />
        </Suspense>
      )}

      <div className="relative z-10 h-[100dvh] w-full flex flex-col px-5 py-3 sm:py-6 overflow-hidden">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center flex-1 min-h-0">

          {/* Top bar */}
          <div className="w-full flex justify-between items-center shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleNotifications}
              aria-label={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
              className={`rounded-full h-10 w-10 ${notificationsEnabled ? 'text-teal-400' : 'text-white/30'} hover:bg-white/10`}
              title={notificationsEnabled ? 'Notificaciones activadas' : 'Activar notificaciones'}
            >
              <Bell size={18} />
            </Button>

            {/* Brand badge (inline with top bar) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex items-center space-x-2"
            >
              <div className="h-[1px] w-6 bg-teal-400/20" />
              <span className="text-xs uppercase tracking-[0.35em] text-teal-300/50 font-bold">
                Ancla
              </span>
              <div className="h-[1px] w-6 bg-teal-400/20" />
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              aria-label="Abrir configuración"
              className="rounded-full h-10 w-10 text-white/30 hover:text-white hover:bg-white/10"
            >
              <Settings size={18} />
            </Button>
          </div>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-1.5 mt-3 mb-3 max-w-sm shrink-0 px-2"
          >
            {['Todas', ...moods.filter(m => m !== 'Todas')].map((mood) => (
              <button
                key={mood}
                onClick={() => {
                  setVibe(mood);
                  const newAff = affirmationEngine.getRandomAffirmation(mood);
                  setLastAffirmation(newAff);
                }}
                aria-label={`Filtrar por ${mood}`}
                aria-pressed={currentVibe === mood}
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${currentVibe === mood
                  ? 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/30'
                  : 'text-white/25 hover:text-white/50 hover:bg-white/5'
                  }`}
              >
                {mood}
              </button>
            ))}
          </motion.div>

          {/* Affirmation Card — takes remaining space */}
          <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0">
            <AnimatePresence mode="wait">
              {lastAffirmation && (
                <motion.div
                  key={lastAffirmation.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center flex flex-col items-center justify-center"
                >
                  {/* Category tag — enhanced */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex items-center justify-center space-x-3 mb-3 sm:mb-4 shrink-0"
                  >
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-teal-400/50" />
                    <div className="flex items-center space-x-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400/60 animate-pulse" />
                      <span className="text-[11px] uppercase tracking-[0.3em] text-teal-300/60 font-bold">
                        {lastAffirmation.category}
                      </span>
                    </div>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-teal-400/50" />
                  </motion.div>

                  {/* The affirmation — with glow and glassmorphism */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative px-6 sm:px-10 py-6 sm:py-8 rounded-3xl mx-2 flex flex-col justify-center min-h-[140px] overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    {/* Decorative quote mark */}
                    <div
                      className="absolute -top-3 left-6 sm:left-10 text-teal-400/15 select-none pointer-events-none"
                      style={{ fontSize: '4rem', fontFamily: 'Georgia, serif', lineHeight: 1 }}
                    >
                      "
                    </div>

                    <p
                      className={`${getFontSize(lastAffirmation.text)} font-light leading-relaxed text-white/90 italic relative z-10`}
                      style={{
                        textShadow: `
                          0 0 40px rgba(20,184,166,0.3),
                          0 0 80px rgba(20,184,166,0.15),
                          0 2px 15px rgba(0,0,0,0.4)
                        `,
                      }}
                    >
                      {lastAffirmation.text}
                    </p>

                    {/* Decorative closing quote */}
                    <div
                      className="absolute -bottom-3 right-6 sm:right-10 text-teal-400/15 select-none pointer-events-none"
                      style={{ fontSize: '4rem', fontFamily: 'Georgia, serif', lineHeight: 1, transform: 'rotate(180deg)' }}
                    >
                      "
                    </div>
                  </motion.div>

                  {/* Author — enhanced with stagger */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="space-y-1 shrink-0 pt-3 sm:pt-4 pb-2"
                  >
                    <p
                      className="text-xs sm:text-sm font-medium text-white/55"
                      style={{ textShadow: '0 0 20px rgba(20,184,166,0.2)' }}
                    >
                      — {lastAffirmation.author}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-teal-300/25 font-semibold">
                      {lastAffirmation.source}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom actions — pinned */}
          <div className="shrink-0 w-full flex flex-col items-center gap-3 pb-2 pt-2" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-2 sm:gap-3"
            >
              <button
                onClick={handleNewAffirmation}
                aria-label="Obtener nueva afirmación"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/30 text-white/60 hover:text-teal-300 transition-all duration-300 text-xs uppercase tracking-[0.15em] font-semibold backdrop-blur-sm min-w-[120px]"
              >
                <RefreshCw size={14} />
                Nueva
              </button>
              <button
                onClick={handleShare}
                disabled={isSharing}
                aria-label="Compartir esta afirmación"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-teal-300/70 hover:text-teal-300 transition-all duration-300 text-xs uppercase tracking-[0.15em] font-semibold backdrop-blur-sm disabled:opacity-50 min-w-[140px]"
              >
                <Share2 size={14} />
                {isSharing ? 'Creando...' : 'Compartir'}
              </button>
              <button
                onClick={handleInvite}
                aria-label="Invitar amigos a Ancla"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/30 text-white/50 hover:text-white transition-all duration-300 text-xs uppercase tracking-[0.15em] font-semibold backdrop-blur-sm"
              >
                <Users size={14} />
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
              <button
                onClick={() => setShowSupportModal(true)}
                aria-label="Apoyar el proyecto con un café"
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-300/60 hover:text-amber-300 transition-all duration-300 text-xs uppercase tracking-[0.1em] font-semibold"
              >
                <Coffee size={14} />
                Apoya este proyecto
              </button>
              <p className="text-xs text-white/15 uppercase tracking-[0.2em] font-medium hidden sm:block">
                Desarrollado por JoeGamers Dev
              </p>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Modals & Overlays */}
      <Suspense fallback={null}>
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
        
        <AnimatePresence>
          {notificationAffirmation && (
            <AffirmationOverlay
              text={notificationAffirmation}
              onClose={() => setNotificationAffirmation(null)}
            />
          )}
        </AnimatePresence>

        <ZenToast />
      </Suspense>
    </LazyMotion>
  );
}

export default App;
