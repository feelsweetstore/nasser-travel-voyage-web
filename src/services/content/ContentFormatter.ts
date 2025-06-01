
/**
 * Service de formatage et transformation des données de contenu
 */
export class ContentFormatter {
  /**
   * Récupère le contenu du titre et sous-titre de la page d'accueil
   */
  static getHeroContent(content: any[]): { title: string; subtitle: string } {
    const title = content.find(item => item.type === 'hero_title')?.content || 'Bienvenue chez NASSER TRAVEL HORIZON';
    const subtitle = content.find(item => item.type === 'hero_subtitle')?.content || 'Votre partenaire de confiance pour tous vos voyages au départ du Tchad et partout dans le monde.';
    
    console.info('Retrieved hero content:', { title, subtitle });
    return { title, subtitle };
  }
  
  /**
   * Formate et récupère les heures d'ouverture
   */
  static getFormattedOpeningHours(content: any[]): { weekdays: string, saturday: string, sunday: string } {
    const hoursContent = content.find(item => item.type === 'hours')?.content || '';
    const hoursLines = hoursContent.split('\n');
    
    return {
      weekdays: hoursLines.find(line => line.includes('Lundi') || line.includes('Vendredi')) || 'Lundi - Vendredi: 8h - 18h',
      saturday: hoursLines.find(line => line.includes('Samedi')) || 'Samedi: 9h - 15h',
      sunday: hoursLines.find(line => line.includes('Dimanche')) || 'Dimanche: Fermé'
    };
  }
}
