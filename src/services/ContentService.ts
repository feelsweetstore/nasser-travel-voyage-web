
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
        { id: 1, title: "Texte d'accueil", page: "Accueil", content: "Bienvenue chez NASSER TRAVEL HORIZON, votre partenaire de confiance pour tous vos voyages. Nous vous offrons des services personnalisés pour rendre chaque voyage inoubliable.", type: "text", category: "hero" },
        { id: 2, title: "À propos", page: "À propos", content: "NASSER TRAVEL HORIZON est une agence de voyage basée à N'Djamena, Tchad. Nous proposons des services de réservation de billets d'avion, d'hôtels et d'organisation de voyages sur mesure depuis plus de 5 ans.", type: "text", category: "about" },
        { id: 3, title: "Services", page: "Services", content: "Nous offrons une gamme complète de services pour répondre à tous vos besoins de voyage : réservation de billets, organisation de séjours, assistance visa, transferts aéroport et bien plus encore.", type: "text", category: "services" },
        { id: 4, title: "Logo principal", page: "Global", content: "/placeholder.svg", type: "logo", category: "header" },
        { id: 5, title: "Image de fond accueil", page: "Accueil", content: "/placeholder.svg", type: "background", category: "hero" },
        { id: 6, title: "Heures d'ouverture", page: "Global", content: "Lundi: 08:00-18:00\nMardi: 08:00-18:00\nMercredi: 08:00-18:00\nJeudi: 08:00-18:00\nVendredi: 08:00-18:00\nSamedi: 09:00-13:00\nDimanche: Fermé", type: "hours", category: "footer" },
        { id: 7, title: "Coordonnées", page: "Global", content: "Adresse: Avenue Charles de Gaulle, N'Djamena, Tchad\nTéléphone: +235 66 38 69 37\nEmail: contact@nassertravelhorizon.com", type: "contact", category: "footer" },
        { id: 8, title: "Mentions légales", page: "Mentions légales", content: "NASSER TRAVEL HORIZON - SARL au capital de 5 000 000 FCFA\nSiège social : Avenue Charles de Gaulle, N'Djamena, Tchad\nRCS N'Djamena : 123456789\nDirecteur de la publication : M. Nasser\nHébergeur : OVH - 2 rue Kellermann - 59100 Roubaix - France", type: "legal", category: "legal" },
        { id: 9, title: "Politique de confidentialité", page: "Politique de confidentialité", content: "Chez NASSER TRAVEL HORIZON, nous nous engageons à protéger et à respecter votre vie privée. Cette politique définit la base sur laquelle les données personnelles que nous collectons auprès de vous, ou que vous nous fournissez, seront traitées par nous.", type: "privacy", category: "legal" },
        { id: 10, title: "CGV", page: "CGV", content: "Les présentes conditions générales de vente régissent les relations contractuelles entre la société NASSER TRAVEL HORIZON et ses clients, dans le cadre de son activité d'agence de voyage.", type: "terms", category: "legal" },
        { id: 11, title: "Service 1", page: "Services", content: "Réservation de billets d'avion", type: "service", category: "services" },
        { id: 12, title: "Service 2", page: "Services", content: "Organisation de séjours sur mesure", type: "service", category: "services" },
        { id: 13, title: "Service 3", page: "Services", content: "Assistance visa", type: "service", category: "services" },
        { id: 14, title: "Service 4", page: "Services", content: "Transferts aéroport", type: "service", category: "services" },
        { id: 15, title: "FAQ 1", page: "FAQ", content: "Question: Comment réserver un billet?\nRéponse: Vous pouvez réserver un billet en ligne sur notre site, par téléphone, ou en nous rendant visite à notre agence.", type: "faq", category: "faq" },
        { id: 16, title: "FAQ 2", page: "FAQ", content: "Question: Quels sont les moyens de paiement acceptés?\nRéponse: Nous acceptons les paiements par carte bancaire, virement bancaire et en espèces à notre agence.", type: "faq", category: "faq" },
        { id: 17, title: "FAQ 3", page: "FAQ", content: "Question: Comment annuler une réservation?\nRéponse: Pour annuler une réservation, veuillez nous contacter par téléphone ou par email au moins 48h à l'avance.", type: "faq", category: "faq" },
        { id: 18, title: "Galerie 1", page: "Galerie", content: "/placeholder.svg", type: "gallery", category: "gallery" },
        { id: 19, title: "Galerie 2", page: "Galerie", content: "/placeholder.svg", type: "gallery", category: "gallery" },
        { id: 20, title: "Galerie 3", page: "Galerie", content: "/placeholder.svg", type: "gallery", category: "gallery" },
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultContent));
    }
  }
  
  /**
   * Récupère tout le contenu du site
   * @returns Liste des éléments de contenu
   */
  static getContent(): ContentItem[] {
    this.initialize();
    const storedContent = localStorage.getItem(this.STORAGE_KEY);
    return JSON.parse(storedContent || '[]');
  }
  
  /**
   * Récupère un élément de contenu spécifique
   * @param id - ID de l'élément
   * @returns L'élément de contenu ou null s'il n'existe pas
   */
  static getContentById(id: number): ContentItem | null {
    const content = this.getContent();
    return content.find(item => item.id === id) || null;
  }
  
  /**
   * Récupère le contenu pour une page spécifique
   * @param page - Nom de la page
   * @returns Liste des éléments de contenu pour la page
   */
  static getContentByPage(page: string): ContentItem[] {
    const content = this.getContent();
    // Récupère le contenu spécifique à la page ainsi que le contenu global
    return content.filter(item => item.page === page || item.page === 'Global');
  }
  
  /**
   * Récupère le contenu par type et catégorie
   * @param type - Type de contenu (text, image, etc.)
   * @param category - Catégorie (header, footer, etc.)
   * @returns Liste des éléments de contenu correspondants
   */
  static getContentByTypeAndCategory(type: string, category: string): ContentItem[] {
    const content = this.getContent();
    return content.filter(item => item.type === type && item.category === category);
  }
  
  /**
   * Récupère le contenu par type
   * @param type - Type de contenu (text, image, etc.)
   * @returns Liste des éléments de contenu correspondants
   */
  static getContentByType(type: string): ContentItem[] {
    const content = this.getContent();
    return content.filter(item => item.type === type);
  }
  
  /**
   * Récupère le contenu par catégorie
   * @param category - Catégorie (header, footer, etc.)
   * @returns Liste des éléments de contenu correspondants
   */
  static getContentByCategory(category: string): ContentItem[] {
    const content = this.getContent();
    return content.filter(item => item.category === category);
  }
  
  /**
   * Récupère le contenu modifiable de l'interface
   * @returns Liste filtrée des éléments modifiables
   */
  static getEditableContent(): ContentItem[] {
    const content = this.getContent();
    // Filtrer pour ne montrer que le logo, et les contenus des pages spécifiques
    return content.filter(item => 
      // Logo dans l'en-tête
      (item.type === 'logo' && item.category === 'header') ||
      // Contenu des pages spécifiques
      ['Accueil', 'Services', 'Galerie', 'FAQ'].includes(item.page)
    );
  }
  
  /**
   * Met à jour un élément de contenu
   * @param id - ID de l'élément
   * @param contentItem - Nouvelles données
   * @returns Liste mise à jour du contenu
   */
  static updateContent(id: number, contentItem: Partial<ContentItem>): ContentItem[] {
    const content = this.getContent();
    const updatedContent = content.map(item => 
      item.id === id ? { ...item, ...contentItem } : item
    );
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedContent));
    return updatedContent;
  }
  
  /**
   * Ajoute un nouvel élément de contenu
   * @param contentItem - Nouvel élément à ajouter
   * @returns Nouvel élément avec ID généré
   */
  static addContent(contentItem: Omit<ContentItem, 'id'>): ContentItem {
    const content = this.getContent();
    
    // Générer un nouvel ID
    const newId = content.length > 0 
      ? Math.max(...content.map(item => item.id)) + 1 
      : 1;
    
    const newItem: ContentItem = {
      ...contentItem,
      id: newId
    };
    
    content.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(content));
    
    return newItem;
  }
  
  /**
   * Supprime un élément de contenu
   * @param id - ID de l'élément à supprimer
   * @returns Liste mise à jour du contenu
   */
  static deleteContent(id: number): ContentItem[] {
    const content = this.getContent();
    const updatedContent = content.filter(item => item.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedContent));
    return updatedContent;
  }
  
  /**
   * Récupère les pages disponibles dans le contenu
   * @returns Liste des pages uniques
   */
  static getAvailablePages(): string[] {
    const content = this.getContent();
    const pages = content.map(item => item.page);
    return [...new Set(pages)].sort();
  }
  
  /**
   * Récupère les types de contenu disponibles
   * @returns Liste des types uniques
   */
  static getAvailableTypes(): string[] {
    const content = this.getContent();
    const types = content.map(item => item.type);
    return [...new Set(types)].sort();
  }
  
  /**
   * Récupère les catégories disponibles
   * @returns Liste des catégories uniques
   */
  static getAvailableCategories(): string[] {
    const content = this.getContent();
    const categories = content.map(item => item.category);
    return [...new Set(categories)].sort();
  }
}

// Type pour les éléments de contenu
export interface ContentItem {
  id: number;
  title: string;
  page: string;
  content: string;
  type: string;
  category: string;
}

export default ContentService;
