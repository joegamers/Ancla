import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from './ui/button';
import { affirmationEngine } from '../services/AffirmationEngine';

interface IntentionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (category: string) => void;
}

export const IntentionsModal: React.FC<IntentionsModalProps> = ({ isOpen, onClose, onSelect }) => {
    // Get all unique categories dynamically from the engine
    const allCategories = useMemo(() => affirmationEngine.getAllCategories(), []);

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
                        className="relative w-full max-w-4xl h-[80vh] flex flex-col"
                    >
                        <GlassCard className="flex-1 flex flex-col p-6 md:p-8 !bg-white/95 dark:!bg-slate-900/95 border border-white/20 shadow-2xl overflow-hidden">
                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <h2 className="text-xl font-semibold text-zen-primary dark:text-slate-100 flex items-center gap-2">
                                    <Hash className="w-5 h-5" />
                                    Todas las Intenciones
                                </h2>
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                    <X className="w-5 h-5 text-zen-secondary dark:text-slate-400" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="mb-6">
                                    <Button
                                        variant="zen"
                                        onClick={() => onSelect('Todas')}
                                        className="w-full py-4 px-6 justify-between items-center rounded-2xl
                                            bg-gradient-to-r from-teal-50 to-white/50 border-teal-200 
                                            dark:from-teal-900/40 dark:to-slate-900/40 dark:border-teal-500/30 
                                            text-teal-900 dark:text-teal-100
                                            hover:from-teal-100 hover:to-white dark:hover:from-teal-900/60 dark:hover:to-slate-900/60
                                            shadow-sm hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 group-hover:scale-110 transition-transform">
                                                <Sparkles size={18} />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm font-bold uppercase tracking-wider">Mezcla Universal</span>
                                                <span className="text-[10px] opacity-70 font-medium">Todas las vibras a la vez</span>
                                            </div>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-8">
                                    {allCategories.map((cat) => (
                                        <Button
                                            key={cat}
                                            variant="ghost"
                                            onClick={() => onSelect(cat)}
                                            className="h-auto py-3 px-4 justify-start rounded-xl border
                                                bg-white/40 border-slate-200/60
                                                dark:bg-white/5 dark:border-white/10 dark:text-slate-200
                                                hover:bg-white/80 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20
                                                transition-all duration-200"
                                        >
                                            <span className="text-xs text-left font-medium text-slate-700 dark:text-slate-300 tracking-wide truncate w-full">
                                                {cat}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
