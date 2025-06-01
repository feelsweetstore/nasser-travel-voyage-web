
import { ContentStorage } from './content/ContentStorage';
import { ContentInitializer } from './content/ContentInitializer';
import { ContentEventManager } from './content/ContentEventManager';
import { ContentFormatter } from './content/ContentFormatter';

/**
 * Service principal de gestion du contenu du site
 */
class ContentService {
  /**
   * Initialise le contenu par défaut si nécessaire
   */
  static initialize(): void {
    ContentInitializer.initialize();
  }
  
  /**
   * Récupère tout le contenu du site
   */
  static getContent(): any[] {
    this.initialize();
    return ContentStorage.getStoredContent();
  }
  
  /**
   * Récupère un élément de contenu spécifique
   */
  static getContentById(id: number): any | null {
    const content = this.getContent();
    return content.find(item => item.id === id) || null;
  }
  
  /**
   * Récupère le contenu pour une page spécifique
   */
  static getContentByPage(page: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.page === page || item.page === 'Global');
  }
  
  /**
   * Récupère le contenu par type et catégorie
   */
  static getContentByTypeAndCategory(type: string, category: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.type === type && item.category === category);
  }
  
  /**
   * Récupère le contenu par type
   */
  static getContentByType(type: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.type === type);
  }
  
  /**
   * Récupère le contenu par catégorie
   */
  static getContentByCategory(category: string): any[] {
    const content = this.getContent();
    return content.filter(item => item.category === category);
  }
  
  /**
   * Récupère le contenu du titre et sous-titre de la page d'accueil
   */
  static getHeroContent(): { title: string; subtitle: string } {
    const content = this.getContent();
    return ContentFormatter.getHeroContent(content);
  }
  
  /**
   * Ajoute un nouvel élément de contenu
   */
  static addContent(contentItem: any): any {
    const content = this.getContent();
    const newContentItem = {
      ...contentItem,
      id: content.length ? Math.max(...content.map(c => c.id)) + 1 : 1
    };
    
    const updatedContent = [...content, newContentItem];
    ContentStorage.saveContent(updatedContent);
    
    ContentEventManager.notifyContentChange('add', newContentItem);
    
    return newContentItem;
  }
  
  /**
   * Met à jour un élément de contenu
   */
  static updateContent(id: number, contentItem: any): any[] {
    const content = this.getContent();
    const updatedContent = content.map(item => 
      item.id === id ? { ...item, ...contentItem } : item
    );
    
    ContentStorage.saveContent(updatedContent);
    
    ContentEventManager.notifyContentChange('update', contentItem, id);
    
    return updatedContent;
  }
  
  /**
   * Supprime un élément de contenu
   */
  static deleteContent(id: number): any[] {
    const content = this.getContent();
    const updatedContent = content.filter(item => item.id !== id);
    
    ContentStorage.saveContent(updatedContent);
    
    ContentEventManager.notifyContentChange('delete', undefined, id);
    
    return updatedContent;
  }
  
  /**
   * Formate et récupère les heures d'ouverture
   */
  static getFormattedOpeningHours(): { weekdays: string, saturday: string, sunday: string } {
    const content = this.getContent();
    return ContentFormatter.getFormattedOpeningHours(content);
  }
}

export default ContentService;
