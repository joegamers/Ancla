/**
 * ShareService — Generates a shareable image of an affirmation
 * using Canvas API and triggers Web Share or download fallback.
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

        // ─── Background gradient ───
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a0f18');
        gradient.addColorStop(0.4, '#0d3d3d');
        gradient.addColorStop(1, '#0a1a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Subtle radial glow
        const radial = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 400);
        radial.addColorStop(0, 'rgba(20, 184, 166, 0.12)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        // ─── Decorative elements ───
        // Top line
        ctx.strokeStyle = 'rgba(94, 234, 212, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 60, 200);
        ctx.lineTo(width / 2 + 60, 200);
        ctx.stroke();

        // Bottom line
        ctx.beginPath();
        ctx.moveTo(width / 2 - 60, height - 200);
        ctx.lineTo(width / 2 + 60, height - 200);
        ctx.stroke();

        // ─── Brand badge ───
        ctx.font = '600 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(94, 234, 212, 0.5)';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '6px';
        ctx.fillText('A N C L A', width / 2, 170);

        // ─── Affirmation text ───
        ctx.font = 'italic 300 40px Inter, Georgia, serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';

        // Word-wrap the text
        const maxWidth = width - 160;
        const lineHeight = 56;
        const words = options.text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);

        // Center vertically
        const textBlockHeight = lines.length * lineHeight;
        const startY = (height - textBlockHeight) / 2 + 20;

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(`"${i === 0 ? '' : ''}${lines[i]}${i === lines.length - 1 ? '' : ''}"`.replace(/""/g, '"'), width / 2, startY + i * lineHeight);
        }

        // Fix: draw quotes properly
        ctx.fillText('', 0, 0); // reset
        // Redraw with proper quotes
        ctx.clearRect(0, 0, width, height); // clear and redo

        // Redo background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        // Redo decorative lines
        ctx.strokeStyle = 'rgba(94, 234, 212, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 60, 200);
        ctx.lineTo(width / 2 + 60, 200);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width / 2 - 60, height - 200);
        ctx.lineTo(width / 2 + 60, height - 200);
        ctx.stroke();

        // Brand
        ctx.font = '600 14px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(94, 234, 212, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText('A N C L A', width / 2, 170);

        // Text with quotes as a single block
        ctx.font = 'italic 300 40px Inter, Georgia, serif';
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
        ctx.font = '600 18px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(94, 234, 212, 0.45)';
        ctx.letterSpacing = '3px';
        ctx.fillText('ANCLAS.VERCEL.APP · @JOEGAMERSDEV', width / 2, height - 60);

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
        const file = new File([blob], 'ancla-afirmacion.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({
                title: 'Ancla — Tu espacio de calma',
                text: `"${options.text}" — ${options.author}\n\nEncuentra más paz en: https://anclas.vercel.app`,
                url: 'https://anclas.vercel.app',
                files: [file],
            });
            return;
        }

        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ancla-afirmacion.png';
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
