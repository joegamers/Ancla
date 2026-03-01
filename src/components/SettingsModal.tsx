import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Clock, Calendar, Zap, Coffee, Sun, Moon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from './ui/button';
import { useStore } from '../store/useStore';
import { notificationService } from '../services/NotificationService';
import { affirmationEngine } from '../services/AffirmationEngine';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const {
        notificationsEnabled,
        setNotificationsEnabled,
        checkInterval,
        setCheckInterval,
        activePeriod,
        setActivePeriod,
        notificationTime,
        setNotificationTime,
        notificationIntention,
        setNotificationIntention
    } = useStore();

    const [tempTime, setTempTime] = useState(notificationTime);
    const [tempInterval, setTempInterval] = useState(checkInterval);
    const [tempPeriod, setTempPeriod] = useState(activePeriod);
    const [tempIntention, setTempIntention] = useState(notificationIntention || 'Todas');
    const [deviceCount, setDeviceCount] = useState<number | null>(null);

    // Get all categories for the dropdown/selector
    const allCategories = React.useMemo(() => ['Todas', ...affirmationEngine.getAllCategories()], []);

    useEffect(() => {
        setTempTime(notificationTime);
        setTempInterval(checkInterval);
        setTempPeriod(activePeriod);
        setTempIntention(notificationIntention || 'Todas');
    }, [notificationTime, checkInterval, activePeriod, notificationIntention, isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetch('https://ancla-push.joel22sd.workers.dev/health')
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'ok' && typeof data.subscriptions === 'number') {
                        setDeviceCount(data.subscriptions);
                    }
                })
                .catch(err => console.error('[Ancla] Failed to fetch device count:', err));
        }
    }, [isOpen]);

    const handleSave = () => {
        // Save settings to store
        setNotificationTime(tempTime);
        setCheckInterval(tempInterval);
        setActivePeriod(tempPeriod);
        setNotificationIntention(tempIntention);

        if (notificationsEnabled) {
            // Pass values directly to avoid race condition with store updates
            notificationService.rescheduleFromSettings({
                interval: tempInterval,
                period: tempPeriod,
                intention: tempIntention,
                notificationTime: tempTime
            }).catch((err) => {
                console.error('[Ancla] Error scheduling notifications:', err);
            });
        } else {
            notificationService.cancelAll();
        }

        onClose();
    };

    const handleToggleNotifications = async (enabled: boolean) => {
        if (enabled) {
            const hasPermission = await notificationService.requestPermission();
            if (!hasPermission) {
                useStore.getState().showToast('Permiso de notificaciones denegado.');
                setNotificationsEnabled(false);
                return;
            }
        }
        setNotificationsEnabled(enabled);
        if (!enabled) {
            notificationService.cancelAll();
        }
    };

    const intervals = [
        { value: 15, label: '15m', icon: Zap, color: 'text-amber-500' },
        { value: 30, label: '30m', icon: Zap, color: 'text-amber-600' },
        { value: 60, label: '1h', icon: Clock, color: 'text-teal-600' },
        { value: 120, label: '2h', icon: Coffee, color: 'text-teal-700' },
        { value: 240, label: '4h', icon: Sun, color: 'text-indigo-500' },
        { value: 1440, label: 'Diario', icon: Calendar, color: 'text-violet-600' },
    ];

    const periods: { value: 'day' | 'night' | 'always', label: string, icon: React.ElementType }[] = [
        { value: 'day', label: 'Solo Día (8-22h)', icon: Sun },
        { value: 'night', label: 'Solo Noche (22-8h)', icon: Moon },
        { value: 'always', label: 'Siempre', icon: Zap },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md max-h-[90vh] flex flex-col"
                    >
                        <GlassCard className="flex-1 flex flex-col p-6 md:p-8 !bg-white/95 dark:!bg-slate-900/95 border border-white/20 shadow-2xl overflow-hidden">
                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <h2 className="text-xl font-semibold text-zen-primary dark:text-slate-100 flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    Frecuencia
                                </h2>
                                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar configuración" className="rounded-full">
                                    <X className="w-5 h-5 text-zen-secondary dark:text-slate-400" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                {/* Enable Toggle */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-800/50">
                                        <span className="text-sm font-medium text-zen-primary dark:text-slate-200">Activadas</span>
                                        <button
                                            onClick={() => handleToggleNotifications(!notificationsEnabled)}
                                            aria-label={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
                                            aria-pressed={notificationsEnabled}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {notificationsEnabled && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => notificationService.sendTestNotification()}
                                            aria-label="Enviar notificación de prueba"
                                            className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-900/20"
                                        >
                                            <Bell className="w-4 h-4 mr-2" />
                                            Enviar notificación de prueba
                                        </Button>
                                    )}
                                </div>

                                {notificationsEnabled && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-3">
                                            <label id="intention-label" className="text-xs font-bold uppercase tracking-wider text-zen-secondary dark:text-slate-400">Intención de los mensajes</label>
                                            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="intention-label">
                                                {allCategories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setTempIntention(cat)}
                                                        aria-label={`Seleccionar intención ${cat}`}
                                                        aria-pressed={tempIntention === cat}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tempIntention === cat
                                                            ? 'bg-teal-100 text-teal-800 ring-1 ring-teal-300 dark:bg-teal-900/50 dark:text-teal-200 dark:ring-teal-700'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label id="rhythm-label" className="text-xs font-bold uppercase tracking-wider text-zen-secondary dark:text-slate-400">Ritmo de afirmaciones</label>

                                            <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="rhythm-label">
                                                {intervals.map((opt) => {
                                                    const Icon = opt.icon;
                                                    const isSelected = tempInterval === opt.value;
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => setTempInterval(opt.value)}
                                                            aria-label={`Ritmo ${opt.label}`}
                                                            aria-pressed={isSelected}
                                                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${isSelected
                                                                ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-200 dark:bg-teal-900/30 dark:border-teal-700 dark:ring-teal-800'
                                                                : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400'}`}
                                                        >
                                                            <Icon className={`w-5 h-5 ${isSelected ? opt.color : 'text-slate-400 dark:text-slate-500'}`} />
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-zen-primary dark:text-slate-100' : ''}`}>{opt.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {tempInterval !== 1440 && (
                                            <div className="space-y-3">
                                                <label id="period-label" className="text-xs font-bold uppercase tracking-wider text-zen-secondary dark:text-slate-400">Periodo Activo</label>
                                                <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="period-label">
                                                    {periods.map((p) => {
                                                        const Icon = p.icon;
                                                        const isSelected = tempPeriod === p.value;
                                                        return (
                                                            <button
                                                                key={p.value}
                                                                onClick={() => setTempPeriod(p.value)}
                                                                aria-label={`Periodo ${p.label}`}
                                                                aria-pressed={isSelected}
                                                                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${isSelected
                                                                    ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:border-amber-700 dark:ring-amber-800'
                                                                    : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400'}`}
                                                            >
                                                                <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                                                <span className={`text-[10px] font-medium ${isSelected ? 'text-zen-primary dark:text-slate-100' : ''}`}>{p.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {tempInterval === 1440 && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="pt-2"
                                            >
                                                <label className="text-xs font-bold uppercase tracking-wider text-zen-secondary dark:text-slate-400 block mb-2">Hora del día</label>
                                                <input
                                                    type="time"
                                                    value={tempTime}
                                                    onChange={(e) => setTempTime(e.target.value)}
                                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-2xl font-semibold text-zen-primary outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                                                />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                <Button
                                    onClick={handleSave}
                                    className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium tracking-wide shadow-lg shadow-teal-600/20 mt-4 shrink-0"
                                >
                                    Confirmar Ritmo
                                </Button>

                                <div className="pt-2 pb-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-medium tracking-widest text-slate-400/70 dark:text-slate-500/70 uppercase">
                                        Ancla v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
                                    </span>
                                    {deviceCount !== null && (
                                        <span className="text-[10px] font-medium text-pink-500/80 tracking-wide flex items-center gap-1">
                                            ❤️ Corazones anclados: {deviceCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
