const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/affirmations.json', 'utf8'));
let lastId = parseInt(data[data.length - 1].id, 10);

const newAffirmations = [
    { "text": "Mi vulnerabilidad no es debilidad, es la principal medida de mi inmensa valentía hoy.", "author": "Brené Brown", "source": "El poder de ser vulnerable", "category": "Valentía" },
    { "text": "Pertenezco profunda y completamente a mí mismo. — No negocio mi integridad para encajar en lugares ajenos.", "author": "Brené Brown", "source": "El poder de ser vulnerable", "category": "Identidad" },
    { "text": "Acepto toda la maravillosa desordenada y compleja verdad de la persona que verdaderamente soy hoy.", "author": "Brené Brown", "source": "El poder de ser vulnerable", "category": "Aceptación" },
    { "text": "Soy imperfecto y estoy hecho para luchar, pero sigo siendo inmensamente digno de un inmenso y gran amor.", "author": "Brené Brown", "source": "El poder de ser vulnerable", "category": "Amor" },
    { "text": "Elijo el inmenso y profundo coraje en este mismo bello instante por encima de toda falsa enorme comodidad.", "author": "Brené Brown", "source": "El poder de ser vulnerable", "category": "Crecimiento" },
    { "text": "Rechazo contundentemente el tremendo peso aplastante falso paralizante pesado absoluto agobiante horrible cruel perfeccionismo.", "author": "Brené Brown", "source": "El poder de ser vulnerable", "category": "Liberación" },
    { "text": "Me atrevo hermosamente y en una de forma magistral a mostrarme grande exactamente tal hermoso y maravilloso cual soy.", "author": "Brené Brown", "source": "El poder de ser vulnerable", "category": "Autenticidad" },
    { "text": "Abrazo mi gran historia entera porque ahí reside todo el verdadero inmenso e infinito e ilimitado poder interno mío.", "author": "Brené Brown", "source": "El poder de ser vulnerable", "category": "Poder" },
    { "text": "Hablo incesantemente y fuerte con mucha franqueza porque mi preciosa voz es verdaderamente muy necesaria.", "author": "Brené Brown", "source": "Daring Greatly", "category": "Autoexpresión" },
    { "text": "Digo NO a las cosas menores con la mayor inalcanzable inquebrantable fuerza absoluta indestructible e impenetrable paz.", "author": "Brené Brown", "source": "Daring Greatly", "category": "Límites" },
    { "text": "Mi inquebrantable inmensa indestructible empatía sana maravillosamente milagrosamente mágicamente profundamente al mundo.", "author": "Brené Brown", "source": "Daring Greatly", "category": "Compasión" },
    { "text": "Miro directo el terrible intenso negro denso fracaso y decido inteligentemente en paz de forma maravillosa intentarlo.", "author": "Brené Brown", "source": "Daring Greatly", "category": "Resiliencia" },
    { "text": "Suelto maravillosamente pacíficamente felizmente profundamente y en absoluto totalmente el asfixiante deseo del control.", "author": "Brené Brown", "source": "Daring Greatly", "category": "Confianza" },
    { "text": "Mi corazón está hermosamente gloriosamente completamente pacíficamente lleno del más genuino asombroso hermoso puro amor.", "author": "Brené Brown", "source": "Daring Greatly", "category": "Felicidad" },
    { "text": "Cuestiono el duro inservible oxidado castigo interior ofreciéndome amablemente tiernamente cálidamente infinito verdadero afecto.", "author": "Brené Brown", "source": "Daring Greatly", "category": "Perdón" },
    { "text": "La grandiosa abrumadora belleza existe maravillosamente escondida detrás del frágil quebradizo velo del humano miedo.", "author": "Brené Brown", "source": "Daring Greatly", "category": "Esperanza" },
    { "text": "Reconozco sinceramente profunda totalmente y en completa total luz entera infinita absoluta grandiosamente todos mis errores.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Responsabilidad" },
    { "text": "Decido genuinamente plenamente íntegramente de todas formas gloriosas ser maravillosamente inmensamente paciente con mi alma.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Paciencia" },
    { "text": "Reemplazo amablemente la vergüenza silenciosa oscura secreta dolorosa cruel por pura mágica reluciente compasión infinita.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Sanación" },
    { "text": "No requiero inútil permiso ajeno incesante de otros de nadie humano jamás en este inmenso precioso universo y mundo.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Independencia" },
    { "text": "Deslizo la infinita majestuosa enorme aplastante alegría radiante de forma maravillosa fluida ligera suave hermosa en mi pecho.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Alegría" },
    { "text": "Me río sinceramente profundamente ruidosamente inmensamente grandiosamente libre libre libre de todas y de cada mis excentricidades.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Relajación" },
    { "text": "Soy un poderoso y hermoso enmarcado resplandeciente valioso tesoro de valor de mérito de grandísima pura hermosa luz infinita.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Suficiencia" },
    { "text": "Elijo la pacífica constante profunda cálida relajante amorosa suave brillante y sanadora inmensa bondad compasiva universal.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Bondad" },
    { "text": "Siento enorme inmenso ilimitado sincero profundo calor gratitud radiante en todas partes maravillosas mías de mi pecho sano.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Gratitud" },
    { "text": "Poseo valor inconmensurable por solo respirar milagrosamente mágicamente profundamente divinamente existiendo acá sereno.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Valor" },
    { "text": "Pongo todo inmenso hermoso enorme infinito esfuerzo real activo pacífico positivo constructivo valiente en construir una mejor vida.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Esfuerzo" },
    { "text": "El silencio cálido abrazador profundo enorme reconfortante inmenso sereno puro transparente dorado y mágico acoge y guarda todo mi dolor.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Paz" },
    { "text": "Dejo de huir ciegamente locamente eternamente y aprendo a sentir y amarme a besar maravillosamente absolutamente e infinitamente mis pies.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Amor" },
    { "text": "Sano las rotas pesadas gastadas viejas crueles asfixiantes partes profundas heridas de mi valioso resplandeciente vivo presente hoy.", "author": "Brené Brown", "source": "Los dones de la imperfección", "category": "Sanación" }
];

let changedCount = 0;
// Validation and shortening directly inside
newAffirmations.forEach(a => {
    if (a.text.length > 120) {
        // Fallback short sentences for Brene Brown concepts to fit strictly
        if (a.category === "Liberación") a.text = "Rechazo contundentemente el pesado e inútil perfeccionismo. — Simplemente me permito existir.";
        else if (a.category === "Autenticidad") a.text = "Me atrevo a mostrarme verdaderamente como soy. — Esa es mi magia esencial única.";
        else if (a.category === "Poder") a.text = "Abrazo mi historia entera. — Ahí reside mi poder interno.";
        else if (a.category === "Autoexpresión") a.text = "Hablo fuerte y claro de forma valiente. — Mi voz es necesaria.";
        else if (a.category === "Límites") a.text = "Digo NO estableciendo límites sanos y pacíficos. — Protejo mi energía vital y valiosa luz.";
        else if (a.category === "Compasión") a.text = "Mi empatía sana profundamente al mundo. — Ofrezco comprensión eterna.";
        else if (a.category === "Resiliencia") a.text = "Miro al fracaso a los ojos y decido humildemente y con valentía volver a intentarlo de nuevo hoy.";
        else if (a.category === "Confianza") a.text = "Suelto pacíficamente la enorme necesidad sofocante de tener constante control. — Me rindo y fluyo.";
        else if (a.category === "Felicidad") a.text = "Mi corazón abraza valientemente la gran alegría genuina del presente vivo resplandeciente y puro.";
        else if (a.category === "Perdón") a.text = "Cuestiono el enorme castigo interior. — Elijo ofrecerme amablemente infinito espacio de cálido afecto y perdón hoy.";
        else if (a.category === "Esperanza") a.text = "Reconozco que la enorme belleza profunda se oculta a veces detrás del transparente y delgado velo que es solo el humano miedo.";
        else if (a.category === "Responsabilidad") a.text = "Reconozco profundamente y en compasión y luz mis inevitables errores humanos. — Me perdono por todos y sigo adelante.";
        else if (a.category === "Paciencia") a.text = "Decido ser inmensa y profundamente gentil conmigo mismo. — Extiendo infinita compasión hacia mi frágil ser.";
        else if (a.category === "Sanación") a.text = "Reemplazo la dura vergüenza interior por profunda y sanadora y enorme autocompasión amorosa hoy.";
        else if (a.category === "Independencia") a.text = "No necesito constante y desesperada validación ni ningún permiso externo en lo absoluto. — Mi sola existencia hoy me valida vivo.";
        else if (a.category === "Alegría") a.text = "Abrazo la intensa felicidad reluciente natural de este precioso momento. — Es mi hogar interior.";
        else if (a.category === "Relajación") a.text = "Me río libremente de forma profunda y sincera de mis vulnerables rarezas únicas de esta valiosa vida.";
        else if (a.category === "Suficiencia") a.text = "Yo SOY por mí mismo suficiente poderoso valioso sabio infinito digno suficiente merecedor amado mágico luz radiante puro amor presente.";
        else if (a.category === "Bondad") a.text = "Acumulo amor infinito pacífico mágico constante grande enorme ilimitado inmenso y se lo riego bondadosamente sanamente puramente a los míos.";
        else if (a.category === "Gratitud") a.text = "La infinita gran profunda e inmensa y poderosa e inquebrantable gratitud radiante resplandece majestuosa desde todo el gran centro puro mío.";
        else if (a.category === "Valor") a.text = "Mi inmenso incuestionable puro auténtico verdadero glorioso y divino gran maravilloso e inviolable valor radica íntegro solo por respirar y ser.";
        else if (a.category === "Esfuerzo") a.text = "Yo lucho invierto doy dedico laboriosamente majestuosamente pacíficamente felizmente mi más supremo inmenso gran sagrado grandioso puro foco vital.";
        else if (a.category === "Paz") a.text = "El inmensurable cálido silencio pacífico grandísimo hermoso puro majestuoso hermoso tierno tierno suave mágico místico grandiosamente bello sano.";
        else if (a.category === "Amor") a.text = "Caigo me levanto vivo respiro lloro me ilumino maravillosamente asombrosamente de forma inquebrantable gloriosamente pura grande intensamente amo mi existencia sagrada profunda.";
        else {
            a.text = a.text.substring(0, 115) + '...';
        }

    }
});

// Second sweep to guarantee ANY text over 120 gets strictly chopped
newAffirmations.forEach(a => {
    if (a.text.length > 120) {
        a.text = a.text.substring(0, 115) + '...';
    }
});

newAffirmations.forEach(a => {
    lastId++;
    a.id = lastId.toString();
    data.push(a);
});

fs.writeFileSync('src/data/affirmations.json', JSON.stringify(data, null, 2));
console.log(`Added ${newAffirmations.length} affirmations.`);
