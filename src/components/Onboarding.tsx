import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bell, Sparkles, Brain, Clock } from 'lucide-react';
import { notificationService } from '../services/NotificationService';
import { useStore } from '../store/useStore';

interface OnboardingProps {
    onComplete: () => void;
}

const SCHEDULE_OPTIONS = [
    { label: 'Cada hora', value: 60, desc: 'Ideal para días difíciles' },
    { label: 'Cada 2 horas', value: 120, desc: 'Equilibrio perfecto' },
    { label: 'Cada 4 horas', value: 240, desc: 'Suave y discreto' },
    { label: 'Solo 1 vez al día', value: 1440, desc: 'Un recordatorio diario' },
];

const steps = [
    {
        id: 'welcome',
        title: 'Bienvenido a Ancla',
        description: 'Tu espacio seguro para reencontrar la calma interior y reprogramar tu mente con afirmaciones poderosas.',
        icon: Sparkles,
    },
    {
        id: 'method',
        title: 'Pequeñas Dosis de Luz',
        description: 'Recibe afirmaciones basadas en ciencia cognitiva y sabiduría milenaria durante tu día.',
        icon: Brain,
    },
    {
        id: 'notifications',
        title: 'Activa tus Recordatorios',
        description: 'Permítenos enviarte destellos de positividad para mantener tu centro emocional.',
        icon: Bell,
    },
    {
        id: 'schedule',
        title: '¿Con qué frecuencia?',
        description: 'Elige cuántas veces al día quieres recibir tu dosis de calma.',
        icon: Clock,
    },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedInterval, setSelectedInterval] = useState(120);
    const { completeOnboarding, setNotificationsEnabled, setCheckInterval } = useStore();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finish();
        }
    };

    const handleSkip = () => {
        finish();
    };

    const requestPermissions = async () => {
        const granted = await notificationService.requestPermission();
        if (granted) {
            setNotificationsEnabled(true);
        }
        // Move to schedule step regardless
        setCurrentStep(prev => prev + 1);
    };

    const finish = () => {
        setCheckInterval(selectedInterval);
        completeOnboarding();
        notificationService.rescheduleFromSettings().catch(() => { });
        onComplete();
    };

    const step = steps[currentStep];
    const StepIcon = step.icon;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0a0f18 0%, #0d1f2d 40%, #0a1a1a 100%)' }}>

            <div className="w-full max-w-sm px-6 flex flex-col items-center text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex flex-col items-center space-y-5 w-full"
                    >
                        {/* Icon */}
                        <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                            <StepIcon size={40} strokeWidth={1.5} className="text-teal-400" />
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-white/90">
                                {step.title}
                            </h2>
                            <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>

                        {/* Schedule selector (only on schedule step) */}
                        {step.id === 'schedule' && (
                            <div className="w-full space-y-2 mt-2">
                                {SCHEDULE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSelectedInterval(opt.value)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left ${selectedInterval === opt.value
                                            ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
                                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                            }`}
                                    >
                                        <div>
                                            <span className="text-sm font-semibold">{opt.label}</span>
                                            <span className="block text-[10px] text-white/30 mt-0.5">{opt.desc}</span>
                                        </div>
                                        {selectedInterval === opt.value && (
                                            <div className="w-2 h-2 rounded-full bg-teal-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Bottom area */}
                <div className="w-full mt-8 space-y-3">
                    {/* Dots */}
                    <div className="flex justify-center space-x-2 mb-4">
                        {steps.map((_, idx) => (
                            <motion.div
                                key={idx}
                                animate={{
                                    width: idx === currentStep ? 20 : 6,
                                    backgroundColor: idx === currentStep ? '#14b8a6' : '#334155',
                                    opacity: idx === currentStep ? 1 : 0.5
                                }}
                                className="h-1.5 rounded-full"
                            />
                        ))}
                    </div>

                    {/* Notification step */}
                    {step.id === 'notifications' ? (
                        <div className="space-y-2">
                            <button
                                onClick={requestPermissions}
                                className="w-full py-3 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 font-semibold text-sm uppercase tracking-wider hover:bg-teal-500/30 transition-all"
                            >
                                Activar Notificaciones
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-full py-2.5 text-white/30 text-xs uppercase tracking-wider hover:text-white/50 transition-colors"
                            >
                                Omitir
                            </button>
                        </div>
                    ) : step.id === 'schedule' ? (
                        <div className="space-y-2">
                            <button
                                onClick={finish}
                                className="w-full py-3 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 font-semibold text-sm uppercase tracking-wider hover:bg-teal-500/30 transition-all"
                            >
                                Comenzar
                            </button>
                            <button
                                onClick={handleSkip}
                                className="w-full py-2.5 text-white/30 text-xs uppercase tracking-wider hover:text-white/50 transition-colors"
                            >
                                Omitir
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <button
                                onClick={handleNext}
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                Continuar
                                <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={handleSkip}
                                className="w-full py-2.5 text-white/30 text-xs uppercase tracking-wider hover:text-white/50 transition-colors"
                            >
                                Omitir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
