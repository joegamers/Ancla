import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Calculates responsive Tailwind font size classes based on text length
 * to ensure long affirmations fit within the screen without scrolling.
 */
export function getFontSize(text: string) {
    const length = text.length;
    if (length < 40) return 'text-4xl sm:text-5xl md:text-6xl';
    if (length < 70) return 'text-3xl sm:text-4xl md:text-5xl';
    if (length < 110) return 'text-2xl sm:text-3xl md:text-4xl';
    if (length < 160) return 'text-xl sm:text-2xl md:text-3xl';
    if (length < 220) return 'text-lg sm:text-xl md:text-2xl';
    if (length < 280) return 'text-base sm:text-lg md:text-xl';
    return 'text-sm sm:text-base md:text-lg';
}
