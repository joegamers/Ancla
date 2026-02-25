const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/affirmations.json', 'utf8'));
let lastId = parseInt(data[data.length - 1].id, 10);

const newAffirmations = [
    { "text": "Acepto incondicionalmente mis imperfecciones. — Merezco existir alegremente sin necesidad de ser infalible.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Aceptación" },
    { "text": "Prefiero que las cosas salgan bien, pero no es el fin del mundo si fallan. — Yo puedo tolerar la gran frustración.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Tolerancia" },
    { "text": "No me perturban los hechos objetivos externos, sino mi propia y rígida visión sobre ellos. — Elijo la paz hoy.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Claridad" },
    { "text": "Rechazo categóricamente la terrible creencia irracional de que todos deben amarme siempre para ser yo alguien válido.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Independencia" },
    { "text": "El ser humano comete errores graves con total naturalidad absoluta. — Yo decido hoy perdonarme incondicionalmente.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Perdón" },
    { "text": "Tomo absoluta responsabilidad pragmática sobre mis propias emociones alteradas. — Yo soy mi único dueño vital.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Responsabilidad" },
    { "text": "Cambio mis autoexigencias absolutas por simples preferencias humanas flexibles. — La vida fluye mucho más suave.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Flexibilidad" },
    { "text": "Me niego rotundamente a dramatizar excesivamente las contrariedades menores diarias de mi vida actual.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Tranquilidad" },
    { "text": "Ninguna persona es igual a su peor error pasado cometido ciegamente. — Mi esencia valiosa permanece siempre intacta.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Autoestima" },
    { "text": "El universo no está en absoluto obligado a concederme todo lo que ansío profundamente. — Yo lo acepto con paz.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Aceptación" },
    { "text": "Descubrir mi propio pensamiento irracional escondido es siempre mi primer y tremendo salto hacia la alta madurez.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Crecimiento" },
    { "text": "Me comprometo a erradicar de mi diálogo la dañina y exigente palabra 'debería'. — Prefiero alegremente fluir hoy.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Neuroplasticidad" },
    { "text": "Incluso si el resultado futuro fuese absolutamente adverso, yo mantengo la seguridad de que podré soportarlo.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Resiliencia" },
    { "text": "Renuncio para siempre al hábito cruel e inservible de condenar mi propia persona entera por fallos puntuales.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Amor Propio" },
    { "text": "Aunque la injusticia es común, perturbarme excesivamente por ella es inútilmente doloroso. — Actúo en calma.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Paz" },
    { "text": "Me esfuerzo vigorosamente en desarrollar alta tolerancia a la incomodidad natural. — Así crezco inmensamente.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Fortaleza" },
    { "text": "Acepto que mi valor como ser complejo no puede ser realmente encasillado por las estrechas escalas globales de logro.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Valor" },
    { "text": "Mantengo sanamente mis propias perspectivas realistas cuando enfrento el denso clima adverso y poco amigable.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Realismo" },
    { "text": "Confronto hoy activamente la perjudicial idea arraigada de que mi felicidad depende del exterior. — Crezco desde mi.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Felicidad" },
    { "text": "Afronto directamente los problemas pesados habituales en lugar de evadirlos. — Gano gran seguridad con cada paso.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Valentía" },
    { "text": "Mi mente racional y mi corazón vibrante trabajan juntos en gloriosa armonía productiva para estabilizarme sano.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Equilibrio" },
    { "text": "Es completamente absurdo esperar perfección extrema de mis hermanos humanos. — Abro los brazos a la alta compasión.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Compasión" },
    { "text": "Soporte no significa dolorosa sumisión; significa alta capacidad resiliente ante las grandes inclemencias del azar.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Resiliencia" },
    { "text": "El profundo cambio psicológico requiere constante trabajo duro, pero su gratísima recompensa pura es la libertad.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Sanación" },
    { "text": "Cuestiono despiadadamente mis propios rígidos dogmas castigadores y oscuros. — Instalo luminosas verdades empíricas.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Claridad" },
    { "text": "Mi vida avanza majestuosa cuando ceso de exigir en vano facilidades al mundo y comienzo a fortalecerme por dentro.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Independencia" },
    { "text": "Es grato ser aprobado ampliamente por los demás humanos, pero jamás haré de esto una amarga necesidad de vida.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Desapego" },
    { "text": "Evalúo serenamente las desagradables conductas sin castigar jamás el incalculable valor vital de los individuos.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Límites" },
    { "text": "Siento enorme orgullo personal por aprender de manera incansable a dominar mi exigente y antiguo miedo interno hoy.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Orgullo" },
    { "text": "Vivo enfocado intensamente y alegre en este único instante preciado, renunciando a todas las mortificantes rumiaciones.", "author": "Albert Ellis", "source": "Terapia Racional Emotiva", "category": "Mindfulness" }
];

let changedCount = 0;
// Validation specifically for length
newAffirmations.forEach(a => {
    if (a.text.length > 120) {
        console.warn(`WARNING: Affirmation too long (${a.text.length}): ${a.text}`);
    }
});

newAffirmations.forEach(a => {
    lastId++;
    a.id = lastId.toString();
    data.push(a);
});

fs.writeFileSync('src/data/affirmations.json', JSON.stringify(data, null, 2));
console.log(`Added ${newAffirmations.length} affirmations.`);
