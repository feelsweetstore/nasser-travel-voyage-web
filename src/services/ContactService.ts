
/**
 * Service de gestion des messages de contact
 */
class ContactService {
  private static STORAGE_KEY = 'contactMessages';
  
  /**
   * Initialise les messages par défaut si nécessaire
   */
  static initialize(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }
  
  /**
   * Récupère tous les messages de contact
   * @returns Liste des messages de contact
   */
  static getMessages(): any[] {
    this.initialize();
    const storedMessages = localStorage.getItem(this.STORAGE_KEY);
    return JSON.parse(storedMessages || '[]');
  }
  
  /**
   * Ajoute un nouveau message de contact
   * @param message - Message à ajouter
   * @returns Le message ajouté avec un ID
   */
  static addMessage(message: any): any {
    const messages = this.getMessages();
    const newMessage = {
      ...message,
      id: messages.length ? Math.max(...messages.map(msg => msg.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      status: "nouveau"
    };
    
    const updatedMessages = [...messages, newMessage];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
    return newMessage;
  }
  
  /**
   * Met à jour un message de contact
   * @param id - ID du message
   * @param updatedData - Nouvelles données
   * @returns Liste mise à jour des messages
   */
  static updateMessage(id: number, updatedData: any): any[] {
    const messages = this.getMessages();
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, ...updatedData } : msg
    );
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
    return updatedMessages;
  }
  
  /**
   * Supprime un message de contact
   * @param id - ID du message à supprimer
   * @returns Liste mise à jour des messages
   */
  static deleteMessage(id: number): any[] {
    const messages = this.getMessages();
    const updatedMessages = messages.filter(msg => msg.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
    return updatedMessages;
  }
  
  /**
   * Récupère un message de contact spécifique
   * @param id - ID du message
   * @returns Le message de contact ou null s'il n'existe pas
   */
  static getMessageById(id: number): any | null {
    const messages = this.getMessages();
    return messages.find(msg => msg.id === id) || null;
  }
  
  /**
   * Ajoute des exemples de messages pour la démo
   */
  static addDemoMessages(): void {
    const messages = this.getMessages();
    if (messages.length === 0) {
      const demoMessages = [
        {
          id: 1,
          name: "Jean Dupont",
          email: "jean.dupont@example.com",
          subject: "Renseignements sur les vols vers Paris",
          message: "Bonjour, j'aimerais avoir plus d'informations sur vos offres de vols vers Paris pour une famille de 4 personnes au mois d'août. Merci d'avance pour votre réponse.",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 jours avant
          status: "nouveau"
        },
        {
          id: 2,
          name: "Marie Lambert",
          email: "marie.lambert@example.com",
          subject: "Problème de paiement en ligne",
          message: "Bonjour, j'ai rencontré un problème lors du paiement en ligne pour ma réservation de billet vers Istanbul. Le paiement a été débité mais je n'ai pas reçu de confirmation. Pouvez-vous m'aider ?",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 jours avant
          status: "nouveau"
        },
        {
          id: 3,
          name: "Ahmed Ousmane",
          email: "ahmed.ousmane@example.com",
          subject: "Partenariat entreprise",
          message: "Bonjour, je représente la société XYZ et nous sommes intéressés par un partenariat pour les déplacements professionnels de nos employés. Pouvez-vous nous proposer une offre adaptée ? Merci.",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 jour avant
          status: "nouveau",
          response: "Cher M. Ousmane,\n\nNous vous remercions pour votre intérêt concernant un partenariat d'entreprise.\n\nNous serions ravis de vous proposer une offre sur mesure pour les déplacements professionnels de vos employés. Pouvez-vous nous préciser le nombre approximatif de voyages par an et les destinations les plus fréquentes ?\n\nJe reste à votre disposition pour organiser un rendez-vous et discuter plus en détail de vos besoins.\n\nCordialement,\nL'équipe NASSER TRAVEL HORIZON",
          responseDate: new Date().toISOString(),
          status: "traité"
        }
      ];
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoMessages));
    }
  }
}

// Ajouter des messages de démonstration
ContactService.addDemoMessages();

export default ContactService;
