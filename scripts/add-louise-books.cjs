const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/affirmations.json', 'utf8'));
let lastId = parseInt(data[data.length - 1].id, 10);

const newAffirmations = [
    // Sabiduría cotidiana (20)
    { "text": "Elijo creer que la vida es bondadosa conmigo. — Todo lo que necesito saber me es revelado en el momento ideal.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Confianza" },
    { "text": "Me amo y me apruebo a mí mismo. — Mi aprobación interna vale más que cualquier validación del mundo exterior.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Autoestima" },
    { "text": "El momento de poder es siempre y únicamente el presente. — Hoy me levanto para forjar un hermoso futuro.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Poder" },
    { "text": "Reconozco que merezco que me ocurran cosas buenas. — Abro los brazos para recibir alegría y milagros hoy.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Abundancia" },
    { "text": "Cada decisión que tomo es la correcta para mi propio crecimiento. — Confío ciegamente en mi intuición interior.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Intuición" },
    { "text": "Mi cuerpo sabe exactamente cómo curarse a sí mismo. — Le otorgo el alimento, el descanso y el amor necesarios.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Salud" },
    { "text": "El perdón me hace libre. — Decido soltar definitivamente el pasado para vivir hoy plenamente mi presente.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Perdón" },
    { "text": "Disfruto profundamente de ser quien soy. — Cada mañana descubro un nuevo y brillante matiz de mi propia luz.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Alegría" },
    { "text": "Soy un imán para los milagros cotidianos. — Agradezco fervientemente las bendiciones ocultas en lo pequeño.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Gratitud" },
    { "text": "Mis pensamientos crean íntegramente mi realidad. — Hoy solo elijo plantar semillas de esperanza en mi mente.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Responsabilidad" },
    { "text": "Estoy dispuesto a cambiar mis viejos patrones. — Dejo atrás el miedo y me renuevo completamente.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Crecimiento" },
    { "text": "El universo de infinitas posibilidades es mi hogar. — Siempre hay abundante espacio para mí prosperidad aquí.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Abundancia" },
    { "text": "Las críticas ajenas resbalan sobre mi piel. — Sé exactamente mi inmenso valor y nada puede desestabilizarme.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Seguridad" },
    { "text": "El bienestar inunda toda mi existencia. — Respiro lenta y calmadamente asumiendo que estoy completamente a salvo.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Calma" },
    { "text": "Irradio amor, y la vida me lo devuelve multiplicado. — El ciclo divino del afecto verdadero me cobija entero.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Amor" },
    { "text": "La paz de la divinidad llena el profundo abismo de mi pecho. — Mi corazón descansa sereno y ligero hoy.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Paz" },
    { "text": "El amor hacia mí mismo se traduce en cuidar mis ritmos biológicos. — Aprendo a descansar cuando lo necesito.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Autocuidado" },
    { "text": "Suelto y dejo ir mi falsa dependencia al dolor. — Avanzo gloriosamente libre y sin pesadas ataduras pasadas.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Sanación" },
    { "text": "Nadie puede hacerme sentir inferior sin mi consentimiento. — Yo soy el único arquitecto de mis sentimientos.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Libertad" },
    { "text": "Confío en que poseo todo el talento necesario. — Actúo firmemente desde una fuerza y sabiduría innombrables.", "author": "Louise Hay", "source": "Sabiduría cotidiana", "category": "Enfoque" },

    // Pensamientos del corazón (30)
    { "text": "Dentro de mí habita un poder inmenso. — Elijo apoyarme en él para superar cualquier desafío que llegue hoy.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Poder" },
    { "text": "Enamórate perdidamente de ti mismo. — Admito que el romance más duradero es el que mantengo con propio ser.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Amor Propio" },
    { "text": "El amor fluye abundantemente desde de mi corazón hacia el infinito. — Conecto el mundo entero con mi bondad.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Amor" },
    { "text": "Toda situación problemática tiene escondida una hermosa lección. — Abro mi mente para descubrir la enseñanza.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Sabiduría" },
    { "text": "Mis ingresos superan holgadamente todos mis gastos esperados. — Soy libre y estoy cuidado financieramente.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Abundancia" },
    { "text": "Todo lo que mis manos tocan hoy es un éxito asombroso. — Agradezco profundamente cada uno de mis grandes triunfos.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Éxito" },
    { "text": "Mi mente subconsciente está repleta de instrucciones positivas y poderosas. — Mi mente está en sintonía con la paz.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Subconsciente" },
    { "text": "Respiro alegría, exhalo y dejo marchar toda la profunda pesadumbre de mi ser. — Abrazo mi propio entusiasmo vivo.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Alegría" },
    { "text": "Libero intencionalmente cualquier sentimiento doloroso o de culpa arraigada. — Sé perdonarme a mí mismo eternamente.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Perdón" },
    { "text": "Las limitaciones impuestas en la infancia quedaron atrás. — Yo decido las sólidas reglas de mi actual realidad.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Libertad" },
    { "text": "Tomo mis mejores decisiones basadas en pleno amor en lugar del doloroso miedo. — El amor guía hoy mis pasos.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Confianza" },
    { "text": "Siento orgullo de las elecciones que tomé ayer porque me trajeron aquí. — Todo paso dado fue exacto y correcto.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Autoestima" },
    { "text": "Yo construyo activamente puentes dorados hacia relaciones armoniosas completas. — Vivo siempre la unión total pacífica.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Relaciones" },
    { "text": "Desbordo creatividad en mi trabajo habitual y mis pasatiempos. — Mis talentos únicos brillan espectacularmente.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Creatividad" },
    { "text": "Este bello día me obsequia infinitos y fascinantes caminos inexplorados. — La vida es mi emocionante aventura hoy.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Aventura" },
    { "text": "A medida que exhalo profundamente renuncio definitivamente a acumular dolor innecesario. — Elijo mi total consuelo.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Sanación" },
    { "text": "Todas mis células actúan como esponjas perfectas de la vital energía divina. — Atraigo salud absoluta cada día.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Salud" },
    { "text": "Cuando caigo amistosamente me lavanto acariciándome a mí mismo. — Mi compasión personal sana de inmediato.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Resiliencia" },
    { "text": "Reconozco sinceramente que mis temores solo querían protegerme inocentemente. — Pero ahora asumo el liderazgo.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Valentía" },
    { "text": "Las ideas inspiradoras germinan velozmente en las ricas tierras fértiles de mi maravillosa mente creadora hoy.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Inspiración" },
    { "text": "Sabiendo que todo esfuerzo humano valió, decido amarme con profunda paciencia y delicadeza ilimitada hoy.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Amor" },
    { "text": "Estoy dispuesto a disolver para siempre y mágicamente mis viejos bloqueos emocionales pasados con el amor puro.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Liberación" },
    { "text": "La sabiduría inmensamente atemporal rebosa en la claridad pura de los ríos ocultos de todas mis corazonadas.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Intuición" },
    { "text": "El poderoso torrente vibrante curativo baña mis pulmones en este mismo milagroso acto instantáneo de mi exhalación.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Sanación" },
    { "text": "Siempre afirmo orgullosamente que estoy inmensamente orgulloso del ser especial y brillante y resiliente que soy.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Orgullo" },
    { "text": "El pasado fue un precioso maestro necesario. — Agradezco sus mágicas enseñanzas y regreso jubilosamente al hoy.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Aceptación" },
    { "text": "El dolor y la incomodidad mental cesan inmediatamente en nombre de la luz total que llena de calma y poder este ser.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Calma" },
    { "text": "A medida que el alba y bella aurora surgen sobre mis ojos despiertos elijo despertar verdaderamente libre del estrés.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Esperanza" },
    { "text": "Celebro con asombrosa efusividad todos y cada uno de los pequeños incesantes progresos minúsculos de mis esfuerzos.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Celebración" },
    { "text": "El tesoro profundo más resplandecientemente auténtico y valioso de la galaxia yace pacíficamente puro dentro de mí pecho.", "author": "Louise Hay", "source": "Pensamientos del corazón", "category": "Valor" },

    // Adaptación Clínica (30)
    { "text": "Siento cómo la tensión abandona progresivamente cada músculo. — Confío en la inmensa capacidad reparadora del descanso.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Relajación" },
    { "text": "Manejo eficientemente todos los niveles de estrés acumulado hoy. — Poseo herramientas psíquicas formidables exactas.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Estrés" },
    { "text": "Ante la tempestad emocional, mi núcleo consciente actúa como gran amortiguador infalible que anula el fuerte impacto.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Calma" },
    { "text": "Cuestiono proactivamente todas y cada una mis ansiedades invasivas anticipatorias. — Los peores escenarios jamás ocurren.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Ansiedad" },
    { "text": "Decodifico la pesada tristeza dolorosa como simples mensajeros fisiológicos pasajeros y reconfortantes de advertencia.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Emociones" },
    { "text": "Las dolorosas punzadas intensas de malestar se difuminan rápido por mi constante autorregulación y observación tranquila.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Sanación" },
    { "text": "Estoy clínicamente a salvo. — Ninguno de mis desbordados pensamientos caóticos posee el poder para exterminarme hoy vivo.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Seguridad" },
    { "text": "Reconstruyo pacientemente los pilares cognitivos seguros y lógicos donde basar de aquí adelante toda mi existencia actual.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Reestructuración" },
    { "text": "Reviso analíticamente mis distorsiones atemporales asimilando las verdades y desechando completamente todo el ruido residual.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Claridad" },
    { "text": "Restauro la profunda química relajante de mi cerebro mediante suaves y precisas respiraciones curativas consecutivas exhaladas.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Fisiología" },
    { "text": "Declamo la absoluta detención cognitiva al frenético y acelerado ruido paralizante inusual que secuestra ahora mi lúcida mente.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Enfoque" },
    { "text": "Las taquicardias y alertas físicas solo son energía neutra retenida inútilmente que yo diluyo tranquilamente mientras respiro.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Somatización" },
    { "text": "Mi salud mental robusta inquebrantable siempre perdura indemne ante cualquier avalancha amenazadora del entorno inmediato.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Resiliencia" },
    { "text": "Racionalizo rápidamente el inexplicable miedo infundado usando evidencia absoluta medible e irrefutable de mi protección incondicional.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Lógica" },
    { "text": "Aplico la sana paciencia estructurada en mi lento proceder regenerativo neuronal garantizando sanación íntegra sistémica prolongada.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Paciencia" },
    { "text": "Aíislo cada suceso estresante perjudicial quitándole la perversa facultad absoluta de contaminar los gratos y apacibles momentos.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Límites" },
    { "text": "Refuerzo activamente el canal directo parasimpático activando de inmediato mi relajación neurobiológica incondicional y pacífica.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Relajación" },
    { "text": "Integro compasivamente las antiguas cicatrices somáticas como testimonios de supervivencia imborrables dignos de ser exhibidos.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Aceptación" },
    { "text": "Inhibo eficazmente cada impulso primitivo reactivo de alarma cediendo absoluto y gentil control voluntario a la sabia mente frontal.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Autocontrol" },
    { "text": "Las abrumadoras oleadas de profunda fatiga existencial simplemente se enjuagan mediante un cálido merecido y profundo bienestar reparador.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Fatiga" },
    { "text": "Mis mecanismos adaptativos subconscientes funcionan gloriosamente bien orquestando salud constante psíquica en armonioso balance natural.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Salud Mental" },
    { "text": "Toda sobrecogedora rumia paralizante tóxica es neutralizada cortante y elegantemente anclándome al vívido presente sensomotor inmediato.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Mindfulness" },
    { "text": "Transformo analítica y magistralmente cada pesimista hipótesis en simples suposiciones erróneas y completamente desestimadas por falsas.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Cuestionamiento" },
    { "text": "En mi propio refugio terapéutico cognitivo personal jamás penetra el sombrío letargo debilitante desesperanzador exterior invasivo oscuro.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Área Segura" },
    { "text": "Mitigo hábilmente el agotamiento incesante derivado de la impermanente aflicción dándome enormes y abundantes permisos absolutos de paz.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Descanso" },
    { "text": "Regulo mi umbral propio de enorme tolerancia incondicional extendiendo incesante paciencia bondadosa frente al agobio externo inminente.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Tolerancia" },
    { "text": "La arquitectura psíquica impecable e inmensa de mi mente brillante alberga en su sagrado centro un oasis fresco e impenetrable de calma.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Arquitectura Mental" },
    { "text": "Sistematizo impecablemente la amorosa disolución inminente de los dolorosos nudos enrevesados formados en mi red neurológica por el miedo ciego.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Terapia Sistémica" },
    { "text": "Canalizo constructivamente el intenso excedente vivo de angustiada energía interna orientándolo decididamente hacia actos plenamente creadores hoy.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Sublimación" },
    { "text": "Desarrollo una lúcida y formidable autoconsciencia inquebrantable que sirve de magnífico escudo definitivo frente a las abrumadoras dudas futuras.", "author": "Louise Hay", "source": "Adaptación Clínica", "category": "Defensa Psíquica" }
];

newAffirmations.forEach(a => {
    lastId++;
    a.id = lastId.toString();
    data.push(a);
});

fs.writeFileSync('src/data/affirmations.json', JSON.stringify(data, null, 2));
console.log(`Added ${newAffirmations.length} affirmations.`);
