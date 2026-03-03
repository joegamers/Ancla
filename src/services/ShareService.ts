/**
 * ShareService — Generates a shareable image of an affirmation
 * using Canvas API and triggers native Share (Capacitor) or Web Share fallback.
 * 
 * Highly optimized for speed to avoid "User Gesture Timeout" on PWA Chrome.
 */

interface ShareOptions {
    text: string;
    author: string;
    source?: string;
    preloadedBlob?: Blob;
}

/**
 * Creates a branded image FAST to ensure navigator.share works.
 */
export function generateImage(options: ShareOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
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

        // ─── Simple Background (fast) ───
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a0f18');
        gradient.addColorStop(0.4, '#0d3d3d');
        gradient.addColorStop(1, '#0a1a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Simple Radial (fast)
        const radial = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 400);
        radial.addColorStop(0, 'rgba(20, 184, 166, 0.15)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        // ─── Fast lines ───
        ctx.strokeStyle = 'rgba(94, 234, 212, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(width / 2 - 60, 200); ctx.lineTo(width / 2 + 60, 200); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width / 2 - 60, height - 200); ctx.lineTo(width / 2 + 60, height - 200); ctx.stroke();

        // ─── Brand badge ───
        ctx.font = '600 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(94, 234, 212, 0.6)';
        ctx.textAlign = 'center';
        // Mock letter spacing via spaces
        ctx.fillText('A N C L A', width / 2, 170);

        // ─── Text wrapping calculation ───
        ctx.font = 'italic 300 40px Inter, Georgia, serif';
        const maxTextWidth = width - 160;
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

        // ─── Draw Quotes and Text ───
        const textBlockHeight = lines.length * lineHeight;
        const startY = (height - textBlockHeight) / 2 + 20;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (i === 0) line = `"${line}`;
            if (i === lines.length - 1) line = `${line}"`;
            ctx.fillText(line, width / 2, startY + i * lineHeight);
        }

        // ─── Author ───
        ctx.font = '500 24px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`— ${options.author}`, width / 2, height - 260);

        if (options.source) {
            ctx.font = '400 16px Inter, system-ui, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillText(options.source, width / 2, height - 230);
        }

        // ─── Footer ───
        ctx.font = '600 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(94, 234, 212, 0.4)';
        ctx.fillText('ANCLAS.VERCEL.APP', width / 2, height - 60);

        // Export (JPEG is ~10x faster than PNG on mobile CPUs, keeps user gesture alive)
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to generate image'));
        }, 'image/jpeg', 0.9);
    });
}

function isNative(): boolean {
    return !!(window as any).Capacitor?.isNativePlatform?.();
}

/**
 * Share an affirmation using Web Share API or Capacitor natively.
 */
export async function shareAffirmation(options: ShareOptions): Promise<void> {
    try {
        const blob = options.preloadedBlob || await generateImage(options);
        const fileName = `ancla-afirm-${Date.now()}.jpeg`;
        const shareTitle = 'Ancla — Tu espacio de calma';
        const shareText = `"${options.text}" — ${options.author}\n\nEncuentra paz en: https://anclas.vercel.app`;

        // 1. CAPACITOR NATIVE (Android APK)
        if (isNative()) {
            try {
                const { Filesystem, Directory } = await import('@capacitor/filesystem');
                const { Share } = await import('@capacitor/share');

                const base64Data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (typeof reader.result === 'string') resolve(reader.result.split(',')[1]);
                        else reject(new Error('b64 fail'));
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
            } catch (err) {
                console.warn('[Ancla] Native share err:', err);
                // fallback below
            }
        }

        // 2. BROWSER / PWA WEB SHARE
        if (navigator.share) {
            try {
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                if (navigator.canShare?.({ files: [file] })) {
                    await navigator.share({
                        title: shareTitle,
                        text: shareText,
                        files: [file],
                    });
                    return;
                }
            } catch (e: any) {
                if (e.name === 'AbortError') return;
                console.warn('[Ancla] Web Share (Image) failed, sending text...', e);
                // Fallback instantly to text
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                });
                return;
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
        console.error('[Ancla] Share failed:', err);

        try {
            const { useStore } = await import('../store/useStore');
            const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
            useStore.getState().showToast(`Error comp: ${errorMsg}`);
        } catch {
            alert('Error al compartir.');
        }
    }
}
