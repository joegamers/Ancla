import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Heart, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-sm flex flex-col"
                    >
                        <GlassCard className="flex flex-col p-6 md:p-8 !bg-[#0a0f18]/80 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full focus:outline-none transition-colors text-white/40 hover:text-white hover:bg-white/10 z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center mt-2">
                                {/* Icon Header */}
                                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 ring-1 ring-amber-500/20 shadow-inner">
                                    <Heart className="text-amber-400 w-8 h-8" strokeWidth={1.5} />
                                </div>

                                <h2 className="text-xl font-semibold text-white/90 mb-3">
                                    Hecho con mucho amor
                                </h2>

                                <p className="text-sm text-white/60 leading-relaxed mb-6">
                                    Decidí que Ancla fuera <strong>100% gratuita y sin anuncios molestos</strong> porque la paz mental no debería ser un lujo.
                                    <br /><br />
                                    Soy <span className="font-semibold text-white/80">Joe</span>, el desarrollador detrás de esto. Si la app te ayuda a estar en calma o te roba una sonrisa, invítame un café ☕ para ayudarme a mantener los servidores funcionando.
                                </p>

                                {/* Action Buttons */}
                                <div className="w-full flex-col space-y-3 mt-2">
                                    <a
                                        href="https://ko-fi.com/joegamersdev"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={onClose}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                                    >
                                        <Coffee size={18} />
                                        <span>Invítame un café</span>
                                    </a>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium transition-colors"
                                    >
                                        Quizás más tarde
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
