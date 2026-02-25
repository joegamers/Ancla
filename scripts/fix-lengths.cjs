const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/affirmations.json', 'utf8'));

const replacements = {
    "267": "El tesoro auténtico y valioso de la galaxia yace pacíficamente puro dentro de mí.",
    "271": "Cuestiono proactivamente mis ansiedades invasivas. — Los peores escenarios jamás ocurren.",
    "273": "Las punzadas de malestar se difuminan rápido por mi constante autorregulación y paz.",
    "274": "Estoy clínicamente a salvo. — Ninguno de mis pensamientos caóticos posee el poder para dañarme hoy.",
    "275": "Reconstruyo los pilares cognitivos seguros donde basar de aquí adelante toda mi existencia actual.",
    "276": "Reviso analíticamente mis distorsiones asimilando las verdades y desechando todo el ruido residual.",
    "277": "Restauro la química relajante de mi cerebro mediante suaves y precisas respiraciones curativas.",
    "278": "Declamo la detención cognitiva al frenético ruido paralizante que secuestra ahora mi lúcida mente.",
    "279": "Las alertas físicas son energía neutra retenida que yo diluyo tranquilamente mientras respiro.",
    "280": "Mi salud mental robusta siempre perdura indemne ante cualquier avalancha amenazadora del entorno.",
    "281": "Racionalizo rápidamente el miedo infundado usando evidencia absoluta de mi protección incondicional.",
    "282": "Aplico la paciencia estructurada en mi lento proceder regenerativo neuronal garantizando mi sanación.",
    "283": "Aíslo cada suceso estresante perjudicial quitándole la facultad de contaminar los momentos de paz.",
    "284": "Refuerzo el canal directo parasimpático activando de inmediato mi relajación biológica incondicional.",
    "285": "Integro compasivamente antiguas cicatrices somáticas como testimonios de supervivencia imborrables.",
    "286": "Inhibo eficazmente cada impulso primitivo reactivo cediendo control voluntario a la sabia mente frontal.",
    "287": "Las abrumadoras oleadas de profunda fatiga simplemente se enjuagan mediante un profundo descanso.",
    "288": "Mis mecanismos subconscientes funcionan gloriosamente bien orquestando salud constante psíquica.",
    "289": "Toda rumia tóxica es neutralizada cortante y elegantemente anclándome al vívido presente sensomotor.",
    "290": "Transformo magistralmente cada pesimista hipótesis en simples suposiciones erróneas por falsas.",
    "291": "En mi propio refugio terapéutico cognitivo personal jamás penetra el letargo desesperanzador invasivo.",
    "292": "Mitigo hábilmente el agotamiento incesante dándome enormes y abundantes permisos absolutos de paz.",
    "293": "Regulo mi umbral de tolerancia incondicional extendiendo incesante paciencia frente al agobio externo.",
    "294": "La arquitectura psíquica impecable de mi mente alberga en su centro un oasis impenetrable de calma.",
    "295": "Sistematizo impecablemente la disolución de los dolorosos nudos formados en mi red neuronal hoy.",
    "296": "Canalizo el excedente vivo de angustiada energía interna hacia actos plenamente creadores hoy.",
    "297": "Desarrollo una formidable autoconsciencia inquebrantable como escudo frente a dudas futuras."
};

let changed = 0;
data.forEach(item => {
    if (replacements[item.id]) {
        item.text = replacements[item.id];
        changed++;
    }
});

fs.writeFileSync('src/data/affirmations.json', JSON.stringify(data, null, 2));
console.log(`Fixed ${changed} affirmations to strictly under 120 chars.`);
