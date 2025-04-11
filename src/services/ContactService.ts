
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
      const defaultMessages: any[] = [];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultMessages));
    }
  }
  
  /**
   * Récupère tous les messages de contact
   * @returns Liste des messages
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
      id: messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      status: 'nouveau'
    };
    
    const updatedMessages = [...messages, newMessage];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
    return newMessage;
  }
  
  /**
   * Récupère un message spécifique
   * @param id - ID du message
   * @returns Le message ou null s'il n'existe pas
   */
  static getMessage(id: number): any | null {
    const messages = this.getMessages();
    return messages.find(message => message.id === id) || null;
  }
  
  /**
   * Met à jour un message existant
   * @param id - ID du message
   * @param updateData - Données de mise à jour
   * @returns Liste mise à jour des messages
   */
  static updateMessage(id: number, updateData: any): any[] {
    const messages = this.getMessages();
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, ...updateData } : message
    );
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
    return updatedMessages;
  }
  
  /**
   * Marque un message comme lu
   * @param id - ID du message
   * @returns Liste mise à jour des messages
   */
  static markAsRead(id: number): any[] {
    return this.updateMessage(id, { status: 'lu' });
  }
  
  /**
   * Supprime un message
   * @param id - ID du message à supprimer
   * @returns Liste mise à jour des messages
   */
  static deleteMessage(id: number): any[] {
    const messages = this.getMessages();
    const updatedMessages = messages.filter(message => message.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
    return updatedMessages;
  }
}

export default ContactService;
