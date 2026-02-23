// Affirmation data — synced from Ancla's affirmations.json
export interface Affirmation {
    id: string;
    text: string;
    author: string;
    category: string;
}

// Mood → category mapping (same as AffirmationEngine)
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

const affirmations: Affirmation[] = [
    { id: "1", text: "Tus pensamientos no son hechos, son solo eventos mentales.", author: "Aaron Beck", category: "Ansiedad" },
    { id: "2", text: "La única salida es a través.", author: "Robert Frost", category: "Estrés" },
    { id: "3", text: "Eres más fuerte de lo que crees, y más capaz de lo que imaginas.", author: "Marcus Aurelius", category: "Motivación" },
    { id: "4", text: "No busques que los eventos sucedan como tú quieres, sino desea que sucedan como suceden.", author: "Epictetus", category: "Enfoque" },
    { id: "5", text: "Acepta lo que no puedes cambiar y cambia lo que no puedes aceptar.", author: "Reinhold Niebuhr", category: "Calma" },
    { id: "6", text: "Estoy dispuesta a cambiar y a crecer. Todo está bien en mi mundo.", author: "Louise Hay", category: "Crecimiento" },
    { id: "7", text: "Me siento seguro y a salvo.", author: "Louise Hay", category: "Seguridad" },
    { id: "8", text: "Todo lo que necesito saber se me revela. Ahora libero tranquilamente todas mis viejas creencias.", author: "Louise Hay", category: "Revelación" },
    { id: "9", text: "La puerta de mi corazón se abre hacia dentro.", author: "Louise Hay", category: "Amor" },
    { id: "10", text: "El pasado ha terminado, ya no tiene poder en el presente.", author: "Louise Hay", category: "Presencia" },
    { id: "11", text: "No es divertido ser una víctima. Rechazo volver a sentirme una persona indefensa. Reclamo mi fuerza.", author: "Louise Hay", category: "Poder" },
    { id: "12", text: "Me concedo el don de librarme del pasado y me adentro con júbilo en el Ahora.", author: "Louise Hay", category: "Liberación" },
    { id: "13", text: "Amo y acepto a todos los miembros de mi familia tal como son ahora mismo.", author: "Louise Hay", category: "Familia" },
    { id: "14", text: "Abandono todo el miedo y la duda; la vida se vuelve sencilla y fácil para mí.", author: "Louise Hay", category: "Bienestar" },
    { id: "15", text: "Merezco la libertad de ser todo lo que puedo ser. Merezco todo lo bueno.", author: "Louise Hay", category: "Valor" },
    { id: "16", text: "Hoy no reacciono, elijo responder desde la calma y la compasión.", author: "Louise Hay", category: "Serenidad" },
    { id: "17", text: "Lo que parecía difícil ahora se vuelve simple porque confío.", author: "Louise Hay", category: "Confianza" },
    { id: "18", text: "Hoy escucho mis sentimientos y soy amable conmigo mismo.", author: "Louise Hay", category: "Autocuidado" },
    { id: "19", text: "Los pensamientos de Este Momento crean mi futuro.", author: "Louise Hay", category: "Conciencia" },
    { id: "20", text: "Consigo la ayuda que necesito, y esta puede llegar de cualquier parte.", author: "Louise Hay", category: "Apoyo" },
    { id: "21", text: "Mi sistema de apoyo es sólido y afectuoso a la vez.", author: "Louise Hay", category: "Comunidad" },
    { id: "22", text: "No hay problema ni demasiado grande ni demasiado pequeño que el amor no pueda resolver.", author: "Louise Hay", category: "Amor" },
    { id: "23", text: "Estoy dispuesto a curarme.", author: "Louise Hay", category: "Sanación" },
    { id: "24", text: "Estoy dispuesto a perdonar.", author: "Louise Hay", category: "Perdón" },
    { id: "25", text: "Todo está bien cuando cometo una equivocación.", author: "Louise Hay", category: "Crecimiento" },
    { id: "26", text: "Mi corazón es el centro de mi poder.", author: "Louise Hay", category: "Poder" },
    { id: "27", text: "Sigo a mi corazón.", author: "Louise Hay", category: "Intuición" },
    { id: "28", text: "Me desahogo de mis temores de la infancia.", author: "Louise Hay", category: "Liberación" },
    { id: "29", text: "Mi conciencia está llena de pensamientos saludables, positivos y amorosos.", author: "Louise Hay", category: "Mentalidad" },
    { id: "30", text: "Sé que estoy a salvo y que cuento con la protección y guía divina.", author: "Louise Hay", category: "Seguridad" },
    { id: "31", text: "Elijo la alegría.", author: "Louise Hay", category: "Alegría" },
    { id: "32", text: "Confío en el proceso de la vida.", author: "Louise Hay", category: "Confianza" },
    { id: "33", text: "Me amo y me apruebo tal como soy.", author: "Louise Hay", category: "Amor Propio" },
    { id: "34", text: "La vida me apoya en todas mis decisiones.", author: "Louise Hay", category: "Apoyo" },
    { id: "35", text: "Estoy abierto a recibir toda la abundancia del universo.", author: "Louise Hay", category: "Abundancia" },
    { id: "36", text: "Mi cuerpo es un templo sagrado y lo cuido con amor.", author: "Louise Hay", category: "Salud" },
    { id: "37", text: "Escucho la sabiduría de mi cuerpo.", author: "Louise Hay", category: "Salud" },
    { id: "38", text: "Soy digno de amor, alegría y éxito.", author: "Louise Hay", category: "Valor" },
    { id: "39", text: "Agradezco todas las experiencias de mi vida.", author: "Louise Hay", category: "Gratitud" },
    { id: "40", text: "Soy un imán para la felicidad.", author: "Louise Hay", category: "Alegría" },
    { id: "41", text: "Mis relaciones están llenas de amor y respeto.", author: "Louise Hay", category: "Relaciones" },
    { id: "42", text: "Expreso mi creatividad de formas maravillosas.", author: "Louise Hay", category: "Creatividad" },
    { id: "43", text: "Mi trabajo es satisfactorio y me trae alegría.", author: "Louise Hay", category: "Éxito" },
    { id: "44", text: "El dinero fluye hacia mí con facilidad y abundancia.", author: "Louise Hay", category: "Abundancia" },
    { id: "45", text: "Suelto la necesidad de controlarlo todo.", author: "Louise Hay", category: "Entrega" },
    { id: "46", text: "Mi corazón está lleno de gratitud y mi mente está en silencio.", author: "Louise Hay", category: "Paz" },
    { id: "47", text: "Hoy elijo responder desde la calma y la compasión.", author: "Louise Hay", category: "Calma" },
    { id: "48", text: "Recurro a una fuerza interior que está a mi disposición.", author: "Louise Hay", category: "Poder" },
    { id: "49", text: "Me relajo y libero mis pensamientos de toda tensión.", author: "Louise Hay", category: "Relajación" },
    { id: "50", text: "Soy una persona libre que vive en un mundo que es reflejo de mi amor.", author: "Louise Hay", category: "Libertad" },
    { id: "51", text: "Todo lo que doy regresa a mí multiplicado.", author: "Louise Hay", category: "Abundancia" },
    { id: "52", text: "Cada célula de mi cuerpo escucha mis pensamientos y responde a ellos.", author: "Louise Hay", category: "Salud" },
    { id: "53", text: "Elijo ver con los ojos del alma, no con los del juicio.", author: "Louise Hay", category: "Intuición" },
    { id: "54", text: "Mis pensamientos están alineados con la paz, la expansión y la dicha.", author: "Louise Hay", category: "Paz" },
    { id: "55", text: "Merezco lo mejor y estoy dispuesto a aceptarlo.", author: "Louise Hay", category: "Valor" },
    { id: "56", text: "No te afanes por el mañana. Mi mente está en paz con el presente.", author: "Mateo 6:34", category: "Ansiedad" },
    { id: "57", text: "Todo lo puedo en Cristo que me fortalece. Mi fuerza interior es ilimitada.", author: "Filipenses 4:13", category: "Motivación" },
    { id: "58", text: "Venid a mí los que estáis cansados y cargados, y yo os haré descansar.", author: "Mateo 11:28", category: "Estrés" },
    { id: "59", text: "Porque yo sé los planes que tengo para ti, planes de bienestar. Mi futuro es esperanza.", author: "Jeremías 29:11", category: "Confianza" },
    { id: "60", text: "No temas, porque yo estoy contigo. No tengo que enfrentar nada solo.", author: "Isaías 41:10", category: "Seguridad" },
    { id: "61", text: "La paz os dejo, mi paz os doy. Mi paz viene de adentro.", author: "Juan 14:27", category: "Paz" },
    { id: "62", text: "Echa toda tu ansiedad sobre Él. Hoy suelto lo que no puedo controlar.", author: "1 Pedro 5:7", category: "Ansiedad" },
    { id: "63", text: "El Señor es mi pastor, nada me faltará. Descanso en la certeza de que estoy provisto.", author: "Salmos 23:1", category: "Abundancia" },
    { id: "64", text: "Cuando siento miedo, en ti confío. La fe y el miedo no pueden habitar juntos.", author: "Salmos 56:3", category: "Confianza" },
    { id: "65", text: "Dios no nos ha dado espíritu de cobardía, sino de poder, de amor y de dominio propio.", author: "2 Timoteo 1:7", category: "Poder" },
    { id: "66", text: "Sé fuerte y valiente. No temas ni desmayes.", author: "Josué 1:9", category: "Valor" },
    { id: "67", text: "Todas las cosas obran para bien. Incluso lo que no entiendo hoy tiene un propósito.", author: "Romanos 8:28", category: "Confianza" },
    { id: "68", text: "Renovaos en el espíritu de vuestra mente. Hoy elijo pensamientos que me construyen.", author: "Efesios 4:23", category: "Mentalidad" },
    { id: "69", text: "Lámpara es a mis pies tu palabra. Tengo claridad para dar el siguiente paso.", author: "Salmos 119:105", category: "Claridad" },
    { id: "70", text: "Los que esperan en el Señor renovarán sus fuerzas; levantarán alas como las águilas.", author: "Isaías 40:31", category: "Motivación" },
    { id: "71", text: "El gozo del Señor es mi fortaleza. Hoy encuentro razones para sonreír.", author: "Nehemías 8:10", category: "Alegría" },
    { id: "72", text: "Ama a tu prójimo como a ti mismo. Me permito amarme para poder amar mejor a otros.", author: "Marcos 12:31", category: "Amor Propio" },
    { id: "73", text: "Si Dios es por nosotros, ¿quién contra nosotros? Estoy respaldado por una fuerza infinita.", author: "Romanos 8:31", category: "Seguridad" },
    { id: "74", text: "Dad gracias en todo. La gratitud transforma mi perspectiva y mi realidad.", author: "1 Tesalonicenses 5:18", category: "Gratitud" },
    { id: "75", text: "Mi enfoque determina mi destino.", author: "Hebreos 12:2", category: "Enfoque" },
    { id: "76", text: "Tengo el poder de ser instrumento de sanación.", author: "Mateo 10:8", category: "Sanación" },
    { id: "77", text: "Perdona setenta veces siete. El perdón me libera a mí primero.", author: "Mateo 18:22", category: "Perdón" },
    { id: "78", text: "He aquí, yo hago nuevas todas las cosas. Cada amanecer es una oportunidad.", author: "Apocalipsis 21:5", category: "Crecimiento" },
    { id: "79", text: "El amor es paciente, es bondadoso. Merezco un amor que construye.", author: "1 Corintios 13:4", category: "Amor" },
    { id: "80", text: "Bienaventurados los que lloran, porque serán consolados. Mi dolor tiene fecha de caducidad.", author: "Mateo 5:4", category: "Sanación" },
    { id: "81", text: "El que observa el viento no sembrará. Hoy actúo a pesar de la incertidumbre.", author: "Eclesiastés 11:4", category: "Motivación" },
    { id: "82", text: "Mis emociones son señales, no sentencias. Puedo sentir sin dejar que me controlen.", author: "Albert Ellis", category: "Ansiedad" },
    { id: "83", text: "No es lo que me pasa lo que me afecta, sino cómo interpreto lo que me pasa.", author: "Albert Ellis", category: "Mentalidad" },
    { id: "84", text: "Puedo tolerar la incomodidad. Lo incómodo no es lo mismo que lo insoportable.", author: "Albert Ellis", category: "Estrés" },
    { id: "85", text: "Cuestiono mis pensamientos automáticos. No todo lo que pienso es verdad.", author: "Aaron Beck", category: "Conciencia" },
    { id: "86", text: "Mis pensamientos negativos son distorsiones, no la realidad.", author: "David Burns", category: "Mentalidad" },
    { id: "87", text: "La felicidad no es la ausencia de problemas, sino la capacidad de lidiar con ellos.", author: "Steve Maraboli", category: "Bienestar" },
    { id: "88", text: "El coraje no es la ausencia de miedo, sino actuar a pesar de él.", author: "Mark Twain", category: "Valor" },
    { id: "89", text: "Lo que resistes, persiste. Acepto lo que es y me muevo hacia lo que puede ser.", author: "Carl Jung", category: "Calma" },
    { id: "90", text: "Soy suficiente tal como soy en este momento. Mi valor no depende de mi productividad.", author: "Brené Brown", category: "Amor Propio" },
    { id: "91", text: "La vulnerabilidad es el lugar de nacimiento de la conexión y la alegría.", author: "Brené Brown", category: "Comunidad" },
    { id: "92", text: "No necesito la aprobación de todos. La opinión más importante es la que tengo de mí mismo.", author: "Albert Ellis", category: "Amor Propio" },
    { id: "93", text: "El momento presente es el único que existe. Respira. Estás aquí y eso es suficiente.", author: "Eckhart Tolle", category: "Presencia" },
    { id: "94", text: "No soy lo que me pasó. Soy lo que elijo ser a partir de ahora.", author: "Carl Jung", category: "Liberación" },
    { id: "95", text: "Cada respiración es una oportunidad de empezar de nuevo.", author: "Thich Nhat Hanh", category: "Calma" },
    { id: "96", text: "Puedo ser amable conmigo mismo en los días difíciles.", author: "Kristin Neff", category: "Autocuidado" },
    { id: "97", text: "Mi ansiedad es una alarma, no una profecía. Lo que siento ahora pasará.", author: "David Carbonell", category: "Ansiedad" },
    { id: "98", text: "El fracaso no es una identidad, es un evento. Puedo aprender y seguir adelante.", author: "Carol Dweck", category: "Crecimiento" },
    { id: "99", text: "No tengo que tener todas las respuestas hoy. Me basta con dar el siguiente paso.", author: "Martin Luther King Jr.", category: "Confianza" },
    { id: "100", text: "Hoy elijo creer que lo mejor está por venir. Suelto el control y confío en el camino.", author: "Ancla", category: "Entrega" },
];

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
