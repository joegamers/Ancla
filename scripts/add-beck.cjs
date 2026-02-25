const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/affirmations.json', 'utf8'));
let lastId = parseInt(data[data.length - 1].id, 10);

const newAffirmations = [
    { "text": "Mis pensamientos iniciales no siempre son hechos reales. — Observo mi mente con curiosidad y sin juzgar.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Claridad" },
    { "text": "Tengo el poder de cambiar cómo interpreto cada situación. — Elijo perspectivas que me traen paz interna.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Mindfulness" },
    { "text": "No necesito ser perfecto para ser inmensamente valioso. — Mi valor humano es incondicional e inherente.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Autoestima" },
    { "text": "Si mi mente anticipa desastres, recuerdo que son solo hipótesis. — Me anclo a la realidad del presente seguro.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Ansiedad" },
    { "text": "El fracaso es un evento de aprendizaje, no una identidad. — Analizo mis errores para crecer fortalecido.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Crecimiento" },
    { "text": "Evito leer la mente de los demás. — Prefiero preguntar y comunicarme abiertamente para evitar malentendidos.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Relaciones" },
    { "text": "Las emociones dolorosas son respuestas a mis interpretaciones. — Al flexibilizar mi mente, libero mi corazón.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Emociones" },
    { "text": "Cuestiono activamente mi voz crítica interior. — Merezco tratarme con la misma amabilidad que a un amigo.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Amor Propio" },
    { "text": "Sustituyo el pensamiento polarizado por matices ricos. — La vida no es blanco o negro, está llena de colores.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Flexibilidad" },
    { "text": "Reconozco mis propios logros diarios, por más pequeños que parezcan. — Avanzo constantemente hacia la meta.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Celebración" },
    { "text": "Acepto que no puedo controlar el universo exterior, pero domino magistralmente mis reacciones internas hoy.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Autocontrol" },
    { "text": "El futuro aún no está escrito. — Suelto mis ansiedades anticipatorias y diseño creativamente mi día a día.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Ansiedad" },
    { "text": "Mi tristeza no es permanente, es como una nube pasajera. — Observo cómo se disuelve mientras sigo respirando.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Sanación" },
    { "text": "Me libero de las etiquetas rígidas con las que me juzgaba. — Soy un ser humano complejo, fluido y valioso.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Liberación" },
    { "text": "No necesito la constante aprobación externa para estar en paz. — Mi propia validación es suficiente motor.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Independencia" },
    { "text": "Reemplazo las exigencias de 'debería' por simples preferencias. — Fluyo con la vida sin castigarme de más.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Aceptación" },
    { "text": "Filtro constructivamente mi perspectiva. — Me niego a ignorar lo positivo mientras solo me enfoco en lo malo.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Enfoque" },
    { "text": "Desactivo de inmediato mi visión catastrófica preguntándome por la probabilidad real y lógica de que ocurra.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Racionalidad" },
    { "text": "Examino la evidencia lógicamente antes de dar por cierto un pensamiento doloroso. — Mi raciocinio me protege.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Lógica" },
    { "text": "Tengo derecho absoluto a establecer límites emocionales y físicos saludables sin sentirme jamás culpable.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Límites" },
    { "text": "El pesimismo no es realismo. — Elijo una visión equilibrada que alimenta activamente mis esperanzas futuras.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Esperanza" },
    { "text": "Las sensaciones físicas de estrés son inofensivas. — Yo mantengo la profunda calma sabiendo que van a pasar.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Estrés" },
    { "text": "Abandono cualquier intento de tomarlo todo de forma personal. — Las acciones de otros reflejan su propio mundo.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Desapego" },
    { "text": "Transformo cada desafío complejo en un simple problema lógico con múltiples soluciones posibles de alcanzar.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Resiliencia" },
    { "text": "Al alterar el lente con el que percibo mi dolorida realidad, logro disolver espontáneamente mi sufrimiento.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Cambio" },
    { "text": "Reconozco que dramatizar los eventos solo multiplica en vano y excesivamente mi sensación interna de pánico.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Tranquilidad" },
    { "text": "Mantengo mi mente enfocada únicamente en aquellos problemas que realmente dependen completamente de mi acción.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Eficiencia" },
    { "text": "Mi mente es sumamente capaz de reaprender nuevas formas de pensar mucho más útiles pacíficas y compasivas.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Neuroplasticidad" },
    { "text": "Interrumpo a propósito todos los dolorosos y estresantes ciclos inútiles continuos de rumiación obsesiva.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Mindfulness" },
    { "text": "Invierto tiempo valioso en cuestionar activamente las creencias más amargas irracionales arraigadas adentro.", "author": "Aaron Beck", "source": "Terapia Cognitiva", "category": "Terapia" }
];

newAffirmations.forEach(a => {
    lastId++;
    a.id = lastId.toString();
    data.push(a);
});

fs.writeFileSync('src/data/affirmations.json', JSON.stringify(data, null, 2));
console.log(`Added ${newAffirmations.length} affirmations.`);
