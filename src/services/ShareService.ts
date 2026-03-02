/**
 * ShareService — Generates a shareable image of an affirmation
 * using Canvas API and triggers native Share (Capacitor) or Web Share fallback.
 * 
 * Uses dynamic imports for Capacitor so it doesn't break PWA environments.
 */

interface ShareOptions {
    text: string;
    author: string;
    source?: string;
}

/**
 * Draws a rounded rectangle path using arcTo (compatible with all browsers/WebViews).
 */
function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

/**
 * Creates a beautiful branded image from an affirmation.
 */
function generateImage(options: ShareOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
        try {
            const width = 1080;
            const height = 1080;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas not supported'));
                return;
            }

            // ─── Background: deep dark gradient ───
            const bgGrad = ctx.createLinearGradient(0, 0, width, height);
            bgGrad.addColorStop(0, '#050b16');
            bgGrad.addColorStop(0.35, '#071a26');
            bgGrad.addColorStop(0.55, '#0a2220');
            bgGrad.addColorStop(1, '#060e18');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // ─── Nebula glow layers ───
            const glow1 = ctx.createRadialGradient(width * 0.4, height * 0.15, 0, width * 0.4, height * 0.15, 500);
            glow1.addColorStop(0, 'rgba(20, 184, 166, 0.45)');
            glow1.addColorStop(0.5, 'rgba(6, 95, 70, 0.20)');
            glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glow1;
            ctx.fillRect(0, 0, width, height);

            const glow2 = ctx.createRadialGradient(width * 0.75, height * 0.8, 0, width * 0.75, height * 0.8, 450);
            glow2.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
            glow2.addColorStop(0.5, 'rgba(8, 145, 178, 0.15)');
            glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glow2;
            ctx.fillRect(0, 0, width, height);

            const glowCenter = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 350);
            glowCenter.addColorStop(0, 'rgba(20, 184, 166, 0.30)');
            glowCenter.addColorStop(0.6, 'rgba(13, 148, 136, 0.10)');
            glowCenter.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glowCenter;
            ctx.fillRect(0, 0, width, height);

            // ─── Brand badge ───
            ctx.font = '600 14px Inter, system-ui, sans-serif';
            ctx.fillStyle = 'rgba(94, 234, 212, 0.50)';
            ctx.textAlign = 'center';
            ctx.fillText('A  N  C  L  A', width / 2, 120);

            // Decorative lines
            ctx.strokeStyle = 'rgba(94, 234, 212, 0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(width / 2 - 100, 117); ctx.lineTo(width / 2 - 50, 117); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(width / 2 + 50, 117); ctx.lineTo(width / 2 + 100, 117); ctx.stroke();

            // ─── Measure and wrap text ───
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
            drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Inner highlight
            drawRoundRect(ctx, cardX + 1, cardY + 1, cardW - 2, cardH - 2, cardRadius);
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

            // ─── Draw affirmation text ───
            ctx.textAlign = 'center';
            ctx.font = 'italic 300 38px Inter, Georgia, serif';
            const textStartY = cardY + cardPadY + 30;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], width / 2, textStartY + i * lineHeight);
            }

            // ─── Author ───
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

            // ─── Export as blob ───
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to generate image'));
            }, 'image/png', 1.0);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Detect if running natively in Capacitor shell safely.
 */
function isNative(): boolean {
    return !!(window as any).Capacitor?.isNativePlatform?.();
}

/**
 * Share an affirmation: attempts native -> Web Share with image -> Web Share text only -> download
 */
export async function shareAffirmation(options: ShareOptions): Promise<void> {
    try {
        const blob = await generateImage(options);
        const fileName = `ancla-afirmacion-${Date.now()}.png`;

        const shareTitle = 'Ancla — Tu espacio de calma';
        const shareText = `"${options.text}" — ${options.author}\n\nEncuentra más paz en: https://anclas.vercel.app`;

        // 1. NATIVE SHARE VIA CAPACITOR
        if (isNative()) {
            try {
                const { Filesystem, Directory } = await import('@capacitor/filesystem');
                const { Share } = await import('@capacitor/share');

                const base64Data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === 'string') resolve(reader.result.split(',')[1]);
                        else reject(new Error('Failed to convert to base64'));
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });

                const writeResult = await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: Directory.Cache,
                });

                await Share.share({
                    title: shareTitle,
                    text: shareText,
                    url: writeResult.uri,
                    dialogTitle: 'Compartir afirmación'
                });
                return;
            } catch (nativeErr) {
                console.warn('[Ancla] Native share error:', nativeErr);
                // Fall through to web sharing
            }
        }

        // 2. WEB SHARE
        if (navigator.share) {
            try {
                const file = new File([blob], fileName, { type: 'image/png' });
                // If canShare supports the file, try sharing with the image
                if (navigator.canShare?.({ files: [file] })) {
                    await navigator.share({
                        title: shareTitle,
                        text: shareText,
                        files: [file],
                    });
                    return;
                } else {
                    // Fallback to just sharing text/link if files aren't supported
                    await navigator.share({
                        title: shareTitle,
                        text: shareText,
                    });
                    return;
                }
            } catch (webShareErr: any) {
                // If sharing file failed (e.g. some Android Chrome issues), try text-only fallback
                if (webShareErr.name !== 'AbortError' && webShareErr.name !== 'NotAllowedError') {
                    console.warn('[Ancla] Image web share failed, attempting text-only...', webShareErr);
                    try {
                        await navigator.share({
                            title: shareTitle,
                            text: shareText,
                        });
                        return;
                    } catch (textShareErr: any) {
                        if (textShareErr.name === 'AbortError') return;
                        throw textShareErr; // go to download fallback
                    }
                } else if (webShareErr.name === 'AbortError') {
                    return; // user cancelled
                }
                throw webShareErr; // NotAllowedError or other
            }
        }

        // 3. FALLBACK: DOWNLOAD
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('[Ancla] Final Share error:', err);

        // Show user feedback that sharing failed
        try {
            const { useStore } = await import('../store/useStore');
            useStore.getState().showToast('Error al compartir. Asegúrate de intentar desde tu navegador.');
        } catch {
            alert('No se pudo compartir la imagen. Por favor intenta de nuevo.');
        }
    }
}
