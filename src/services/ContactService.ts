
/**
 * Service de gestion des messages de contact
 */
class ContactService {
  private static STORAGE_KEY = 'contactMessages';
  
  /**
   * Récupère tous les messages de contact
   * @returns Liste des messages de contact
   */
  static getMessages(): any[] {
    const storedMessages = localStorage.getItem(this.STORAGE_KEY);
    if (!storedMessages) return [];
    return JSON.parse(storedMessages);
  }
  
  /**
   * Ajoute un nouveau message de contact
   * @param message - Le message à ajouter
   * @returns Le message ajouté avec un ID
   */
  static addMessage(message: any): any {
    const messages = this.getMessages();
    const newMessage = {
      ...message,
      id: messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1,
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
   * @param messageData - Nouvelles données
   * @returns Liste mise à jour des messages
   */
  static updateMessage(id: number, messageData: any): any[] {
    const messages = this.getMessages();
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, ...messageData } : message
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
    const updatedMessages = messages.filter(message => message.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
    return updatedMessages;
  }
}

export default ContactService;
