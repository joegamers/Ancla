const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/affirmations.json', 'utf8'));

// Replacement map for affirmations > 100 chars
const replacements = {
    "1": "Tus pensamientos no son hechos — Reconozco que mi ansiedad me miente; elijo observar sin controlarme.",
    "2": "No te afanes por el mañana — Mi mente está en paz con el presente; me enfoco solo en el siguiente paso.",
    "3": "Echando toda ansiedad sobre él — Hoy suelto lo que no controlo y descanso sabiendo que estoy sostenido.",
    "4": "Mis emociones son señales, no sentencias. — Me permito sentir mi ansiedad sabiendo que pronto pasará.",
    "5": "Mi ansiedad es una alarma falsa. — Agradezco a mi cuerpo por protegerme, pero estoy a salvo ahora.",
    "6": "La única salida es a través — Tengo el coraje de enfrentar esto; confío en mi capacidad para superarlo.",
    "7": "Venid a mí los cargados y os haré descansar. — Hoy suelto mi carga de estrés y me permito un descanso.",
    "8": "Puedo tolerar la incomodidad. — Esta situación es incómoda, pero no insoportable; yo soy más grande.",
    "9": "Eres más fuerte de lo que crees. — Activo mi fuerza interior; soy capaz de transformar este obstáculo.",
    "10": "Todo lo puedo en Cristo que me fortalece. — Siento cómo su energía me da la fortaleza para continuar.",
    "11": "Los que esperan a Jehová tendrán nuevas fuerzas. — Mi agotamiento desaparece; mi vitalidad se restaura.",
    "12": "El que al viento observa, no sembrará. — Dejo de esperar el momento perfecto; arranco motores y actúo.",
    "13": "No busques que los eventos sucedan como quieres. — Renuncio a forzar las cosas; fluyo y me adapto.",
    "14": "Puestos los ojos en Jesús. — Corto toda distracción; mantengo mis ojos en mis objetivos con disciplina.",
    "15": "Fluyo como el agua con lo que está fuera de mi control y tengo la sabiduría para adaptarme.",
    "16": "Lo que resistes, persiste. — Observo el mundo fluir sin juzgar. Elijo aceptar mi realidad en paz.",
    "17": "Cada respiración es una oportunidad de empezar de nuevo. — Me perdono y reinicio mi ciclo de paz aquí.",
    "18": "Estoy dispuesto a cambiar y crecer. — Mi expansión está perfectamente cuidada dentro de mi consciencia.",
    "19": "Todo está bien al equivocarme. — Los errores son simples datos invaluables para perfeccionar mi progreso.",
    "20": "He aquí, yo hago nuevas todas las cosas. — Cada amanecer es un inicio ilimitado para hacer las cosas mejor.",
    "21": "El fracaso es un evento, no una identidad. — Lo reciclo ágilmente en retroalimentación para crecer.",
    "22": "Me siento seguro y a salvo. — Libero la zozobra y declaro la paz total, estoy fuera de peligro hoy.",
    "23": "Me amo y me apruebo tal como soy. — Aprecio con devoción las características exclusivas de mi propio ser.",
    "24": "No temas, porque yo estoy contigo. — Una muralla espiritual rodea mi ser y silencia el ruido exterior.",
    "25": "Ama a tu prójimo como a ti mismo. — Me doy a mí la misma prioridad y comprensión que entrego a otros.",
    "26": "Soy suficiente tal como soy ahora. — Asumo y manifiesto la suficiencia vital que resplandece en mi ser.",
    "27": "Todo lo que necesito saber se me revela. — Mantengo atentas mis antenas, sabiendo que soy guiado.",
    "28": "El pasado ha terminado. — Me anclo con firmeza en el único momento que realmente existe: este presente.",
    "29": "El momento presente es el único que existe. — Disuelvo proyecciones torturosas y me fundo en pura paz.",
    "30": "Estoy dispuesto a curarme. — Permito que mi mente sane, soltando el dolor y abrazando la recuperación.",
    "31": "Estoy dispuesto a perdonar. — Libero los rencores del pasado para regalarme paz interior y libertad.",
    "32": "Tengo el poder de ser instrumento de sanación. — Declaro una catarata celestial renovando mis células.",
    "33": "Perdona setenta veces siete. — Comprendo que perdonar constantemente me protege y me permite vivir en paz.",
    "34": "Doy bienvenida a la abundancia. — Acepto con gratitud las oportunidades que la vida me ofrece cada día.",
    "35": "El Señor es mi pastor. — Dejo atrás el miedo a la escasez y confío en que mis necesidades serán provistas.",
    "36": "Dad gracias en todo. — Valoro cada instante y encuentro motivos para agradecer, multiplicando lo bueno.",
    "37": "La paz os dejo. — Recibo esta serenidad, permitiendo que calme mi mente y silencie el ruido del mundo.",
    "38": "El gozo del Señor es mi fortaleza. — Mi alegría espiritual me protege del desánimo y me llena de energía.",
    "39": "«Yo soy la luna en el agua». — Los eventos externos son pasajeros; mantengo mi centro en calma total.",
    "40": "Asumo el control de mi mente estableciendo nuevos hábitos positivos y liberándome de miedos del pasado.",
    "41": "El miedo es mi radar. — No huyo de él, lo utilizo como brújula para enfrentar mis retos con valentía.",
    "42": "Suelto la nostalgia y la preocupación, decidiendo habitar plenamente y en paz este presente seguro.",
    "43": "No eres la gota en el océano, eres el océano entero. — Reconozco mi valor y grandeza infinitos hoy.",
    "44": "Mi respiración es el puente vital que me conecta de inmediato con la vida y la conciencia en este momento.",
    "45": "Para que las cosas se revelen, elijo de inmediato abandonar mis puntos de vista limitantes y tradicionales.",
    "47": "Bebo mi té despacio y con reverencia, asumiendo que este acto es el eje sobre el que gira m pacífico mundo.",
    "51": "Cualquier cosa que este momento contenga, la acepto plenamente como si yo mismo la hubiera elegido.",
    "54": "Mis pensamientos no son hechos absolutos, son eventos pasajeros que decido no permitir que me controlen.",
    "55": "No soy perturbado por lo que sucede, sino por mi visión de lo que sucede. Elijo la perspectiva de la calma.",
    "59": "Entre lo que pasa y mi reacción, existe un espacio consciente. En ese espacio reside mi poder para calmarme.",
    "60": "Incluso cuando no puedo cambiar una situación, siempre mantengo y defiendo mi libertad de elegir mi actitud.",
    "61": "Encuentro significado incluso en mi sufrimiento natural, sabiendo y confiando que me forja alguien mejor.",
    "65": "La curiosa paradoja es que cuando logro finalmente aceptarme a mí mismo, es justo cuando empiezo a cambiar.",
    "66": "Me permito fluir suavemente como un proceso vital, dejando ir la falsa necesidad de ser algo terminado.",
    "68": "Tengo poder sobre mi mente, no sobre los eventos de afuera. Al darme cuenta, mi fuerza se hace irrompible.",
    "76": "Hablar y exteriorizar inteligentemente mis miedos profundos inmediatamente les quita el poder sobre mí.",
    "77": "Me trato hoy mismo con la misma amabilidad, cuidado infinito y paciencia que le daría a un buen amigo.",
    "78": "Reconozco que el dolor es parte de la experiencia humana general, no soy el único que se siente compungido.",
    "80": "Digo firmemente \"sí\" a lo que está sucediendo en mi interior en este momento, rindiéndome con amabilidad.",
    "81": "Hago una pausa intencional. Respiro profundamente. Reconozco la emoción y simplemente le permito estar ahí.",
    "85": "Acepto plenamente quien soy ahora y, al hacerlo, me doy cuenta y confirmo que tengo al universo dentro.",
    "86": "La naturaleza nunca jamás se apresura, y sin embargo todo lo logra. Respiro conectándome con ese ritmo.",
    "88": "El sueño profundo es un puente seguro entre este día terminado y mi bendito mañana. Lo cruzo con confianza.",
    "89": "Mi mente consciente ha hecho más que suficiente por hoy; ordeno a mi subconsciente descansar por completo.",
    "90": "Libero completamente todas las exigentes expectativas del mañana y me sumerjo en la sanación del sueño.",
    "93": "Miro directo la oscuridad con profunda comodidad. En este reconfortante silencio todo mi ser se regenera.",
    "94": "Mantengo mi atención fijada en el siguiente paso obvio. No necesito ver la escalera completa para subir.",
    "95": "No pierdo mi energía vital en cosas fuera de mi control; concentro todo mi poder solo en lo que sí puedo.",
    "96": "Mis hábitos de hoy, por pequeños e imperceptibles que sean, esculpen mi identidad. Elijo seguir esforzándome.",
    "97": "Las distracciones modernas retroceden; mi sólida capacidad cognitiva y mi enfoque permanecen fuertes.",
    "98": "Donde ubico firmemente mi atención empieza a fluir mi energía. Me enfoco estrictamente en mi progreso.",
    "99": "Acepto el hermoso estado de flujo mental. Mi energía viva se alza para encontrar el ritmo de este instante.",
    "105": "Estoy dispuesto verdaderamente a soltar mis miedos. Solo son formas de pensamiento que puedo intercambiar.",
    "106": "Todo esto está en perfecto orden en mi propio mundo. Estoy a salvo y provisto de mis verdaderas necesidades.",
    "109": "Cuento innegablemente en mi mismo interior con cada herramienta necesaria y vital para superar este obstáculo.",
    "112": "Perdono fácil y sabiamente. Soltar el tóxico e inútil resentimiento asegura completamente mi paz espiritual.",
    "113": "Dondequiera que yo me dirija inevitablemente encuentro amor porque eso es todo lo que llevo dentro de mí.",
    "114": "Dejo voluntariamente que mi paz interior guíe mi día. Mi respiración es honda y todo mi cuerpo descansa.",
    "115": "Me obsequio valiosamente a mí mismo el regalo del silencia, comprendiendo que allí residen las respuestas.",
    "118": "Dejo ir de mis creencias para siempre las nocivas competencias; todos tenemos un lugar suficiente aquí.",
    "119": "Cierro mis pesados ojos confirmando que mi trabajo hoy está completo y que he ganado el merecido descanso.",
    "120": "En este momento suave y nocturno me perdono completamente los errores de hoy y me hundo en profundo sueño.",
    "121": "Dejo que mis múltiples inquietudes se desintegren en el aire oscuro. Mi mente en calma se dedica a sanar.",
    "122": "No me afano por el misterioso mañana; decido intencionalmente enfocarme solo en el paso que veo hoy.",
    "124": "La paz suprema de Dios que evidentemente sobrepasa todo este entendimiento, guarda celosamente mi corazón.",
    "127": "Todo lo puedo y logro en Aquel que me fortalece. Mi fuerza vital proviene enteramente de una fuente divina.",
    "131": "Enfoco mi intención primordial en buscar incansablemente primero la paz y entiendo que el resto se añade.",
    "139": "Sé profundamente que todos los planes divinos dirigidos a mí son de intenso bienestar y gran esperanza."
};

let changedCount = 0;

data.forEach(item => {
    if (item.text.length > 100 && replacements[item.id]) {
        item.text = replacements[item.id];
        changedCount++;
    } else if (item.text.length > 100) {
        console.log(`Missing replacement for ID ${item.id} (length ${item.text.length}): ${item.text}`);
    }
});

fs.writeFileSync('src/data/affirmations.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Replaced ${changedCount} affirmations`);
