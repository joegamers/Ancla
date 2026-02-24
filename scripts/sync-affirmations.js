import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const oldAffirmationsPath = path.join(__dirname, '../src/data/affirmations.json');
const rawOld = fs.readFileSync(oldAffirmationsPath, 'utf8');
const oldAffirmations = JSON.parse(rawOld);

const newAffirmations = [
    // --- ANSIEDAD ---
    { id: '1', text: 'Tus pensamientos no son hechos, son solo eventos mentales — Reconozco que mi ansiedad me miente; elijo observar mis pensamientos sin darles el control de mi realidad.', author: 'Aaron Beck', source: 'Cognitive Therapy', category: 'Ansiedad' },
    { id: '56', text: 'No te afanes por el mañana, porque el mañana traerá su propio afán. — Mi mente está en paz con el presente; hoy decido enfocarme solo en el paso que tengo frente a mí.', author: 'Mateo 6:34', source: 'Biblia', category: 'Ansiedad' },
    { id: '62', text: 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros. — Hoy suelto lo que no puedo controlar y descanso sabiendo que estoy sostenido.', author: '1 Pedro 5:7', source: 'Biblia', category: 'Ansiedad' },
    { id: '82', text: 'Mis emociones son señales, no sentencias. — Me permito sentir mi ansiedad sin juzgarla, sabiendo que solo es energía que pronto pasará a través de mí.', author: 'Albert Ellis', source: 'Terapia Racional Emotiva', category: 'Ansiedad' },
    { id: '97', text: 'Mi ansiedad es una alarma falsa. — Entiendo que mi cuerpo intenta protegerme, pero le agradezco y le indico que estoy a salvo en este momento.', author: 'David Carbonell', source: 'The Worry Trick', category: 'Ansiedad' },
    { id: '101', text: 'Suelto la necesidad de saber exactamente qué pasará en el futuro. Me abro a la sorpresa y a la calma del ahora.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },
    { id: '102', text: 'Mi respiración es mi ancla. Cada vez que inhalo, inhalo paz; cada vez que exhalo, libero la tensión de mis hombros.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },
    { id: '103', text: 'No tengo que solucionar todos mis problemas hoy. Me doy permiso de descansar la mente hasta mañana.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },
    { id: '104', text: 'Este sentimiento de urgencia no es real. Tengo tiempo, tengo espacio, y estoy protegido.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },
    { id: '105', text: 'Elijo reemplazar la palabra "Y si..." por "Incluso si pasa, podré con ello". Confío en mi resiliencia.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },
    { id: '106', text: 'Todo pasa. También esto pasará. Observo mi ansiedad como una nube en el cielo de mi mente, dejándola ir con el viento.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },
    { id: '107', text: 'No soy mis pensamientos acelerados. Soy la calma profunda que existe detrás de ellos, esperando a ser escuchada.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },
    { id: '108', text: 'Pongo mi mano en el corazón y siento sus latidos. Estoy aquí, estoy vivo, y en este minuto exacto, nada malo está sucediendo.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },
    { id: '109', text: 'Acepto la incertidumbre. No necesito controlar el océano; solo necesito aprender a surfear mis propias olas con calma.', author: 'Ancla', source: 'Afirmación Original', category: 'Ansiedad' },

    // --- ESTRÉS ---
    { id: '2', text: 'La única salida es a través — Tengo el coraje de enfrentar esta situación; confío plenamente en mi capacidad para superarla paso a paso.', author: 'Robert Frost', source: 'Poesía', category: 'Estrés' },
    { id: '58', text: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. — Hoy elijo soltar mi carga de estrés, permitiéndome un genuino descanso.', author: 'Mateo 11:28', source: 'Biblia', category: 'Estrés' },
    { id: '84', text: 'Puedo tolerar la incomodidad. — Me recuerdo a mí mismo que esta situación es incómoda y cansada, pero no es insoportable; yo soy más grande que el estrés.', author: 'Albert Ellis', source: 'TRE', category: 'Estrés' },
    { id: '110', text: 'Suelto lo que no puedo controlar. Mi energía es valiosa y decido invertirla solo en aquello donde puedo hacer una diferencia hoy.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },
    { id: '111', text: 'Tengo derecho a decir "no" sin sentir culpa. Mi tiempo y mi energía me pertenecen a mí en primer lugar.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },
    { id: '112', text: 'Inhalo calma, exhalo presión. Todo lo que debo hacer se irá resolviendo a su debido ritmo perfecto.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },
    { id: '113', text: 'Me doy permiso de hacer pausas. El descanso no es un premio por trabajar en exceso, es un requisito biológico que honraré hoy.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },
    { id: '114', text: 'Ninguna tarea, por urgente que parezca, es más importante que mi salud mental y mi equilibrio interior.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },
    { id: '115', text: 'Desacelero mi ritmo a propósito. Camino con calma, hablo con calma, respiro con calma.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },
    { id: '116', text: 'Puedo manejar grandes presiones manteniendo mi centro. Yo soy una roca en medio del río.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },
    { id: '117', text: 'Al final del día, lo hice lo mejor que pude con los recursos que tenía. Y eso es completamente suficiente.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },
    { id: '118', text: 'El perfeccionismo es sólo miedo. Hoy elijo la paz por encima de ser perfecto en todo.', author: 'Ancla', source: 'Afirmación Original', category: 'Estrés' },

    // --- MOTIVACIÓN ---
    { id: '3', text: 'Eres más fuerte de lo que crees. — Activo mi fuerza interior inagotable; reconozco que soy capaz de transformar cualquier obstáculo en un peldaño hacia mi éxito.', author: 'Marco Aurelio', source: 'Meditaciones', category: 'Motivación' },
    { id: '57', text: 'Todo lo puedo en Cristo que me fortalece. — Siento cómo una energía superior a mí inunda cada célula, dándome la fortaleza absoluta para continuar hoy con éxito.', author: 'Filipenses 4:13', source: 'Biblia', category: 'Motivación' },
    { id: '70', text: 'Los que esperan a Jehová tendrán nuevas fuerzas. — Siento cómo mi agotamiento desaparece; hoy renuevo mis alas y mi vitalidad se restaura al 100%.', author: 'Isaías 40:31', source: 'Biblia', category: 'Motivación' },
    { id: '81', text: 'El que al viento observa, no sembrará. — Dejo de esperar el momento perfecto; hoy arranco motores y actúo a pesar de no ver todo el panorama completo.', author: 'Eclesiastés 11:4', source: 'Biblia', category: 'Motivación' },
    { id: '119', text: 'Tengo todo lo que necesito dentro de mí para crear la vida que sueño. Cada paso cuenta.', author: 'Ancla', source: 'Afirmación Original', category: 'Motivación' },
    { id: '120', text: 'Yo soy el arquitecto de mi propio éxito y felicidad. Hoy diseño un día maravillosamente productivo.', author: 'Ancla', source: 'Afirmación Original', category: 'Motivación' },
    { id: '121', text: 'Mi potencial es ilimitado. Las dudas solo están en mi mente, pero mi capacidad reside en mi acción constante.', author: 'Ancla', source: 'Afirmación Original', category: 'Motivación' },
    { id: '122', text: 'Elijo levantarme después de cada caída con más sabiduría. Mis fracasos son mi mejor entrenamiento.', author: 'Ancla', source: 'Afirmación Original', category: 'Motivación' },
    { id: '123', text: 'Hoy me comprometo con el proceso más que con el resultado. Disfruto el pequeño avance de hoy.', author: 'Ancla', source: 'Afirmación Original', category: 'Motivación' },
    { id: '124', text: 'La resistencia que siento es la confirmación perfecta de que estoy a punto de avanzar al siguiente nivel.', author: 'Ancla', source: 'Afirmación Original', category: 'Motivación' },
    { id: '125', text: 'Me niego a conformarme con menos de lo que merezco. Hoy exijo grandeza en mí y en todo lo que hago.', author: 'Ancla', source: 'Afirmación Original', category: 'Motivación' },

    // --- ENFOQUE ---
    { id: '4', text: 'No busques que los eventos sucedan como quieres. — Yo renuncio a forzar las cosas; en su lugar, afino mi mente aguda para fluir y adaptarme perfectamente a cualquier situación.', author: 'Epicteto', source: 'Enquiridión', category: 'Enfoque' },
    { id: '75', text: 'Puestos los ojos en Jesús. — Mi enfoque decide mi destino. Corto toda distracción; mantengo mis ojos clavados en mis objetivos más altos de hoy con láser y disciplina.', author: 'Hebreos 12:2', source: 'Biblia', category: 'Enfoque' },
    { id: '126', text: 'Mi mente es cristalina, aguda y enfocada. Nada exterior tiene permiso para desviar mi atención hoy.', author: 'Ancla', source: 'Afirmación Original', category: 'Enfoque' },
    { id: '127', text: 'Priorizo implacablemente. Me enfoco solo en el 20% de tareas que traerán el 80% de mis resultados.', author: 'Ancla', source: 'Afirmación Original', category: 'Enfoque' },
    { id: '128', text: 'Mi concentración es como un rayo láser curativo. Todo en lo que me enfoco hoy se nutre, crece y se perfecciona.', author: 'Ancla', source: 'Afirmación Original', category: 'Enfoque' },
    { id: '129', text: 'Tengo control total sobre dónde dirijo mi atención. Los ruidos externos no tienen poder frente a mi claridad interna.', author: 'Ancla', source: 'Afirmación Original', category: 'Enfoque' },
    { id: '130', text: 'Realizo una tarea a la vez con total devoción y presencia. Dejo ir la trampa del multitasking.', author: 'Ancla', source: 'Afirmación Original', category: 'Enfoque' },

    // --- CALMA ---
    { id: '5', text: 'Acepta lo que no puedes cambiar y cambia lo que no puedes aceptar. — Tengo la sabiduría absoluta para diferenciar entre ambas cosas; fluyo como el agua con lo que está fuera de mi control.', author: 'Reinhold Niebuhr', source: 'Oración', category: 'Calma' },
    { id: '89', text: 'Lo que resistes, persiste. — Hoy observo el mundo fluir sin juzgar o luchar. Elijo la profunda liberación de aceptar mi realidad en este momento sin intentar moldearla agresivamente a la fuerza.', author: 'Carl Jung', source: 'Filosofía Analítica', category: 'Calma' },
    { id: '95', text: 'Cada respiración es una oportunidad de empezar de nuevo. — Me permito perdonarme lo que sucedió hace un segundo, limpio el lienzo, y reinicio mi ciclo de profunda paz vital desde este respiro consciente y profundo.', author: 'Thich Nhat Hanh', source: 'Mindfulness', category: 'Calma' },
    { id: '131', text: 'Mi calma interior es inviolable. Todo el ruido del mundo exterior se detiene en las puertas de mi mente.', author: 'Ancla', source: 'Afirmación Original', category: 'Calma' },
    { id: '132', text: 'Exhalo lentamente, soltando cada expectativa. Encuentro satisfacción y quietud exactamente donde me encuentro ahora mismo.', author: 'Ancla', source: 'Afirmación Original', category: 'Calma' },
    { id: '133', text: 'No necesito reaccionar a nada. Entre cualquier eventualidad y mi reacción, creo una pausa infinita llena de serenidad profunda.', author: 'Ancla', source: 'Afirmación Original', category: 'Calma' },
    { id: '134', text: 'Estoy arraigado a la tierra. No importa qué tan feroz sople el viento allá afuera, yo permanezco estable, firme y en paz absoluta.', author: 'Ancla', source: 'Afirmación Original', category: 'Calma' },
    { id: '135', text: 'El silencio no me incomoda; es el hogar de mi mente. Hoy decido abrazar la ausencia de ruido con gratitud.', author: 'Ancla', source: 'Afirmación Original', category: 'Calma' },

    // --- CRECIMIENTO ---
    { id: '6', text: 'Estoy dispuesto a cambiar y a crecer. — Abro los brazos enteramente a mi transformación; reconozco fascinado que la expansión de mi ser está perfectamente bien cuidada dentro de mi propia consciencia.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Crecimiento' },
    { id: '25', text: 'Todo está bien cuando cometo una equivocación. — Considero la posibilidad liberadora de equivocarme; los errores no son más que datos invaluables para perfeccionar mi incesante progreso.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Crecimiento' },
    { id: '78', text: 'He aquí, yo hago nuevas todas las cosas. — Siento la continua regeneración; cada amanecer decodifica un nuevo inicio ilimitado para hacer las cosas mejor que en el ayer.', author: 'Apocalipsis 21:5', source: 'Biblia', category: 'Crecimiento' },
    { id: '98', text: 'El fracaso no es una identidad, es un evento. — Hoy decido retirar la pesada etiqueta del fracaso, reciclándolo ágilmente en retroalimentación objetiva que cataliza el crecimiento rotundo de mis habilidades.', author: 'Carol Dweck', source: 'Mindset', category: 'Crecimiento' },
    { id: '136', text: 'Veo la resiliencia fluir abundantemente; el camino difícil ha sido magistralmente tallado para esculpir mi maestría suprema en desarrollo constante.', author: 'Ancla', source: 'Afirmación Original', category: 'Crecimiento' },
    { id: '137', text: 'Honro profundamente a la versión de mí que libró batallas pasadas, pues su esfuerzo construyó con amor a este ser próspero e imparable que soy hoy.', author: 'Ancla', source: 'Afirmación Original', category: 'Crecimiento' },
    { id: '138', text: 'Mis raíces persisten creciendo día con día en lo frondoso de lo profundo; aunque la flor aún no se abra, mantengo paciencia en que cada proceso forjará virtudes eternas.', author: 'Ancla', source: 'Afirmación Original', category: 'Crecimiento' },
    { id: '139', text: 'Me fascina absorber nuevos aprendizajes. Conservo la humilde curiosidad infantil que cataliza de mi entorno constantes revelaciones para agigantar mi conocimiento vital.', author: 'Ancla', source: 'Afirmación Original', category: 'Crecimiento' },

    // --- SEGURIDAD Y AMOR PROPIO ---
    { id: '7', text: 'Me siento seguro y a salvo. — Hoy ordeno voluntariamente retirar toda la rigidez guardada; libero la zozobra imaginaria y declaro la paz total decretando estar fuera de peligro en mi universo protector.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Seguridad' },
    { id: '33', text: 'Me amo y me apruebo tal como soy. — Rechazo esperar con ansia cumplir un ideal ficticio; aprecio con inmensa devoción las complejas características exclusivas de mi propio ser hoy.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Amor Propio' },
    { id: '60', text: 'No temas, porque yo estoy contigo. — Experimento una muralla espiritual rodeándome que blinda con fuerza, silenciando completamente la estática incesante del ruido caótico exterior.', author: 'Isaías 41:10', source: 'Biblia', category: 'Seguridad' },
    { id: '72', text: 'Ama a tu prójimo como a ti mismo. — Me autorizo irrevocablemente darme exactamente la misma prioridad inmensa y comprensión delicada que heroicamente y con desvelo entrego a los que quiero.', author: 'Marcos 12:31', source: 'Biblia', category: 'Amor Propio' },
    { id: '90', text: 'Soy suficiente tal como soy en este momento. — Desmonto mis corazas asumiendo y manifestando purísima suficiencia vital divina que resplandece constante e incansablemente en mi ser.', author: 'Brené Brown', source: 'Dones de la Imperfección', category: 'Amor Propio' },
    { id: '140', text: 'Extiendo infinitas banderas de la más alta compasión, especialmente para mis días frágiles; abrazo mis debilidades tratándome siempre con dulce humanidad indulgente.', author: 'Ancla', source: 'Afirmación Original', category: 'Amor Propio' },
    { id: '141', text: 'Desgasto irrevocablemente cada tóxica etiqueta ajena asfixiante auto-colocándome inquebrantables afirmaciones de incalculable e indiscutida valía estelar.', author: 'Ancla', source: 'Afirmación Original', category: 'Amor Propio' },
    { id: '142', text: 'Confíole serenamente a mis entrañas el asilo profundo seguro que inyecta cada inhalación, devolviéndome oxigenados alivios restaurativos inmaculadamente purificantes.', author: 'Ancla', source: 'Afirmación Original', category: 'Seguridad' },
    { id: '143', text: 'El vasto infinito espacio astral majestuosamente se inclina magnético confabulando tramas orquestadas para amparar mis anhelos de éxito invulnerable y absoluta plenitud.', author: 'Ancla', source: 'Afirmación Original', category: 'Amor Propio' },

    // --- REVELACION Y PRESENCIA ---
    { id: '8', text: 'Todo lo que necesito saber se me revela. — Mantengo atentas mis antenas místicas limpiando el cristal borroso temporal desvaneciendo dudas angustiosas sabiendo infaliblemente ser guiado.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Revelación' },
    { id: '10', text: 'El pasado ha terminado. — Clavo estacas atrincherándome anclado glorioso en el único fragmento vital de inmaculado tiempo divino transpirado que titila incandescente: Este presente eterno.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Presencia' },
    { id: '93', text: 'El momento presente es el único que existe. — Aniquilo proyecciones torturosas del espejismo de ayer o mañana, disolviendo tiempos paralelos para fundirme en pura paz aquí.', author: 'Eckhart Tolle', source: 'El poder del ahora', category: 'Presencia' },
    { id: '144', text: 'Percibo un estruendo sosegado enigmático silencioso inyectando sabidurías insospechadas, dándole rienda a formidables intuiciones inmensas desatadas que resuelven incógnitas vitales espontáneamente.', author: 'Ancla', source: 'Afirmación Original', category: 'Revelación' },
    { id: '145', text: 'Desengancho estrepitosamente monumentales cadenas nostálgicas densas arrastradas inútilmente, exhiméndome indultado liberadamente al flotar en puro estar vivo palpitante respirado.', author: 'Ancla', source: 'Afirmación Original', category: 'Presencia' },

    // --- PERDON Y SANACION ---
    { id: '23', text: 'Estoy dispuesto a curarme. — Consiento la cicatrización profunda bañado con ungüento colosal del olvido sano redentor y la inyección cálida milagrosa de purísima inmunológica restitución sanada.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Sanación' },
    { id: '24', text: 'Estoy dispuesto a perdonar. — Destruyo rejas asfixiantes desmantelando prisiones lúgubres rancios inmensos rencores; disuelvo ataduras concediendo el indulto sublime heroico al otro para regalarme inmensa paz total en plácida libertad celestial.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Perdón' },
    { id: '76', text: 'Tengo el poder de ser instrumento de sanación. — Declaro fluida catarata vigorosa celestial derramándose milagrosa en conductos regenerando células cansadas para que se renueven en salud robusta.', author: 'Mateo 10:8', source: 'Biblia', category: 'Sanación' },
    { id: '77', text: 'Perdona setenta veces siete. — Entiendo místico que absueltos colosos indultos repetidamente me erigen majestuoso altísimo intocable por viles espinas evaporadas totalmente en purísima paz.', author: 'Mateo 18:22', source: 'Biblia', category: 'Perdón' },
    { id: '146', text: 'Mis heridas, transmutadas heroicamente están cubiertas con lajes doradas sagradas exhibiendo majestuosamente una indestructible heroica fortaleza desbordante incandescente y radiante vital en curación.', author: 'Ancla', source: 'Afirmación Original', category: 'Sanación' },

    // --- ABUNDANCIA Y GRATITUD ---
    { id: '35', text: 'Estoy abierto a recibir toda la abundancia del universo. — Exijo colosales bendiciones desmesuradas inmensas lluvias en avalancha espectacular descendida majestuosa hacia mi alma inmensurablemente opulenta.', author: 'Louise Hay', source: 'Afirmaciones', category: 'Abundancia' },
    { id: '63', text: 'El Señor es mi pastor, nada me faltará. — Repudio la farsa lúgubre escasez ficticia abrazando exuberantes lianas providenciales entrelazadas surfeadas inmaculadas en caudal inagotable radiante asegurado perpetuo.', author: 'Salmos 23:1', source: 'Biblia', category: 'Abundancia' },
    { id: '74', text: 'Dad gracias en todo. — Mapeo minuciosa todo humilde respiro bendecido transformando instantes majestuosos rotundamente en un oro multiplicador cósmico inmenso agradecido para mi alma magnética.', author: '1 Tesalonicenses 5:18', source: 'Biblia', category: 'Gratitud' },
    { id: '147', text: 'Reconozco que el vastísimo oceáno radiante de abundante vida inagotable divina jamás merma, brindando torrentes exuberantes asegurándole plenitud magnética innegable celestial a mi propio sendero.', author: 'Ancla', source: 'Afirmación Original', category: 'Abundancia' },
    { id: '148', text: 'Cada gigantesca bendición diaria destraba bóvedas colosales ocultas lloviendo cascadas de magníficas dichosas glorificadas oportunidades radiantes inmensuradas abrumadoramente espléndidas e infinitas puras maravillas.', author: 'Ancla', source: 'Afirmación Original', category: 'Gratitud' },

    // --- PAZ Y RELAJACIÓN ---
    { id: '61', text: 'La paz os dejo, mi paz os doy. — Absorbo magnéticamente la monumental infinita serenidad suprema; decreto el aplacamiento unificado y majestuoso colosal acallando inmensa bulliciosa mundanidad.', author: 'Juan 14:27', source: 'Biblia', category: 'Paz' },
    { id: '71', text: 'El gozo del Señor es mi fortaleza. — Mi dicha espiritual se convierte majestuosamente en armadura inquebrantable escudara contra grises letargos aplastantes, refulgiendo rotunda en plácida eternidad inmensa radiante sonora.', author: 'Nehemías 8:10', source: 'Biblia', category: 'Alegría' },
    { id: '149', text: 'Inundo compasivamente de paz inmensa y divina a cada espacio turbulento oscuro temeroso celular de mi organismo, llenándome con dulce alivio curativo reparador inaudito.', author: 'Ancla', source: 'Afirmación Original', category: 'Paz' },
    { id: '150', text: 'Tengo autorización sagrada magna infalible para soltar todas las corazas asfixiantes que protegían místicas corazas; abrazo rendirme dócilmente sedado a un merecido vasto relajo incondicional reparatorio.', author: 'Ancla', source: 'Afirmación Original', category: 'Relajación' }
];

let finalItems = [];

for (let item of newAffirmations) {
    finalItems.push(item);
}


fs.writeFileSync(path.join(__dirname, '../src/data/affirmations.json'), JSON.stringify(finalItems, null, 2));

const workerContent = `// Auto-generated by sync-affirmations.js
export interface Affirmation {
    id: string;
    text: string;
    author: string;
    category: string;
}

const moodMapping: Record<string, string[]> = {
    Calma: ['Ansiedad', 'Estrés', 'Paz', 'Relajación', 'Calma', 'Serenidad', 'Entrega'],
    Fuerza: ['Motivación', 'Poder', 'Éxito', 'Protección', 'Libertad'],
    Amor: ['Amor', 'Relaciones', 'Familia', 'Perdón', 'Comunidad'],
    Crecimiento: ['Crecimiento', 'Insight', 'Intuición', 'Creatividad'],
    Bienestar: ['Salud', 'Autocuidado', 'Sanación', 'Bienestar'],
    Abundancia: ['Abundancia', 'Gratitud', 'Alegría', 'Dicha'],
    Confianza: ['Confianza', 'Seguridad', 'Amor Propio', 'Valor', 'Apoyo', 'Liberación'],
    Claridad: ['Enfoque', 'Mentalidad', 'Conciencia', 'Presencia', 'Revelación'],
};

const affirmations: Affirmation[] = ${JSON.stringify(finalItems.map((i) => ({ id: i.id, text: i.text, author: i.author, category: i.category })), null, 4)};

export function getAffirmationsByMood(mood: string): Affirmation[] {
    if (mood === 'Todas') return affirmations;
    const subCategories = moodMapping[mood] || [];
    if (subCategories.length === 0) {
        return affirmations.filter(a => a.category.toLowerCase() === mood.toLowerCase());
    }
    return affirmations.filter(a =>
        subCategories.some(sub => sub.toLowerCase() === a.category.toLowerCase())
    );
}

export function getRandomAffirmation(mood: string): Affirmation {
    const list = getAffirmationsByMood(mood);
    if (list.length === 0) return affirmations[0];
    return list[Math.floor(Math.random() * list.length)];
}
`;

fs.writeFileSync(path.join(__dirname, '../ancla-push-worker/src/affirmations.ts'), workerContent);
console.log('Script completed. Generated ' + finalItems.length + ' affirmations in 1st person.');
