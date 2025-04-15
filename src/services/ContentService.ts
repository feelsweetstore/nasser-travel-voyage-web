
export interface ContentItem {
  id: number;
  title: string;
  page: string;
  content: string;
  type: string;
  category: string;
}

class ContentService {
  private static STORAGE_KEY = 'siteContent';
  
  static initialize(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const defaultContent = [
        // Logo du site (Global)
        { 
          id: 1, 
          title: "Logo du site", 
          page: "Global", 
          content: "/placeholder.svg", 
          type: "logo", 
          category: "header" 
        },
        
        // Page d'accueil
        { 
          id: 2, 
          title: "Titre principal", 
          page: "Accueil", 
          content: "Bienvenue chez NASSER TRAVEL HORIZON", 
          type: "text", 
          category: "hero" 
        },
        { 
          id: 3, 
          title: "Sous-titre", 
          page: "Accueil", 
          content: "Votre partenaire de confiance pour tous vos voyages au départ du Tchad et partout dans le monde.", 
          type: "text", 
          category: "hero" 
        },
        { 
          id: 4, 
          title: "Image de fond", 
          page: "Accueil", 
          content: "/lovable-uploads/0acf3f82-7efa-40da-8002-87c0518ed21e.png", 
          type: "background", 
          category: "hero" 
        }
      ];
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultContent));
    }
  }

  static getContent(): ContentItem[] {
    this.initialize();
    const storedContent = localStorage.getItem(this.STORAGE_KEY);
    return JSON.parse(storedContent || '[]');
  }

  static getContentById(id: number): ContentItem | null {
    const content = this.getContent();
    return content.find(item => item.id === id) || null;
  }

  static getContentByPage(page: string): ContentItem[] {
    const content = this.getContent();
    return content.filter(item => item.page === page || item.page === 'Global');
  }

  static addContent(contentItem: Partial<ContentItem>): ContentItem {
    const content = this.getContent();
    const newContentItem = {
      ...contentItem,
      id: content.length ? Math.max(...content.map(c => c.id)) + 1 : 1
    } as ContentItem;
    
    const updatedContent = [...content, newContentItem];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedContent));
    return newContentItem;
  }

  static updateContent(id: number, contentItem: Partial<ContentItem>): ContentItem[] {
    const content = this.getContent();
    const updatedContent = content.map(item => 
      item.id === id ? { ...item, ...contentItem } : item
    );
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedContent));
    return updatedContent;
  }

  static deleteContent(id: number): ContentItem[] {
    const content = this.getContent();
    const updatedContent = content.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedContent));
    return updatedContent;
  }

  static getEditableContent(): ContentItem[] {
    return this.getContent();
  }
}

export default ContentService;
