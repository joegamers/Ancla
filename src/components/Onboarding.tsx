import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bell, Sparkles, Brain, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { notificationService } from '../services/NotificationService';
import { useStore } from '../store/useStore';

interface OnboardingProps {
    onComplete: () => void;
}

const steps = [
    {
        id: 'welcome',
        title: 'Bienvenido a Ancla',
        description: 'Tu espacio seguro para reencontrar la calma.',
        icon: Sparkles,
        color: 'text-teal-500'
    },
    {
        id: 'utility',
        title: 'Reprograma tu Mente',
        description: 'Combate pensamientos negativos con afirmaciones poderosas diseñadas para ti.',
        icon: Brain,
        color: 'text-purple-500'
    },
    {
        id: 'method',
        title: 'Pequeñas Dosis',
        description: 'Recibe destellos de positividad durante el día para mantener tu centro.',
        icon: Shield,
        color: 'text-blue-500'
    },
    {
        id: 'permissions',
        title: 'Permítenos Ayudarte',
        description: 'Activa las notificaciones para recibir tus recordatorios de luz.',
        icon: Bell,
        color: 'text-amber-500',
        isPermissionStep: true
    }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const { completeOnboarding } = useStore();

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            complete();
        }
    };

    const requestPermissions = async () => {
        await notificationService.requestPermission();
        complete();
    };

    const complete = () => {
        completeOnboarding();
        onComplete();
    };

    const StepIcon = steps[currentStep].icon;
    const isLastStep = steps[currentStep].isPermissionStep;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-md p-6">
            <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col items-center space-y-6"
                    >
                        <div className={`p-6 rounded-3xl bg-white dark:bg-slate-800 shadow-xl ${steps[currentStep].color}`}>
                            <StepIcon size={48} strokeWidth={1.5} />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-zen-primary dark:text-slate-100">
                                {steps[currentStep].title}
                            </h2>
                            <p className="text-zen-secondary dark:text-slate-400 text-lg leading-relaxed max-w-xs mx-auto">
                                {steps[currentStep].description}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="w-full space-y-6">
                    {/* Dots Indicator */}
                    <div className="flex justify-center space-x-2">
                        {steps.map((_, idx) => (
                            <motion.div
                                key={idx}
                                animate={{
                                    width: idx === currentStep ? 24 : 8,
                                    backgroundColor: idx === currentStep ? '#0d9488' : '#cbd5e1', // teal-600 vs slate-300
                                    opacity: idx === currentStep ? 1 : 0.5
                                }}
                                className="h-2 rounded-full"
                            />
                        ))}
                    </div>

                    {isLastStep ? (
                        <div className="space-y-3 w-full">
                            <Button
                                onClick={requestPermissions}
                                className="w-full py-6 text-lg font-semibold rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20"
                            >
                                Activar Notificaciones
                            </Button>
                            <Button
                                onClick={complete}
                                variant="ghost"
                                className="w-full text-slate-400 hover:text-slate-600"
                            >
                                Quizás después
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="w-full py-6 text-lg font-semibold rounded-2xl bg-zen-primary text-white dark:bg-white dark:text-zen-primary shadow-lg"
                        >
                            <span className="mr-2">Continuar</span>
                            <ChevronRight size={20} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
