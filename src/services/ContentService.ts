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
        // Accueil
        { id: 1, title: "Titre de la page d'accueil", page: "Accueil", content: "Bienvenue chez NASSER TRAVEL HORIZON", type: "text", category: "hero" },
        { id: 2, title: "Sous-titre de la page d'accueil", page: "Accueil", content: "Votre partenaire de confiance pour tous vos voyages au départ du Tchad et partout dans le monde.", type: "text", category: "hero" },
        { id: 3, title: "Image de fond accueil", page: "Accueil", content: "/lovable-uploads/0acf3f82-7efa-40da-8002-87c0518ed21e.png", type: "background", category: "hero" },
        
        // Services
        { id: 4, title: "Titre Services", page: "Services", content: "Nos Services", type: "text", category: "header" },
        { id: 5, title: "Sous-titre Services", page: "Services", content: "Des solutions complètes pour tous vos besoins de voyage, du billet d'avion à l'assistance sur place", type: "text", category: "header" },
        { id: 6, title: "Titre CTA Services", page: "Services", content: "Prêt à planifier votre prochain voyage ?", type: "text", category: "cta" },
        { id: 7, title: "Sous-titre CTA Services", page: "Services", content: "Contactez-nous dès aujourd'hui et laissez notre équipe d'experts s'occuper de tous les détails de votre voyage.", type: "text", category: "cta" },
        
        // À propos
        { id: 8, title: "Titre À propos", page: "À propos", content: "À propos de NASSER TRAVEL HORIZON", type: "text", category: "header" },
        { id: 9, title: "Sous-titre À propos", page: "À propos", content: "Votre partenaire de voyage de confiance au Tchad depuis 2015", type: "text", category: "header" },
        { id: 10, title: "Notre Histoire", page: "À propos", content: "Fondée en 2015, NASSER TRAVEL HORIZON est née de la passion de son fondateur pour les voyages et de sa volonté d'offrir aux Tchadiens un service de qualité internationale pour leurs déplacements.", type: "text", category: "history" },
        { id: 11, title: "Notre expérience", page: "À propos", content: "Au fil des années, nous avons développé des partenariats solides avec les principales compagnies aériennes et acteurs du tourisme mondial, nous permettant d'offrir à nos clients les meilleures options de voyage au meilleur prix.", type: "text", category: "history" },
        { id: 12, title: "Notre équipe", page: "À propos", content: "Notre équipe expérimentée a accompagné avec succès des milliers de voyageurs, aussi bien pour des déplacements professionnels que pour des voyages de loisirs ou familiaux.", type: "text", category: "team" },
        { id: 13, title: "Mot du Fondateur", page: "À propos", content: "\"Notre mission est simple : rendre le voyage accessible, agréable et sans stress pour tous les Tchadiens. Chaque client est unique et mérite un service personnalisé qui répond à ses besoins spécifiques. C'est cette philosophie qui guide notre travail quotidien.\"", type: "quote", category: "founder" },
        { id: 14, title: "Nom du Fondateur", page: "À propos", content: "Nasser Ibrahim, Fondateur & Directeur", type: "text", category: "founder" },
        { id: 15, title: "Photo du Fondateur", page: "À propos", content: "/placeholder.svg", type: "image", category: "founder" },
        
        // Galerie
        { id: 16, title: "Titre Galerie", page: "Galerie", content: "Notre Galerie", type: "text", category: "header" },
        { id: 17, title: "Sous-titre Galerie", page: "Galerie", content: "Découvrez des destinations de rêve et des moments inoubliables de nos clients", type: "text", category: "header" },
        
        // FAQ
        { id: 18, title: "Titre FAQ", page: "FAQ", content: "Questions fréquemment posées", type: "text", category: "header" },
        { id: 19, title: "Sous-titre FAQ", page: "FAQ", content: "Trouvez rapidement des réponses à vos questions sur nos services", type: "text", category: "header" },
        { id: 20, title: "Question 1", page: "FAQ", content: "Comment réserver un billet d'avion ?", type: "faq-question", category: "general" },
        { id: 21, title: "Réponse 1", page: "FAQ", content: "Vous pouvez réserver un billet d'avion directement sur notre site web, par téléphone, par WhatsApp ou en visitant notre agence à N'Djamena.", type: "faq-answer", category: "general" },
        
        // Mentions légales
        { id: 22, title: "Titre Mentions légales", page: "Mentions légales", content: "Mentions légales", type: "text", category: "header" },
        { id: 23, title: "Contenu Mentions légales", page: "Mentions légales", content: "NASSER TRAVEL HORIZON - SARL au capital de 5 000 000 FCFA\nSiège social : Avenue Charles de Gaulle, N'Djamena, Tchad\nRCS N'Djamena : 123456789\nDirecteur de la publication : M. Nasser\nHébergeur : OVH - 2 rue Kellermann - 59100 Roubaix - France", type: "legal", category: "legal" },
        
        // Politique de confidentialité
        { id: 24, title: "Titre Politique de confidentialité", page: "Politique de confidentialité", content: "Politique de confidentialité", type: "text", category: "header" },
        { id: 25, title: "Contenu Politique de confidentialité", page: "Politique de confidentialité", content: "Chez NASSER TRAVEL HORIZON, nous nous engageons à protéger et à respecter votre vie privée. Cette politique définit la base sur laquelle les données personnelles que nous collectons auprès de vous, ou que vous nous fournissez, seront traitées par nous.", type: "privacy", category: "legal" },
        
        // CGV
        { id: 26, title: "Titre CGV", page: "CGV", content: "Conditions Générales de Vente", type: "text", category: "header" },
        { id: 27, title: "Contenu CGV", page: "CGV", content: "Les présentes conditions générales de vente régissent les relations contractuelles entre la société NASSER TRAVEL HORIZON et ses clients, dans le cadre de son activité d'agence de voyage.", type: "terms", category: "legal" },
        
        // Informations globales
        { id: 28, title: "Logo", page: "Global", content: "/placeholder.svg", type: "logo", category: "header" },
        { id: 29, title: "Adresse", page: "Global", content: "Avenue Charles de Gaulle, N'Djamena, Tchad", type: "contact", category: "footer" },
        { id: 30, title: "Téléphone", page: "Global", content: "+235 66 38 69 37", type: "contact", category: "footer" },
        { id: 31, title: "Email", page: "Global", content: "contact@nassertravelhorizon.com", type: "contact", category: "footer" },
        { id: 32, title: "Heures d'ouverture", page: "Global", content: "Lundi: 08:00-18:00\nMardi: 08:00-18:00\nMercredi: 08:00-18:00\nJeudi: 08:00-18:00\nVendredi: 08:00-18:00\nSamedi: 09:00-13:00\nDimanche: Fermé", type: "hours", category: "footer" }
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
    const allowedPages = ['Accueil', 'Services', 'À propos', 'Galerie', 'FAQ', 'Mentions légales', 'Politique de confidentialité', 'CGV', 'Global'];
    
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
