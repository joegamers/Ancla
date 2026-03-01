import React from 'react';
import { motion } from 'framer-motion';
import { X, Feather } from 'lucide-react';
import { Button } from './ui/button';

interface AffirmationOverlayProps {
    text: string;
    onClose: () => void;
}

/**
 * Full-screen immersive overlay that displays an affirmation
 * when the user taps a notification. Beautiful gradient background
 * with breathing animation and zen aesthetic.
 */
export const AffirmationOverlay: React.FC<AffirmationOverlayProps> = ({ text, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-900 overflow-hidden">
                {/* Floating orbs */}
                <div className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl -top-[20%] -left-[10%] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-3xl top-[40%] -right-[15%] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-emerald-500/8 blur-3xl bottom-[10%] left-[20%] animate-[float_12s_ease-in-out_infinite_2s]" />

                {/* Subtle noise overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-lg mx-auto px-8 flex flex-col items-center justify-center min-h-screen">
                {/* Close button */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute top-8 right-6"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Cerrar afirmación"
                        className="rounded-full text-white/40 hover:text-white hover:bg-white/10 w-10 h-10"
                    >
                        <X size={20} />
                    </Button>
                </motion.div>

                {/* Ancla badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex items-center space-x-2 mb-12"
                >
                    <div className="h-[1px] w-8 bg-white/20" />
                    <Feather size={14} className="text-teal-300/60" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-teal-200/60 font-bold">
                        Ancla
                    </span>
                    <div className="h-[1px] w-8 bg-white/20" />
                </motion.div>

                {/* Decorative line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-16 h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent mb-10"
                />

                {/* Affirmation text */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed text-white/90 text-center italic"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
                >
                    "{text}"
                </motion.p>

                {/* Bottom decorative line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-16 h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent mt-10"
                />

                {/* Subtle breathing indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="mt-16"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="w-3 h-3 rounded-full bg-teal-400/50 mx-auto"
                    />
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mt-3 text-center">
                        Respira y absorbe
                    </p>
                </motion.div>

                {/* Dismiss hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="absolute bottom-10 text-[10px] uppercase tracking-[0.2em] text-white/15 text-center"
                >
                    Toca × para continuar
                </motion.p>
            </div>
        </motion.div>
    );
};
