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
        // Contenu de la page d'accueil
        { 
          id: 1, 
          title: "Logo du site", 
          page: "Global", 
          content: "/placeholder.svg", 
          type: "logo", 
          category: "header" 
        },
        { 
          id: 2, 
          title: "Image de fond Hero", 
          page: "Accueil", 
          content: "/placeholder.svg", 
          type: "background", 
          category: "hero" 
        },
        { 
          id: 3, 
          title: "Titre principal", 
          page: "Accueil", 
          content: "Bienvenue chez NASSER TRAVEL HORIZON", 
          type: "text", 
          category: "hero" 
        },
        { 
          id: 4, 
          title: "Sous-titre Hero", 
          page: "Accueil", 
          content: "Votre partenaire de voyage au Tchad", 
          type: "text", 
          category: "hero" 
        },
        
        // Contenu de la page Services
        { 
          id: 5, 
          title: "Titre Services", 
          page: "Services", 
          content: "Nos Services", 
          type: "text", 
          category: "header" 
        },
        { 
          id: 6, 
          title: "Description Services", 
          page: "Services", 
          content: "Des solutions complètes pour tous vos besoins de voyage", 
          type: "text", 
          category: "header" 
        },

        // Services spécifiques
        { 
          id: 7, 
          title: "Service 1", 
          page: "Services", 
          content: "Réservation de billets d'avion", 
          type: "text", 
          category: "service" 
        },
        { 
          id: 8, 
          title: "Description Service 1", 
          page: "Services", 
          content: "Nous vous offrons les meilleures options de vols aux tarifs les plus compétitifs pour toutes vos destinations.", 
          type: "text", 
          category: "service" 
        },

        // Contenu À propos
        { 
          id: 9, 
          title: "Titre À propos", 
          page: "À propos", 
          content: "À propos de NASSER TRAVEL HORIZON", 
          type: "text", 
          category: "header" 
        },
        { 
          id: 10, 
          title: "Notre Histoire", 
          page: "À propos", 
          content: "Fondée en 2015, NASSER TRAVEL HORIZON est née de la passion de son fondateur pour les voyages et de sa volonté d'offrir aux Tchadiens un service de qualité internationale.", 
          type: "text", 
          category: "history" 
        },

        // Contenu Galerie
        { 
          id: 11, 
          title: "Titre Galerie", 
          page: "Galerie", 
          content: "Notre Galerie", 
          type: "text", 
          category: "header" 
        },
        { 
          id: 12, 
          title: "Image Galerie 1", 
          page: "Galerie", 
          content: "/placeholder.svg", 
          type: "image", 
          category: "gallery" 
        },

        // FAQ
        { 
          id: 13, 
          title: "Question FAQ 1", 
          page: "FAQ", 
          content: "Comment réserver un billet d'avion ?", 
          type: "faq-question", 
          category: "general" 
        },
        { 
          id: 14, 
          title: "Réponse FAQ 1", 
          page: "FAQ", 
          content: "Vous pouvez réserver en nous contactant par téléphone, email ou en visitant notre agence.", 
          type: "faq-answer", 
          category: "general" 
        },

        // Coordonnées
        { 
          id: 15, 
          title: "Adresse", 
          page: "Global", 
          content: "Avenue Charles de Gaulle, N'Djamena, Tchad", 
          type: "contact", 
          category: "footer" 
        },
        { 
          id: 16, 
          title: "Téléphone", 
          page: "Global", 
          content: "+235 66 00 00 00", 
          type: "contact", 
          category: "footer" 
        },
        { 
          id: 17, 
          title: "Email", 
          page: "Global", 
          content: "contact@nassertravel.com", 
          type: "contact", 
          category: "footer" 
        },

        // Pages légales
        { 
          id: 18, 
          title: "Mentions légales", 
          page: "Mentions légales", 
          content: "NASSER TRAVEL HORIZON - SARL au capital de 5 000 000 FCFA...", 
          type: "legal", 
          category: "legal" 
        },
        { 
          id: 19, 
          title: "Politique de confidentialité", 
          page: "Politique de confidentialité", 
          content: "Protection de vos données personnelles...", 
          type: "privacy", 
          category: "legal" 
        },
        { 
          id: 20, 
          title: "CGV", 
          page: "CGV", 
          content: "Conditions générales de vente...", 
          type: "terms", 
          category: "legal" 
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
    // Récupère le contenu spécifique à la page ainsi que le contenu global
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

  /**
   * Récupère le contenu éditable pour la gestion du site
   * @returns Liste des éléments de contenu pour l'administration
   */
  static getEditableContent(): ContentItem[] {
    const content = this.getContent();
    
    // Pages éditables depuis l'interface d'administration
    const allowedPages = ['Accueil', 'À propos', 'Galerie', 'FAQ', 'Mentions légales', 'Politique de confidentialité', 'CGV', 'Global'];
    
    return content.filter(item => allowedPages.includes(item.page));
  }

  /**
   * Récupère le contenu éditable pour une page spécifique
   * @param page - Nom de la page
   * @returns Liste des éléments de contenu pour la page
   */
  static getEditableContentByPage(page: string): ContentItem[] {
    const content = this.getEditableContent();
    return content.filter(item => item.page === page || item.page === 'Global');
  }
}

// Définition du type ContentItem pour une meilleure utilisation avec TypeScript
export interface ContentItem {
  id: number;
  title: string;
  page: string;
  content: string;
  type: string;
  category: string;
}

export default ContentService;
