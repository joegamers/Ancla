import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'teal' | 'sage';
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`glass dark:bg-slate-950/50 dark:border-white/10 dark:text-slate-100 p-10 md:p-14 rounded-3xl ${className}`}
        >
            {children}
        </motion.div>
    );
};
