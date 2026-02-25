const fs = require('fs');

const path = 'src/data/affirmations.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Determine the next highest numeric ID to continue sequentially
let maxId = 0;
data.forEach(a => {
    const numId = parseInt(a.id, 10);
    if (!isNaN(numId) && numId > maxId) {
        maxId = numId;
    }
});
let nextId = maxId + 1;

const biblicalAffirmations = [
    // Paz Mental / Fe
    { text: "No me afano por el mañana; hoy decido enfocarme solo en el paso que tengo frente a mí, confiando en la provisión divina.", author: "Mateo 6:34", source: "Biblia", category: "Paz Mental" },
    { text: "Echo toda mi ansiedad sobre Él, porque sé que Él tiene cuidado de mí.", author: "1 Pedro 5:7", source: "Biblia", category: "Ansiedad" },
    { text: "La paz de Dios, que sobrepasa todo entendimiento, guarda mi corazón y mis pensamientos en este momento.", author: "Filipenses 4:7", source: "Biblia", category: "Paz Mental" },
    { text: "No me ha dado Dios un espíritu de cobardía, sino de poder, de amor y de dominio propio.", author: "2 Timoteo 1:7", source: "Biblia", category: "Focus" },
    { text: "En paz me acuesto y asimísmo duermo, porque solo Tú me haces vivir confiado.", author: "Salmos 4:8", source: "Biblia", category: "Dormir" },

    // Crecimiento / Fortaleza
    { text: "Todo lo puedo en Aquel que me fortalece. Mi fuerza no proviene solo de mí, sino de una fuente inagotable.", author: "Filipenses 4:13", source: "Biblia", category: "Crecimiento" },
    { text: "Aunque ande en valle de sombra, no temeré mal alguno, porque Tú estás conmigo.", author: "Salmos 23:4", source: "Biblia", category: "Ansiedad" },
    { text: "Mi fe es la certeza de lo que espero, la convicción de lo que aún no veo.", author: "Hebreos 11:1", source: "Biblia", category: "Focus" },
    { text: "Renuevo mi mente cada día; dejo atrás lo viejo y abrazo la transformación de mi ser.", author: "Romanos 12:2", source: "Biblia", category: "Crecimiento" },
    { text: "Busco primero la paz y la justicia, sabiendo que todo lo demás me será añadido a su debido tiempo.", author: "Mateo 6:33", source: "Biblia", category: "Focus" },

    // Amor Propio / Identidad
    { text: "Soy una creación maravillosa; reconozco el valor infinito que se me fue dado desde mi origen.", author: "Salmos 139:14", source: "Biblia", category: "Autoestima" },
    { text: "Nada de lo que enfrento hoy podrá separarme del amor incondicional que me sostiene.", author: "Romanos 8:38-39", source: "Biblia", category: "Autoestima" },
    { text: "Dejo que el amor perfecto eche fuera todo mi temor; elijo caminar con confianza.", author: "1 Juan 4:18", source: "Biblia", category: "Ansiedad" },
    { text: "Soy hechura suya, creado para buenas obras; mi vida tiene un propósito profundo.", author: "Efesios 2:10", source: "Biblia", category: "Autoestima" },

    // Ansiedad / Descanso
    { text: "Vengo a descansar; entrego mis cargas pesadas y recibo a cambio ligereza y paz.", author: "Mateo 11:28", source: "Biblia", category: "Ansiedad" },
    { text: "Mi corazón no se turbará ni tendrá miedo. Recibo la paz que se me ha dado.", author: "Juan 14:27", source: "Biblia", category: "Paz Mental" },
    { text: "Espero con paciencia; renuevo mis fuerzas y me levanto como las águilas por encima de mis problemas.", author: "Isaías 40:31", source: "Biblia", category: "Crecimiento" },
    { text: "Sé que los planes que hay para mí son de bienestar y no de calamidad, para darme un futuro y una esperanza.", author: "Jeremías 29:11", source: "Biblia", category: "Focus" },

    // Focus / Sabiduría
    { text: "Si me falta sabiduría, la pido con fe, confiando en que se me dará abundantemente.", author: "Santiago 1:5", source: "Biblia", category: "Focus" },
    { text: "Guardo mi corazón por sobre todas las cosas, porque sé que de él mana la vida.", author: "Proverbios 4:23", source: "Biblia", category: "Autoestima" },
    { text: "No me apoyaré solo en mi propia prudencia; reconozco la guía superior en todos mis caminos.", author: "Proverbios 3:5-6", source: "Biblia", category: "Paz Mental" }
];

const formattedBible = biblicalAffirmations.map(a => ({
    id: (nextId++).toString(),
    ...a
}));

const combined = [...data, ...formattedBible];

fs.writeFileSync(path, JSON.stringify(combined, null, 2));

console.log(`Added ${biblicalAffirmations.length} Biblical affirmations. Total database size is now ${combined.length}.`);
