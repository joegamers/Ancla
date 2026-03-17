import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://anclas.vercel.app';
const lastMod = new Date().toISOString().split('T')[0];

interface Affirmation {
  id: string;
  text: string;
}

// Read JSON data directly for the script
const affirmationsPath = path.resolve('src/data/affirmations.json');
const affirmations: Affirmation[] = JSON.parse(fs.readFileSync(affirmationsPath, 'utf-8'));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${affirmations.map((aff: Affirmation) => `
  <url>
    <loc>${DOMAIN}/a/${aff.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

const outputPath = path.resolve('public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap.trim());
console.log(`✅ Sitemap generated with ${affirmations.length} URLs at ${outputPath}`);
