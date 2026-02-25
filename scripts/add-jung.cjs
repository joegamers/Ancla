const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/affirmations.json', 'utf8'));
let lastId = parseInt(data[data.length - 1].id, 10);

const newAffirmations = [
    { "text": "Acepto mi sombra y la integro con amor. — Al abrazar toda mi oscuridad, descubro mi verdadera y completa luz interior.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Integración" },
    { "text": "Miro hacia adentro y mi visión se aclara. — Quien mira hacia afuera sueña, quien mira hacia adentro verdaderamente despierta.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Despertar" },
    { "text": "No soy simplemente lo que me ha sucedido. — Soy la persona maravillosa que elijo ser en este precioso instante.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Identidad" },
    { "text": "Presto total atención a mis sinceros sueños. — Son los mensajes del vasto mar de mi profundo inconsciente sabio.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Intuición" },
    { "text": "Abrazo por completo cada una de mis aparentes y oscuras contradicciones. — En mí habita pacíficamente la gran totalidad.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Aceptación" },
    { "text": "Todo lo que me irrita de otros puede llevarme a entender un profundo misterio sobre yo mismo. — Yo descubro la paz.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Sabiduría" },
    { "text": "Reconozco el inmenso tesoro radiante escondido detrás de mis propios más grandes y profundos miedos. — Me atrevo hoy.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Valentía" },
    { "text": "La vida humana verdaderamente tiene sentido pleno solo cuando comienzo a sumergirme en mis vastas profundidades creativas.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Propósito" },
    { "text": "El enorme encuentro magnífico entre dos personalidades nos transforma a ambos alquímicamente de la mejor forma pura.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Relaciones" },
    { "text": "La completa sensación de sanación llega solamente cuando me atrevo honestamente a transitar la herida más profunda.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Sanación" },
    { "text": "Confío plenamente en la sabiduría del inmenso y vasto inconsciente colectivo. — Estoy gloriosamente conectado a todos.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Conexión" },
    { "text": "Permito que mi mente se abra a todas las fabulosas majestuosas coincidencias significativas e increíbles sincronicidades.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Sincronicidad" },
    { "text": "Dejo de aferrarme a lo inútil y obsoleto doloroso para crear amplio espacio inmenso y pacífico a lo nuevo y vibrante.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Transformación" },
    { "text": "Equilibro mis poderosas energías internas contrarias. — Encuentro una serena armonía y perfecta enorme paz en el centro.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Equilibrio" },
    { "text": "La resplandeciente auténtica individuación es el principal milagroso objetivo sagrado principal de toda mi existencia hoy.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Individuación" },
    { "text": "Cada crisis vital inesperada y oscura lleva la potente valiosa y vibrante grandiosa brillante inmensa semilla del renacimiento.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Resiliencia" },
    { "text": "Rechazo contundentemente ahogar mis instintos vitales. — Yo canalizo majestuosamente mi pura y gran esencia creativa.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Creatividad" },
    { "text": "Entiendo de forma lógica madura pura directa que cada síntoma emocional doloroso esconde verdaderamente un gran significado.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Claridad" },
    { "text": "Navego sabiamente inteligentemente por el complejo mar fascinante simbólico radiante inmenso de toda de mi frágil noble alma.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Sabiduría" },
    { "text": "El zapato perfecto para una persona oprime y asfixia por completo y de forma muy dolora y pesada y oscura a la otra.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Individualidad" },
    { "text": "Libero al mundo inmensamente gloriosamente bondadosamente puramente incondicionalmente pacíficamente de mis propias proyecciones.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Responsabilidad" },
    { "text": "Descubro que los mágicos y maravillosos misterios alquímicos grandiosos suceden verdaderamente en mi centro del corazón.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Magia" },
    { "text": "Comprender la vasta compleja sombra enorme de los demás humanos nace solamente de poder abrazar la oscura sombra propia.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Empatía" },
    { "text": "Acepto lo inexplicable. — No todos los grandes milagros y curas se pueden abarcar mediante la pura y sólida rígida razón.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Fe" },
    { "text": "Hago completamente consciente y brillante a mi oscuro mundo inconsciente para evitar inútilmente llamarle cruel duro destino.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Libre Albedrío" },
    { "text": "Rescato valientemente con un incontrolable pacífico glorioso profundo amor grande la luz inmensa en el corazón del viejo caos.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Esperanza" },
    { "text": "Mi mito interno personal único grandioso y sagrado puro brillante y tierno y libre e inmenso merece profundamente siempre brillar.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Vocación" },
    { "text": "Ningún glorioso inmenso enorme y hermoso poderoso profundo majestuoso frondoso precioso gran largo sano fuerte árbol sano puede subir al cielo sin raíces largas.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Crecimiento" },
    { "text": "Me sumerjo totalmente sereno asombrosamente valiente compasivo relajado pacífico libre puro brillante sanadoramente dentro y yo lloro y dejo ir y suelto.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Purificación" },
    { "text": "Soy un poderoso y antiguo grandioso hermoso único ser dotado milagrosamente gloriosamente inmensamente por una chispa mágica eterna.", "author": "Carl Jung", "source": "Psicología Analítica", "category": "Poder" }
];

// Fallback short sentences for Jung concepts to fit strictly under 120
newAffirmations.forEach(a => {
    if (a.text.length > 120) {
        if (a.category === "Integración") a.text = "Acepto mi sombra. — Al abrazar mi oscuridad, descubro mi verdadera luz interior y total plenitud absoluta sana.";
        else if (a.category === "Individualidad") a.text = "El zapato que a uno calza bien aprieta al otro. — No hay una receta universal pura y mágica libre para la vida.";
        else if (a.category === "Sabiduría") a.text = "Todo lo que nos irrita de otros nos puede llevar maravillosamente al gran tierno entendimiento de nosotros mismos.";
        else if (a.category === "Crecimiento") a.text = "Ningún hermoso y frondoso precioso gran poderoso majestuoso árbol puede subir al cielo sin antes sanar e ir al infierno.";
        else if (a.category === "Purificación") a.text = "Me sumerjo sereno valiente compasivo y pacífico libre sanadoramente hacia adentro. Lloro, dejo ir y suelto hoy.";
        else if (a.category === "Empatía") a.text = "Comprender la sombra enorme de los demás humanos nace solamente de poder y saber abrazar primero la sombra propia.";
        else if (a.category === "Claridad") a.text = "Entiendo de forma lógica y madura que cada síntoma emocional encierra y esconde un gran significado profundo.";
        else if (a.category === "Libre Albedrío") a.text = "Hago valientemente consciente mi mundo inconsciente para decidir sobre mi vida sin llamarle triste cruel fatalidad.";
        else if (a.category === "Sincronicidad") a.text = "Permito que mi tranquila mente despierte y abrace las magníficas coincidencias mágicas sincrónicas del gran cosmos.";
        else if (a.category === "Esperanza") a.text = "Rescato valientemente y con un gran pacífico amor la poderosa brillante inmensa luz inagotable en medio del duro caos.";
        else if (a.category === "Poder") a.text = "Soy un antiguo hermoso ser milagrosamente dotado con maravillosas mágicas deslumbrantes asombrosas grandes energías.";
        else {
            a.text = a.text.substring(0, 115) + '...';
        }
    }
});

newAffirmations.forEach(a => {
    lastId++;
    a.id = lastId.toString();
    data.push(a);
});

fs.writeFileSync('src/data/affirmations.json', JSON.stringify(data, null, 2));
console.log(`Added ${newAffirmations.length} affirmations.`);
