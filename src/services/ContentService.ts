
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
        
        // Contenu pour la page d'accueil (HeroSection)
        { id: 11, title: "Titre de la page d'accueil", page: "Accueil", content: "Bienvenue chez NASSER TRAVEL HORIZON", type: "text", category: "hero" },
        { id: 12, title: "Sous-titre de la page d'accueil", page: "Accueil", content: "Votre partenaire de confiance pour tous vos voyages au départ du Tchad et partout dans le monde.", type: "text", category: "hero" },
        
        // Contenu pour la page À propos
        { id: 13, title: "Titre À propos", page: "À propos", content: "À propos de NASSER TRAVEL HORIZON", type: "text", category: "header" },
        { id: 14, title: "Sous-titre À propos", page: "À propos", content: "Votre partenaire de voyage de confiance au Tchad depuis 2015", type: "text", category: "header" },
        { id: 15, title: "Notre Histoire", page: "À propos", content: "Fondée en 2015, NASSER TRAVEL HORIZON est née de la passion de son fondateur pour les voyages et de sa volonté d'offrir aux Tchadiens un service de qualité internationale pour leurs déplacements.", type: "text", category: "history" },
        { id: 16, title: "Notre expérience", page: "À propos", content: "Au fil des années, nous avons développé des partenariats solides avec les principales compagnies aériennes et acteurs du tourisme mondial, nous permettant d'offrir à nos clients les meilleures options de voyage au meilleur prix.", type: "text", category: "history" },
        { id: 17, title: "Notre équipe", page: "À propos", content: "Notre équipe expérimentée a accompagné avec succès des milliers de voyageurs, aussi bien pour des déplacements professionnels que pour des voyages de loisirs ou familiaux.", type: "text", category: "team" },
        
        // Contenu pour la section "Mot du Fondateur"
        { id: 18, title: "Mot du Fondateur", page: "À propos", content: "\"Notre mission est simple : rendre le voyage accessible, agréable et sans stress pour tous les Tchadiens. Chaque client est unique et mérite un service personnalisé qui répond à ses besoins spécifiques. C'est cette philosophie qui guide notre travail quotidien.\"", type: "quote", category: "founder" },
        { id: 19, title: "Nom du Fondateur", page: "À propos", content: "Nasser Ibrahim, Fondateur & Directeur", type: "text", category: "founder" },
        { id: 20, title: "Photo du Fondateur", page: "À propos", content: "/placeholder.svg", type: "image", category: "founder" },
        
        // Contenu pour la section "Valeurs"
        { id: 21, title: "Notre Mission", page: "À propos", content: "Faciliter les voyages nationaux et internationaux pour les Tchadiens en offrant un service complet, personnalisé et accessible.", type: "text", category: "values" },
        { id: 22, title: "Notre Engagement", page: "À propos", content: "Devenir la référence en matière d'agence de voyage au Tchad et en Afrique centrale, reconnue pour son excellence et son innovation.", type: "text", category: "values" },
        { id: 23, title: "Nos Valeurs", page: "À propos", content: "Intégrité, excellence du service, innovation et écoute client sont les valeurs qui guident chacune de nos actions.", type: "text", category: "values" },
        
        // Contenu pour la section "Pourquoi nous faire confiance"
        { id: 24, title: "Garantie de service", page: "À propos", content: "Nous nous engageons à vous offrir le meilleur service possible, avec des garanties claires sur nos prestations.", type: "text", category: "trust" },
        { id: 25, title: "Support client 24/7", page: "À propos", content: "Notre équipe est disponible à tout moment pour répondre à vos questions et résoudre vos problèmes pendant vos voyages.", type: "text", category: "trust" },
        { id: 26, title: "Tarifs compétitifs", page: "À propos", content: "Nos partenariats avec les compagnies aériennes nous permettent d'offrir des prix avantageux sans compromettre sur la qualité.", type: "text", category: "trust" },
        { id: 27, title: "Expertise locale et internationale", page: "À propos", content: "Notre équipe combine une profonde connaissance du marché tchadien avec une expertise des voyages internationaux.", type: "text", category: "trust" },
        
        // Contenu pour la page Galerie
        { id: 28, title: "Titre Galerie", page: "Galerie", content: "Notre Galerie", type: "text", category: "header" },
        { id: 29, title: "Sous-titre Galerie", page: "Galerie", content: "Découvrez des destinations de rêve et des moments inoubliables de nos clients", type: "text", category: "header" },
        
        // Images de la galerie
        { id: 30, title: "Image Galerie 1", page: "Galerie", content: "/placeholder.svg", type: "image", category: "gallery" },
        { id: 31, title: "Image Galerie 2", page: "Galerie", content: "/placeholder.svg", type: "image", category: "gallery" },
        { id: 32, title: "Image Galerie 3", page: "Galerie", content: "/placeholder.svg", type: "image", category: "gallery" },
        { id: 33, title: "Image Galerie 4", page: "Galerie", content: "/placeholder.svg", type: "image", category: "gallery" },
        { id: 34, title: "Image Galerie 5", page: "Galerie", content: "/placeholder.svg", type: "image", category: "gallery" },
        { id: 35, title: "Image Galerie 6", page: "Galerie", content: "/placeholder.svg", type: "image", category: "gallery" },
        { id: 36, title: "Image Galerie 7", page: "Galerie", content: "/placeholder.svg", type: "image", category: "gallery" },
        { id: 37, title: "Image Galerie 8", page: "Galerie", content: "/placeholder.svg", type: "image", category: "gallery" },
        
        // Contenu pour la page FAQ
        { id: 38, title: "Titre FAQ", page: "FAQ", content: "Questions générales", type: "text", category: "header" },
        { id: 39, title: "Sous-titre FAQ", page: "FAQ", content: "Réservation, documents, billets...", type: "text", category: "header" },
        
        // Questions générales
        { id: 40, title: "FAQ - Question 1", page: "FAQ", content: "Comment réserver un billet d'avion avec NASSER TRAVEL HORIZON ?", type: "faq-question", category: "general" },
        { id: 41, title: "FAQ - Réponse 1", page: "FAQ", content: "Vous pouvez réserver un billet d'avion de plusieurs façons : en ligne via notre site web, par téléphone au +235 66 00 00 00, par WhatsApp ou en vous rendant directement à notre agence à N'Djamena. Nous aurons besoin de vos informations personnelles (comme indiqué sur votre passeport), vos dates de voyage et votre destination.", type: "faq-answer", category: "general" },
        { id: 42, title: "FAQ - Question 2", page: "FAQ", content: "Quels documents dois-je fournir pour une réservation ?", type: "faq-question", category: "general" },
        { id: 43, title: "FAQ - Réponse 2", page: "FAQ", content: "Pour réserver un vol, vous aurez besoin de fournir une copie de votre passeport (qui doit être valide au moins 6 mois après la date de retour prévue). Pour certaines destinations, vous pourriez avoir besoin d'un visa, d'un carnet de vaccination ou d'autres documents spécifiques. Notre équipe vous guidera sur les exigences précises pour votre destination.", type: "faq-answer", category: "general" },
        { id: 44, title: "FAQ - Question 3", page: "FAQ", content: "Combien de temps faut-il pour recevoir mon billet après réservation ?", type: "faq-question", category: "general" },
        { id: 45, title: "FAQ - Réponse 3", page: "FAQ", content: "Après confirmation du paiement, vous recevrez généralement votre billet électronique dans les 24 heures par email. Pour les cas urgents, nous pouvons accélérer le processus. N'hésitez pas à nous contacter si vous ne recevez pas votre billet dans ce délai.", type: "faq-answer", category: "general" },
        
        // Questions sur le paiement
        { id: 46, title: "FAQ - Titre Paiement", page: "FAQ", content: "Paiement", type: "text", category: "payment" },
        { id: 47, title: "FAQ - Question Paiement 1", page: "FAQ", content: "Quels sont les moyens de paiement acceptés ?", type: "faq-question", category: "payment" },
        { id: 48, title: "FAQ - Réponse Paiement 1", page: "FAQ", content: "Nous acceptons plusieurs modes de paiement : espèces, cartes bancaires (Visa, Mastercard), virements bancaires, et paiements mobiles (Orange Money, Airtel Money). Pour les réservations en ligne, les paiements par carte bancaire et mobile sont privilégiés pour plus de rapidité.", type: "faq-answer", category: "payment" },
        { id: 49, title: "FAQ - Question Paiement 2", page: "FAQ", content: "Puis-je payer en plusieurs fois ?", type: "faq-question", category: "payment" },
        { id: 50, title: "FAQ - Réponse Paiement 2", page: "FAQ", content: "Oui, pour certaines réservations, nous proposons des options de paiement échelonné. Cela dépend du montant total et de la date de voyage. Contactez notre équipe pour discuter des possibilités disponibles pour votre situation spécifique.", type: "faq-answer", category: "payment" },
        
        // Questions sur les annulations
        { id: 51, title: "FAQ - Titre Annulations", page: "FAQ", content: "Annulations et modifications", type: "text", category: "cancellation" },
        { id: 52, title: "FAQ - Question Annulation 1", page: "FAQ", content: "Puis-je annuler ou modifier ma réservation ?", type: "faq-question", category: "cancellation" },
        { id: 53, title: "FAQ - Réponse Annulation 1", page: "FAQ", content: "Oui, vous pouvez modifier ou annuler votre réservation, mais les conditions dépendent de la compagnie aérienne et du type de billet que vous avez acheté. Certains billets sont non remboursables ou modifiables avec des frais. Contactez-nous dès que possible si vous avez besoin de faire des changements.", type: "faq-answer", category: "cancellation" },
        
        // Questions sur les services additionnels
        { id: 54, title: "FAQ - Titre Services", page: "FAQ", content: "Services additionnels", type: "text", category: "services" },
        { id: 55, title: "FAQ - Question Services 1", page: "FAQ", content: "Proposez-vous une assistance pour les demandes de visa ?", type: "faq-question", category: "services" },
        { id: 56, title: "FAQ - Réponse Services 1", page: "FAQ", content: "Oui, nous offrons un service complet d'accompagnement pour les demandes de visa. Notre équipe vous assistera dans la préparation de votre dossier, la vérification des documents et, dans certains cas, la prise de rendez-vous à l'ambassade. Ce service est disponible moyennant des frais supplémentaires qui varient selon la destination.", type: "faq-answer", category: "services" },
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
    this.saveContent(updatedContent);
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
    
    this.saveContent(updatedContent);
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
    
    this.saveContent(updatedContent);
    return updatedContent;
  }

  /**
   * Sauvegarde le contenu et déclenche un événement de stockage
   * @param content - Contenu à sauvegarder
   */
  private static saveContent(content: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(content));
    
    // Déclenche un événement storage pour informer les autres onglets/composants
    // qu'une modification a été effectuée
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
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

  /**
   * Récupère le contenu spécifique par page, type et catégorie
   * @param page - Nom de la page
   * @param type - Type de contenu
   * @param category - Catégorie
   * @returns Premier élément correspondant ou null
   */
  static getContentByPageTypeCategory(page: string, type: string, category: string): ContentItem | null {
    const allContent = this.getContent();
    // D'abord rechercher le contenu spécifique à la page
    let content = allContent.find(item => 
      item.page === page && item.type === type && item.category === category
    );
    
    // Si aucun contenu spécifique n'est trouvé, chercher dans le contenu global
    if (!content) {
      content = allContent.find(item => 
        item.page === 'Global' && item.type === type && item.category === category
      );
    }
    
    return content || null;
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
