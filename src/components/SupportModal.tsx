import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Heart, X } from 'lucide-react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-white/10 glass border border-white/20 rounded-3xl w-full max-w-sm overflow-hidden pointer-events-auto relative shadow-2xl"
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 text-teal-900/50 hover:text-teal-900 transition-colors z-10"
                            >
                                <X size={16} />
                            </button>

                            <div className="p-6 md:p-8 flex flex-col items-center text-center">
                                {/* Icon Header */}
                                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 ring-1 ring-amber-500/20">
                                    <Heart className="text-amber-500 w-8 h-8" strokeWidth={1.5} />
                                </div>

                                <h2 className="text-xl font-medium text-teal-950 mb-3">
                                    Hecho con mucho amor
                                </h2>

                                <p className="text-sm text-teal-900/70 leading-relaxed mb-6">
                                    Decidí que Ancla fuera <strong>100% gratuita y sin anuncios molestos</strong> porque la paz mental no debería ser un lujo.
                                    <br /><br />
                                    Soy <span className="font-semibold">Joe</span>, el único desarrollador detrás de esto. Si la app te ayuda a estar en calma o te roba una sonrisa, invítame un café ☕ para ayudarme a mantener los servidores funcionando.
                                </p>

                                {/* Action Buttons */}
                                <div className="w-full flex-col space-y-3 mt-2">
                                    <a
                                        href="https://ko-fi.com/joegamersdev"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={onClose}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
                                    >
                                        <Coffee size={18} />
                                        <span>Invítame un café</span>
                                    </a>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 px-6 rounded-2xl bg-black/5 hover:bg-black/10 text-teal-900/60 font-medium transition-colors"
                                    >
                                        Quizás más tarde
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
