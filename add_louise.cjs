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

const louiseHayAffirmations = [
    // Autoestima / Self-Love
    { text: "Me apruebo a mí mismo profundamente y sin condiciones en este mismo momento.", author: "Louise Hay", source: "Usted puede sanar su vida", category: "Autoestima" },
    { text: "Soy digno de amor, no porque me lo haya ganado, sino simplemente porque existo.", author: "Louise Hay", source: "El poder está dentro de ti", category: "Autoestima" },
    { text: "Renuncio al patrón en mi mente que crea resistencia. Elijo amarme exactamente como soy hoy.", author: "Louise Hay", source: "Usted puede sanar su vida", category: "Autoestima" },
    { text: "Miro mi cuerpo con ojos de amor y aprecio cada cosa maravillosa que hace por mí.", author: "Louise Hay", source: "Afirmaciones Positivas", category: "Autoestima" },
    { text: "Mi corazón y mi mente están abiertos profundamente para recibir y dar amor.", author: "Louise Hay", source: "El poder está dentro de ti", category: "Amor Propio" },

    // Ansiedad / Fear
    { text: "Estoy dispuesto a soltar mis miedos. Solo son pensamientos y los pensamientos pueden cambiar.", author: "Louise Hay", source: "Usted puede sanar su vida", category: "Ansiedad" },
    { text: "Todo está bien en mi mundo. Estoy a salvo y el Universo siempre provee para mis necesidades.", author: "Louise Hay", source: "Afirmaciones Positivas", category: "Ansiedad" },
    { text: "Libero el pasado con amor y elijo fluir suavemente hacia este nuevo momento.", author: "Louise Hay", source: "El poder está dentro de ti", category: "Paz Mental" },
    { text: "Solo atraigo experiencias maravillosas porque estoy alineado con la calma de la vida.", author: "Louise Hay", source: "Usted puede sanar su vida", category: "Ansiedad" },

    // Crecimiento / Healing
    { text: "Tengo dentro de mí todo lo que necesito para superar este obstáculo.", author: "Louise Hay", source: "El poder está dentro de ti", category: "Crecimiento" },
    { text: "Estoy en el proceso de un cambio positivo constante. Me permito evolucionar con gracia.", author: "Louise Hay", source: "Usted puede sanar su vida", category: "Crecimiento" },
    { text: "Cada nuevo día me ofrece una oportunidad perfecta para comenzar de nuevo.", author: "Louise Hay", source: "Sabiduría cotidiana", category: "Crecimiento" },
    { text: "Perdono fácilmente. Elijo soltar el resentimiento porque mi libertad emocional es lo más importante.", author: "Louise Hay", source: "El poder está dentro de ti", category: "Paz Mental" },

    // Paz Mental / Serenity
    { text: "Dondequiera que voy encuentro amor y paz, porque eso es exactamente lo que llevo en mi corazón.", author: "Louise Hay", source: "Usted puede sanar su vida", category: "Paz Mental" },
    { text: "Dejo que la paz interior dirija mi vida. Mi respiración fluye profundamente y todo mi ser se relaja.", author: "Louise Hay", source: "Afirmaciones Positivas", category: "Paz Mental" },
    { text: "Me doy a mí mismo el regalo del silencio, comprendiendo que allí residen todas las respuestas.", author: "Louise Hay", source: "El poder está dentro de ti", category: "Paz Mental" },

    // Focus / Manifesting
    { text: "Merezco lo mejor y acepto lo mejor ahora mismo. Abro mis brazos a la abundancia del universo.", author: "Louise Hay", source: "Usted puede sanar su vida", category: "Focus" },
    { text: "Mi vida es una alegría y fluye con propósito, dirección y significado.", author: "Louise Hay", source: "Pensamientos del corazón", category: "Focus" },
    { text: "Dejo ir toda competencia y comparación; hay suficiente espacio y recursos para todos nosotros.", author: "Louise Hay", source: "El poder está dentro de ti", category: "Focus" },

    // Dormir / Sleep
    { text: "Cierro mis ojos sabiendo que todo el trabajo del día está completo y que soy totalmente merecedor del descanso.", author: "Louise Hay", source: "Adaptación Clínica", category: "Dormir" },
    { text: "En este momento silencioso, elijo perdonarme por cualquier error de hoy. Me deslizo suavemente hacia el sueño.", author: "Louise Hay", source: "Adaptación Clínica", category: "Dormir" },
    { text: "Dejo que mis preocupaciones se disuelvan en el aire de la noche. Mi mente está serena y lista para sanar.", author: "Louise Hay", source: "Sabiduría cotidiana", category: "Dormir" }
];

const formattedLouise = louiseHayAffirmations.map(a => ({
    id: (nextId++).toString(),
    ...a
}));

const combined = [...data, ...formattedLouise];

fs.writeFileSync(path, JSON.stringify(combined, null, 2));

console.log(`Added ${louiseHayAffirmations.length} Louise Hay affirmations. Total database size is now ${combined.length}.`);
