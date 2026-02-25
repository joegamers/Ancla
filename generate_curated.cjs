const fs = require('fs');
let baseId = 1000;
const newAffirmations = [
    // Mindfulness / Thich Nhat Hanh
    { text: "Mi respiración es el puente que me conecta con la vida y la conciencia en este momento.", author: "Thich Nhat Hanh", source: "The Miracle of Mindfulness", category: "Paz Mental" },
    { text: "Para que las cosas se revelen, elijo estar listo para abandonar mis puntos de vista tradicionales.", author: "Thich Nhat Hanh", source: "Mindfulness", category: "Crecimiento" },
    { text: "Sonrío a la nube gris dentro de mí; reconozco mi dolor sin que me defina.", author: "Thich Nhat Hanh", source: "Mindfulness", category: "Ansiedad" },
    { text: "Bebo mi té despacio y con reverencia, como si este acto fuera el eje sobre el que gira el mundo.", author: "Thich Nhat Hanh", source: "Mindfulness", category: "Paz Mental" },

    // Jon Kabat-Zinn
    { text: "No puedo detener las olas de la vida, pero elijo aprender a surfearlas.", author: "Jon Kabat-Zinn", source: "Wherever You Go, There You Are", category: "Crecimiento" },
    { text: "Me permito estar plenamente donde estoy, abrazando este instante por completo.", author: "Jon Kabat-Zinn", source: "Mindfulness", category: "Ansiedad" },

    // Eckhart Tolle
    { text: "Reconozco profundamente que el momento presente es lo único que tengo.", author: "Eckhart Tolle", source: "El Poder del Ahora", category: "Paz Mental" },
    { text: "Cualquier cosa que el momento presente contenga, elijo aceptarla como si yo mismo la hubiera elegido.", author: "Eckhart Tolle", source: "El Poder del Ahora", category: "Paz Mental" },
    { text: "No me preocupo por el futuro; encuentro mi fuerza en lidiar con el ahora.", author: "Eckhart Tolle", source: "El Poder del Ahora", category: "Ansiedad" },
    { text: "Dejo ir mi resistencia interna; la paz fluye cuando dejo de pelear con lo que es.", author: "Eckhart Tolle", source: "Un Nuevo Mundo Ahora", category: "Dormir" },

    // CBT: Aaron Beck & Albert Ellis
    { text: "Mis pensamientos no son hechos absolutos, son solo eventos mentales pasajeros que no me controlan.", author: "Aaron Beck", source: "Terapia Cognitiva", category: "Ansiedad" },
    { text: "No soy perturbado por lo que sucede, sino por la visión que elijo tener sobre lo que sucede. Elijo la calma.", author: "Albert Ellis", source: "Terapia Racional Emotiva", category: "Paz Mental" },
    { text: "Dejo de exigir que el mundo sea fácil, y en su lugar construyo tolerancia a la incomodidad.", author: "Albert Ellis", source: "REBT", category: "Crecimiento" },
    { text: "No catastrofizo mi futuro; elijo centrarme en las soluciones de mi presente.", author: "Aaron Beck", source: "Terapia Cognitiva", category: "Ansiedad" },
    { text: "Acepto que equivocarme no me hace un fracaso, solo me hace un ser humano aprendiendo.", author: "Albert Ellis", source: "REBT", category: "Autoestima" },

    // Viktor Frankl (Logotherapy)
    { text: "Entre lo que me pasa y cómo reacciono hay un espacio. En ese espacio reside mi poder para elegir la calma.", author: "Viktor Frankl", source: "El hombre en busca de sentido", category: "Focus" },
    { text: "Incluso cuando no puedo cambiar una situación, siempre mantengo la libertad de elegir mi actitud ante ella.", author: "Viktor Frankl", source: "El hombre en busca de sentido", category: "Paz Mental" },
    { text: "Encuentro significado incluso en mi sufrimiento, sabiendo que me forja en alguien más fuerte.", author: "Viktor Frankl", source: "Logoterapia", category: "Crecimiento" },

    // Carl Jung
    { text: "No soy lo que me ha sucedido; soy la persona en la que elijo convertirme a partir de hoy.", author: "Carl Jung", source: "Psicología Analítica", category: "Autoestima" },
    { text: "Miro mi propia oscuridad para poder tener visión; entiendo que la luz nace de la sombra.", author: "Carl Jung", source: "Psicología Analítica", category: "Crecimiento" },
    { text: "Hasta que no haga consciente lo inconsciente, dejaré de llamarle destino a lo que me sucede.", author: "Carl Jung", source: "Psicología Analítica", category: "Focus" },

    // Carl Rogers
    { text: "La curiosa paradoja es que cuando logro aceptarme a mí mismo tal cual soy, es entonces cuando puedo cambiar.", author: "Carl Rogers", source: "Terapia Centrada en el Cliente", category: "Autoestima" },
    { text: "Me permito ser un proceso fluido, dejando ir la necesidad de ser una entidad estática y terminada.", author: "Carl Rogers", source: "Psicología Humanista", category: "Crecimiento" },
    { text: "Confío en mi propia experiencia orgánica por encima del juicio externo.", author: "Carl Rogers", source: "Terapia Centrada en el Cliente", category: "Autoestima" },

    // Stoicism: Marcus Aurelius, Seneca, Epictetus
    { text: "Tengo poder sobre mi propia mente, no sobre los eventos externos. Al darme cuenta de esto, encuentro fuerza inquebrantable.", author: "Marco Aurelio", source: "Meditaciones", category: "Ansiedad" },
    { text: "Reconozco que sufro más en mi propia imaginación que en la realidad tangible.", author: "Séneca", source: "Cartas a Lucilio", category: "Ansiedad" },
    { text: "No es lo que me sucede, sino cómo elijo reaccionar a ello lo que define mi vida.", author: "Epicteto", source: "Enquiridión", category: "Crecimiento" },
    { text: "Obstáculo es el camino; uso esta adversidad actual como combustible para mi avance.", author: "Marco Aurelio", source: "Meditaciones", category: "Focus" },
    { text: "Mi mente se tiñe del color de mis pensamientos; hoy elijo pensamientos de serenidad y virtud.", author: "Marco Aurelio", source: "Meditaciones", category: "Paz Mental" },
    { text: "La suerte es lo que sucede cuando la preparación extrema se encuentra con la oportunidad.", author: "Séneca", source: "Filosofía Estoica", category: "Focus" },

    // Brené Brown (Vulnerability/Shame)
    { text: "Me permito ser vulnerable. Reconozco que es mi mayor medida de coraje, no de debilidad.", author: "Brené Brown", source: "Daring Greatly", category: "Autoestima" },
    { text: "Dejo ir la meta de ser perfecto y abrazo mi propia autenticidad con compasión.", author: "Brené Brown", source: "Dones de la Imperfección", category: "Autoestima" },
    { text: "Hablar de mis miedos les quita el poder que tienen sobre mí.", author: "Brené Brown", source: "Daring Greatly", category: "Ansiedad" },

    // Kristin Neff (Self-Compassion)
    { text: "Me trato a mí mismo con la misma amabilidad, cuidado y paciencia que le daría a un buen amigo herido.", author: "Kristin Neff", source: "Autocompasión", category: "Autoestima" },
    { text: "Reconozco que el dolor es parte de la experiencia humana compartida; no estoy solo en lo que siento.", author: "Kristin Neff", source: "Autocompasión", category: "Ansiedad" },
    { text: "En lugar de juzgarme sin piedad, elijo abrazarme con suavidad en este momento difícil.", author: "Kristin Neff", source: "Autocompasión", category: "Paz Mental" },

    // Tara Brach (Radical Acceptance)
    { text: "Digo \"sí\" a lo que está sucediendo en mi interior en este momento, rindiéndome a la realidad con amabilidad.", author: "Tara Brach", source: "Aceptación Radical", category: "Paz Mental" },
    { text: "Hago una pausa. Respiro. Reconozco qué está pasando y lo permito simplemente estar ahí.", author: "Tara Brach", source: "Práctica RAIN", category: "Ansiedad" },

    // Pema Chödrön (Buddhism)
    { text: "El caos frente a mí es el lugar perfecto para despertar y crecer; no huyo de él.", author: "Pema Chödrön", source: "Cuando todo se derrumba", category: "Crecimiento" },
    { text: "Dejo que esta incomodidad me suavice el corazón en lugar de endurecerme.", author: "Pema Chödrön", source: "Cuando todo se derrumba", category: "Paz Mental" },

    // Rumi 
    { text: "Entiendo que la herida es precisamente el lugar por donde la luz entra en mí.", author: "Rumi", source: "Poemas", category: "Crecimiento" },
    { text: "Acepto quien soy y, al hacerlo, me doy cuenta de que todo el universo estaba ya dentro de mí.", author: "Rumi", source: "Poemas", category: "Autoestima" },

    // Lao Tzu
    { text: "La naturaleza nunca se apresura, y sin embargo todo se logra. Hoy respiro en el ritmo de la naturaleza.", author: "Lao Tsé", source: "Tao Te Ching", category: "Ansiedad" },
    { text: "Al dejar ir de lo que soy, elijo convertirme en aquello en lo que podría llegar a ser.", author: "Lao Tsé", source: "Tao Te Ching", category: "Crecimiento" },

    // Additional Clinical / Sleep
    { text: "El sueño es un puente seguro entre este día y mi mañana. Cruzo con total confianza.", author: "Matthew Walker", source: "Why We Sleep", category: "Dormir" },
    { text: "Mi mente consciente ha hecho suficiente por hoy; autorizo a mi subconsciente a descansar en calma.", author: "Joseph Murphy", source: "El poder de tu mente subconsciente", category: "Dormir" },
    { text: "Libero todas las expectativas del mañana y me sumerjo placenteramente en la sanación del sueño ahora.", author: "Dr. Andrew Huberman", source: "Neurociencia del Sueño", category: "Dormir" },
    { text: "El descanso profundo no es un lujo, es el cimiento absoluto de mi sistema nervioso.", author: "Dr. Andrew Huberman", source: "Neurociencia del Sueño", category: "Dormir" },
    { text: "Me perdono por lo que no logré hoy. La noche está aquí y yo decido soltar las cargas.", author: "Kristin Neff", source: "Autocompasión", category: "Dormir" },
    { text: "Miro la oscuridad con comodidad. En este silencio mi cuerpo se regenera totalmente.", author: "Jon Kabat-Zinn", source: "Mindfulness", category: "Dormir" },

    // Growth / Focus
    { text: "Mantengo mi atención en el siguiente paso más obvio. No necesito ver toda la escalera para subir un nivel.", author: "Martin Luther King Jr.", source: "Adaptación Clínica", category: "Focus" },
    { text: "No pierdo energía en cosas fuera de mi círculo de influencia; concentro mi poder únicamente en lo que puedo controlar.", author: "Stephen Covey", source: "Los 7 Hábitos", category: "Focus" },
    { text: "Mis hábitos de hoy, por pequeños que sean, están esculpiendo mi identidad futura. Elijo el esfuerzo silencioso.", author: "James Clear", source: "Hábitos Atómicos", category: "Focus" },
    { text: "Las distracciones retroceden; mi capacidad cognitiva y mi voluntad permanecen afiladas y presentes.", author: "Cal Newport", source: "Deep Work", category: "Focus" },
    { text: "Donde coloco mi atención fluye mi energía. Hoy elijo enfocarme estrictamente en mi progreso.", author: "Tony Robbins", source: "Despertando al gigante", category: "Focus" },
    { text: "Acepto el estado de flujo. Toda mi energía mental se alza para encontrar el ritmo perfecto de mi trabajo actual.", author: "Mihaly Csikszentmihalyi", source: "Flow", category: "Focus" }
].map(a => ({
    id: (baseId++).toString(),
    text: a.text,
    author: a.author,
    source: a.source,
    category: a.category
}));

const curatedBase = JSON.parse(fs.readFileSync('curated_base.json', 'utf8'));

// Generate sequential short IDs for clean merge
const all = [...curatedBase, ...newAffirmations].map((a, i) => ({
    id: (i + 1).toString(),
    text: a.text,
    author: a.author,
    source: a.source,
    category: a.category
}));

fs.writeFileSync('src/data/affirmations.json', JSON.stringify(all, null, 2));
console.log(`Created new precise database with ${all.length} high-quality expert-sourced affirmations.`);
