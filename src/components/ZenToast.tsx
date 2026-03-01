import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ZenToast = () => {
    const { toast, hideToast } = useStore();

    return (
        <AnimatePresence>
            {toast.visible && (
                <div className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="pointer-events-auto flex items-center gap-3 py-3 px-5 rounded-full bg-slate-900/90 dark:bg-slate-100/90 backdrop-blur-md text-white dark:text-slate-900 shadow-xl border border-white/10 dark:border-slate-900/10"
                    >
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 dark:text-teal-600">
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium tracking-wide">{toast.message}</span>
                        <button
                            onClick={hideToast}
                            aria-label="Cerrar aviso"
                            className="ml-2 hover:bg-white/10 rounded-full p-1 transition-colors"
                        >
                            <X size={14} className="opacity-60 hover:opacity-100" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
