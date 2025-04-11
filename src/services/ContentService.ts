
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
        { 
          id: 1, 
          title: "Texte d'accueil", 
          page: "Accueil", 
          type: "text",
          content: "Bienvenue chez NASSER TRAVEL HORIZON, votre partenaire de confiance pour tous vos voyages. Nous vous offrons des services personnalisés pour rendre chaque voyage inoubliable." 
        },
        { 
          id: 2, 
          title: "À propos", 
          page: "À propos", 
          type: "text",
          content: "NASSER TRAVEL HORIZON est une agence de voyage basée à N'Djamena, Tchad. Nous proposons des services de réservation de billets d'avion, d'hôtels et d'organisation de voyages sur mesure depuis plus de 5 ans." 
        },
        { 
          id: 3, 
          title: "Services", 
          page: "Services", 
          type: "text",
          content: "Nous offrons une gamme complète de services pour répondre à tous vos besoins de voyage : réservation de billets, organisation de séjours, assistance visa, transferts aéroport et bien plus encore." 
        },
        {
          id: 4,
          title: "Logo",
          page: "Global",
          type: "image",
          imageUrl: "/placeholder.svg",
          content: "Logo Nasser Travel Horizon"
        },
        {
          id: 5,
          title: "Coordonnées",
          page: "Contact",
          type: "contact",
          address: "Avenue Charles de Gaulle, N'Djamena, Tchad",
          phone: "+235 66 38 69 37",
          email: "contact@nassertravelhorizon.com",
          whatsapp: "+235 66 38 69 37",
          hours: "Lundi-Vendredi: 8h-17h\nSamedi: 9h-13h\nDimanche: Fermé"
        }
      ];
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
    return content.filter(item => item.page === page);
  }
  
  /**
   * Récupère le contenu d'un type spécifique
   * @param type - Type de contenu (text, image, etc.)
   * @returns Liste des éléments de ce type de contenu
   */
  static getContentByType(type: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.type === type);
  }
  
  /**
   * Récupère les informations de contact
   * @returns Les informations de contact ou null si non trouvées
   */
  static getContactInfo(): any | null {
    const content = this.getContent();
    return content.find(item => item.type === 'contact') || null;
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
    return updatedContent;
  }
}

export default ContentService;
