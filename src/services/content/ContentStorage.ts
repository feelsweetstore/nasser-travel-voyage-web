
/**
 * Service de gestion du stockage du contenu
 */
export class ContentStorage {
  private static STORAGE_KEY = 'siteContent';
  
  /**
   * Récupère le contenu depuis localStorage
   */
  static getStoredContent(): any[] {
    const storedContent = localStorage.getItem(this.STORAGE_KEY);
    return JSON.parse(storedContent || '[]');
  }
  
  /**
   * Sauvegarde le contenu dans localStorage
   */
  static saveContent(content: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(content));
  }
  
  /**
   * Vérifie si le contenu existe dans localStorage
   */
  static hasStoredContent(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}
