import affirmations from '../data/affirmations.json';

export interface Affirmation {
    id: string;
    text: string;
    author: string;
    category: string;
    source?: string;
}

export class AffirmationEngine {
    private data: Affirmation[] = affirmations;
    private moodMapping: Record<string, string[]> = {
        'Calma': ['Ansiedad', 'Estrés', 'Paz', 'Relajación', 'Calma', 'Serenidad', 'Entrega'],
        'Fuerza': ['Motivación', 'Poder', 'Éxito', 'Protección', 'Libertad'],
        'Amor': ['Amor', 'Relaciones', 'Familia', 'Perdón', 'Comunidad'],
        'Crecimiento': ['Crecimiento', 'Insight', 'Intuición', 'Creatividad'],
        'Bienestar': ['Salud', 'Autocuidado', 'Sanación', 'Bienestar'],
        'Abundancia': ['Abundancia', 'Gratitud', 'Alegría', 'Dicha'],
        'Confianza': ['Confianza', 'Seguridad', 'Amor Propio', 'Valor', 'Apoyo', 'Liberación'],
        'Claridad': ['Enfoque', 'Mentalidad', 'Conciencia', 'Presencia', 'Revelación']
    };

    public getAffirmationsByMood(mood: string): Affirmation[] {
        if (mood === 'Todas') return this.data;
        const subCategories = this.moodMapping[mood] || [];
        // If specific category is requested (not in mapping), return just that category
        if (subCategories.length === 0 && !this.moodMapping[mood]) {
            return this.data.filter(a => a.category.toLowerCase() === mood.toLowerCase());
        }
        return this.data.filter(a =>
            subCategories.some(sub => sub.toLowerCase() === a.category.toLowerCase())
        );
    }

    public getRandomAffirmation(mood: string): Affirmation {
        const list = this.getAffirmationsByMood(mood);
        if (list.length === 0) return this.data[0];
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }

    public getMoods(): string[] {
        return Object.keys(this.moodMapping);
    }

    public getAllCategories(): string[] {
        // dynamic list of all unique categories in data
        const categories = new Set(this.data.map(a => a.category));
        return Array.from(categories).sort();
    }
}

export const affirmationEngine = new AffirmationEngine();
