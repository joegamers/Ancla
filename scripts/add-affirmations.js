/**
 * Script para inyectar un array de afirmaciones nuevas al archivo JSON garantizando UTF-8.
 * Uso: node scripts/add-affirmations.js '[{"text": "...", "author": "...", ...}]'
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPath = path.join(__dirname, '..', 'src', 'data', 'affirmations.json');

try {
    const args = process.argv.slice(2);
    if (!args.length || args[0].trim() === '') {
        console.error('❌ Error: Faltan argumentos.');
        console.log('💡 Opción A: node scripts/add-affirmations.js \'[{"text":"hola"...}]\'');
        console.log('💡 Opción B: node scripts/add-affirmations.js --file=temp.json');
        process.exit(1);
    }

    let newAffirmations = [];

    if (args[0].startsWith('--file=')) {
        const filePath = args[0].split('=')[1];
        const absolutePath = path.resolve(process.cwd(), filePath);
        const content = fs.readFileSync(absolutePath, 'utf8');
        newAffirmations = JSON.parse(content);
    } else {
        // Parse argument correctly allowing for single/double quotes escaped from shells
        let inputString = args[0].trim();
        newAffirmations = JSON.parse(inputString);
    }

    if (!Array.isArray(newAffirmations)) {
        throw new Error('El JSON proporcionado debe ser un Array [] de afirmaciones.');
    }

    // Cargar las actuales
    const raw = fs.readFileSync(targetPath, 'utf8');
    let json = JSON.parse(raw);

    // Filtrar posibles repetidas basándonos en el ID para evitar colisiones
    const existingIds = new Set(json.map(a => a.id));
    const toAdd = newAffirmations.filter(a => {
        if (!a.id || !a.text || !a.author || !a.category) {
            console.warn('⚠️ Se omitió una afirmación por falta de campos obligatorios:', a);
            return false;
        }
        return !existingIds.has(a.id);
    });

    if (toAdd.length === 0) {
        console.log('ℹ️ No se detectaron afirmaciones nuevas válidas (quizás los IDs ya existían).');
        process.exit(0);
    }

    // Inyectar y guardar
    json = json.concat(toAdd);
    fs.writeFileSync(targetPath, JSON.stringify(json, null, 2), 'utf8');

    console.log(`✅ ¡Éxito! Se añadieron ${toAdd.length} afirmación(es) preservando el encoding UTF-8.`);
} catch (e) {
    console.error('❌ Falló la inyección de afirmaciones:', e.message);
    process.exit(1);
}
