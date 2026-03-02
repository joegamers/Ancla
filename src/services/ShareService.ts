import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * ShareService — Generates a shareable image of an affirmation
 * using Canvas API and triggers native Share (Capacitor) or Web Share fallback.
 */

interface ShareOptions {
    text: string;
    author: string;
    source?: string;
}

/**
 * Creates a beautiful branded image from an affirmation.
 */
function generateImage(options: ShareOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const width = 1080;
        const height = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));

        // ─── Background: deep dark gradient matching home ───
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#050b16');
        bgGrad.addColorStop(0.35, '#071a26');
        bgGrad.addColorStop(0.55, '#0a2220');
        bgGrad.addColorStop(1, '#060e18');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // ─── Nebula glow layers (simulates wave effects) ───
        // Teal aurora — top
        const glow1 = ctx.createRadialGradient(width * 0.4, height * 0.15, 0, width * 0.4, height * 0.15, 500);
        glow1.addColorStop(0, 'rgba(20, 184, 166, 0.45)');
        glow1.addColorStop(0.5, 'rgba(6, 95, 70, 0.20)');
        glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow1;
        ctx.fillRect(0, 0, width, height);

        // Cyan wave — bottom-right
        const glow2 = ctx.createRadialGradient(width * 0.75, height * 0.8, 0, width * 0.75, height * 0.8, 450);
        glow2.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
        glow2.addColorStop(0.5, 'rgba(8, 145, 178, 0.15)');
        glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow2;
        ctx.fillRect(0, 0, width, height);

        // Violet mist — left
        const glow3 = ctx.createRadialGradient(width * 0.15, height * 0.5, 0, width * 0.15, height * 0.5, 400);
        glow3.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
        glow3.addColorStop(0.6, 'rgba(67, 56, 202, 0.08)');
        glow3.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow3;
        ctx.fillRect(0, 0, width, height);

        // Central glow — behind text
        const glowCenter = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 350);
        glowCenter.addColorStop(0, 'rgba(20, 184, 166, 0.30)');
        glowCenter.addColorStop(0.6, 'rgba(13, 148, 136, 0.10)');
        glowCenter.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowCenter;
        ctx.fillRect(0, 0, width, height);

        // ─── Brand badge — top ───
        ctx.font = '600 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(94, 234, 212, 0.50)';
        ctx.textAlign = 'center';
        ctx.fillText('A  N  C  L  A', width / 2, 120);

        // Decorative lines beside brand
        ctx.strokeStyle = 'rgba(94, 234, 212, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 100, 117);
        ctx.lineTo(width / 2 - 50, 117);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width / 2 + 50, 117);
        ctx.lineTo(width / 2 + 100, 117);
        ctx.stroke();

        // ─── Measure and wrap affirmation text ───
        ctx.font = 'italic 300 38px Inter, Georgia, serif';
        const maxTextWidth = width - 200;
        const lineHeight = 56;
        const words = options.text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxTextWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);

        // ─── Glassmorphism card ───
        const cardPadX = 70;
        const cardPadY = 50;
        const textBlockH = lines.length * lineHeight;
        const cardH = textBlockH + cardPadY * 2 + 20;
        const cardY = (height - cardH) / 2 - 20;
        const cardX = cardPadX;
        const cardW = width - cardPadX * 2;
        const cardRadius = 32;

        // Card background
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fill();
        // Card border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Inner highlight (top edge)
        ctx.beginPath();
        ctx.roundRect(cardX + 1, cardY + 1, cardW - 2, cardH - 2, cardRadius);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // ─── Decorative quote marks ───
        ctx.font = '300 120px Georgia, serif';
        ctx.fillStyle = 'rgba(94, 234, 212, 0.12)';
        ctx.textAlign = 'left';
        ctx.fillText('\u201C', cardX + 25, cardY + 75);
        ctx.textAlign = 'right';
        ctx.fillText('\u201D', cardX + cardW - 25, cardY + cardH - 15);

        // ─── Draw affirmation text with glow ───
        ctx.textAlign = 'center';
        ctx.font = 'italic 300 38px Inter, Georgia, serif';
        const textStartY = cardY + cardPadY + 30;

        // Glow layer (behind text)
        ctx.save();
        ctx.shadowColor = 'rgba(20, 184, 166, 0.4)';
        ctx.shadowBlur = 40;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], width / 2, textStartY + i * lineHeight);
        }
        ctx.restore();

        // Crisp text layer (on top)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], width / 2, textStartY + i * lineHeight);
        }

        // ─── Author (below card) ───
        const authorY = cardY + cardH + 50;
        ctx.font = '500 22px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.textAlign = 'center';
        ctx.fillText(`\u2014 ${options.author}`, width / 2, authorY);

        if (options.source) {
            ctx.font = '400 15px Inter, system-ui, sans-serif';
            ctx.fillStyle = 'rgba(94, 234, 212, 0.30)';
            ctx.fillText(options.source.toUpperCase(), width / 2, authorY + 30);
        }

        // ─── Footer ───
        ctx.font = '500 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(94, 234, 212, 0.35)';
        ctx.fillText('anclas.vercel.app', width / 2, height - 60);
        ctx.font = '400 11px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillText('@JoeGamersDev', width / 2, height - 40);

        // ─── Export as blob ───
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to generate image'));
        }, 'image/png', 1.0);
    });
}

/**
 * Share an affirmation using Web Share API or fallback to download.
 */
export async function shareAffirmation(options: ShareOptions): Promise<void> {
    try {
        const blob = await generateImage(options);
        const fileName = `ancla-afirmacion-${Date.now()}.png`;

        // ─── NATIVE SHARE (Android / iOS) ───
        if (Capacitor.isNativePlatform()) {
            // First, convert blob to base64
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        // Remove the data:image/png;base64, prefix
                        resolve(reader.result.split(',')[1]);
                    } else {
                        reject(new Error('Failed to convert blob to base64'));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            // Write to device cache
            const writeFileResult = await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Cache,
            });

            // Share native URI
            await Share.share({
                title: 'Ancla — Tu espacio de calma',
                text: `"${options.text}" — ${options.author}\n\nEncuentra más paz en: https://anclas.vercel.app`,
                url: writeFileResult.uri, // This is the local file path
                dialogTitle: 'Compartir afirmación'
            });
            return;
        }

        // ─── WEB SHARE (Browser) ───
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({
                title: 'Ancla — Tu espacio de calma',
                text: `"${options.text}" — ${options.author}\n\nEncuentra más paz en: https://anclas.vercel.app`,
                files: [file],
            });
            return;
        }

        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (err) {
        // User cancelled share or error
        if ((err as Error).name !== 'AbortError') {
            console.error('[Ancla] Share error:', err);
        }
    }
}
