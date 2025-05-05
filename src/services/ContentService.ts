/**
 * Service de gestion du contenu du site
 */
class ContentService {
  private static STORAGE_KEY = 'siteContent';
  
  /**
   * Initialise le contenu par défaut si nécessaire
   */
  static initialize(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const defaultContent = [
        { id: 1, title: "Titre d'accueil", page: "Accueil", content: "Bienvenue chez NASSER TRAVEL HORIZON", type: "text", category: "hero_title" },
        { id: 2, title: "Sous-titre d'accueil", page: "Accueil", content: "Votre partenaire de confiance pour tous vos voyages au départ du Tchad et partout dans le monde.", type: "text", category: "hero_subtitle" },
        { id: 3, title: "À propos", page: "À propos", content: "NASSER TRAVEL HORIZON est une agence de voyage basée à N'Djamena, Tchad. Nous proposons des services de réservation de billets d'avion, d'hôtels et d'organisation de voyages sur mesure depuis plus de 5 ans.", type: "text", category: "about" },
        { id: 4, title: "Services", page: "Services", content: "Nous offrons une gamme complète de services pour répondre à tous vos besoins de voyage : réservation de billets, organisation de séjours, assistance visa, transferts aéroport et bien plus encore.", type: "text", category: "services" },
        { id: 5, title: "Logo principal", page: "Global", content: "/placeholder.svg", type: "logo", category: "header" },
        { id: 6, title: "Image de fond accueil", page: "Accueil", content: "/placeholder.svg", type: "background", category: "hero" },
        { id: 7, title: "Heures d'ouverture", page: "Global", content: "Lundi - Vendredi: 8h - 18h\nSamedi: 9h - 15h\nDimanche: Fermé", type: "hours", category: "footer" },
        { id: 8, title: "Coordonnées", page: "Global", content: "Adresse: Avenue Charles de Gaulle, N'Djamena, Tchad\nTéléphone: +235 66 38 69 37, +235 99 00 00 00\nEmail: contact@nassertravelhorizon.com, info@nassertravelhorizon.com", type: "contact", category: "footer" },
        { id: 9, title: "Mentions légales", page: "Mentions légales", content: "NASSER TRAVEL HORIZON - SARL au capital de 5 000 000 FCFA\nSiège social : Avenue Charles de Gaulle, N'Djamena, Tchad\nRCS N'Djamena : 123456789\nDirecteur de la publication : M. Nasser\nHébergeur : OVH - 2 rue Kellermann - 59100 Roubaix - France", type: "legal", category: "legal" },
        { id: 10, title: "Politique de confidentialité", page: "Politique de confidentialité", content: "Chez NASSER TRAVEL HORIZON, nous nous engageons à protéger et à respecter votre vie privée. Cette politique définit la base sur laquelle les données personnelles que nous collectons auprès de vous, ou que vous nous fournissez, seront traitées par nous.", type: "privacy", category: "legal" },
        { id: 11, title: "CGV", page: "CGV", content: "Les présentes conditions générales de vente régissent les relations contractuelles entre la société NASSER TRAVEL HORIZON et ses clients, dans le cadre de son activité d'agence de voyage.", type: "terms", category: "legal" },
      ];
      
      // Vérifier si des données existent déjà - si oui, ne pas écraser mais migrer
      const existingContent = localStorage.getItem(this.STORAGE_KEY);
      if (existingContent) {
        const parsedContent = JSON.parse(existingContent);
        // Chercher s'il existe déjà un texte d'accueil
        const heroContent = parsedContent.find(item => item.category === 'hero');
        
        if (heroContent) {
          // Si oui, séparer en titre et sous-titre
          const titleItem = defaultContent.find(item => item.category === 'hero_title');
          const subtitleItem = defaultContent.find(item => item.category === 'hero_subtitle');
          
          // Ajouter ces éléments à l'existant sans écraser
          const maxId = Math.max(...parsedContent.map(item => item.id)) + 1;
          
          if (titleItem && !parsedContent.find(item => item.category === 'hero_title')) {
            parsedContent.push({
              ...titleItem,
              id: maxId
            });
          }
          
          if (subtitleItem && !parsedContent.find(item => item.category === 'hero_subtitle')) {
            parsedContent.push({
              ...subtitleItem,
              id: maxId + 1
            });
          }
          
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsedContent));
          return;
        }
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultContent));
    }
  }
  
  /**
   * Récupère tout le contenu du site
   * @returns Liste des éléments de contenu
   */
  static getContent(): any[] {
    this.initialize();
    const storedContent = localStorage.getItem(this.STORAGE_KEY);
    return JSON.parse(storedContent || '[]');
  }
  
  /**
   * Récupère un élément de contenu spécifique
   * @param id - ID de l'élément
   * @returns L'élément de contenu ou null s'il n'existe pas
   */
  static getContentById(id: number): any | null {
    const content = this.getContent();
    return content.find(item => item.id === id) || null;
  }
  
  /**
   * Récupère le contenu pour une page spécifique
   * @param page - Nom de la page
   * @returns Liste des éléments de contenu pour la page
   */
  static getContentByPage(page: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.page === page || item.page === 'Global');
  }
  
  /**
   * Récupère le contenu par type et catégorie
   * @param type - Type de contenu (text, image, etc.)
   * @param category - Catégorie (header, footer, etc.)
   * @returns Liste des éléments de contenu correspondants
   */
  static getContentByTypeAndCategory(type: string, category: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.type === type && item.category === category);
  }
  
  /**
   * Récupère le contenu par type
   * @param type - Type de contenu (text, image, etc.)
   * @returns Liste des éléments de contenu correspondants
   */
  static getContentByType(type: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.type === type);
  }
  
  /**
   * Récupère le contenu par catégorie
   * @param category - Catégorie (header, footer, etc.)
   * @returns Liste des éléments de contenu correspondants
   */
  static getContentByCategory(category: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.category === category);
  }
  
  /**
   * Récupère le contenu de l'en-tête de la page d'accueil
   * @returns {Object} Objet contenant le titre et le sous-titre
   */
  static getHeroContent(): {title: string, subtitle: string} {
    const content = this.getContent();
    const titleContent = content.find(item => item.category === 'hero_title');
    const subtitleContent = content.find(item => item.category === 'hero_subtitle');
    
    return {
      title: titleContent ? titleContent.content : "Bienvenue chez NASSER TRAVEL HORIZON",
      subtitle: subtitleContent ? subtitleContent.content : "Votre partenaire de confiance pour tous vos voyages au départ du Tchad et partout dans le monde."
    };
  }
  
  /**
   * Ajoute un nouvel élément de contenu
   * @param contentItem - Élément à ajouter
   * @returns L'élément ajouté avec un ID
   */
  static addContent(contentItem: any): any {
    const content = this.getContent();
    const newContentItem = {
      ...contentItem,
      id: content.length ? Math.max(...content.map(c => c.id)) + 1 : 1
    };
    
    const updatedContent = [...content, newContentItem];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedContent));
    
    // Dispatch event to notify content change
    window.dispatchEvent(new CustomEvent('contentUpdated', {
      detail: { type: 'add', content: newContentItem }
    }));
    
    return newContentItem;
  }
  
  /**
   * Met à jour un élément de contenu
   * @param id - ID de l'élément
   * @param contentItem - Nouvelles données
   * @returns Liste mise à jour du contenu
   */
  static updateContent(id: number, contentItem: any): any[] {
    const content = this.getContent();
    const updatedContent = content.map(item => 
      item.id === id ? { ...item, ...contentItem } : item
    );
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedContent));
    
    // Dispatch event to notify content change
    window.dispatchEvent(new CustomEvent('contentUpdated', {
      detail: { type: 'update', content: contentItem, id }
    }));
    
    return updatedContent;
  }
  
  /**
   * Supprime un élément de contenu
   * @param id - ID de l'élément à supprimer
   * @returns Liste mise à jour du contenu
   */
  static deleteContent(id: number): any[] {
    const content = this.getContent();
    const updatedContent = content.filter(item => item.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedContent));
    
    // Dispatch event to notify content change
    window.dispatchEvent(new CustomEvent('contentUpdated', {
      detail: { type: 'delete', id }
    }));
    
    return updatedContent;
  }
  
  /**
   * Formate et récupère les heures d'ouverture
   * @returns Object contenant les heures d'ouverture formatées
   */
  static getFormattedOpeningHours(): { weekdays: string, saturday: string, sunday: string } {
    const hoursContent = this.getContentByType('hours')[0]?.content || '';
    const hoursLines = hoursContent.split('\n');
    
    return {
      weekdays: hoursLines.find(line => line.includes('Lundi') || line.includes('Vendredi')) || 'Lundi - Vendredi: 8h - 18h',
      saturday: hoursLines.find(line => line.includes('Samedi')) || 'Samedi: 9h - 15h',
      sunday: hoursLines.find(line => line.includes('Dimanche')) || 'Dimanche: Fermé'
    };
  }
}

export default ContentService;
