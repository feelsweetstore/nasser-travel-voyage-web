
import { useEffect, useState } from 'react';
import ContentService, { ContentItem } from '../services/ContentService';

export function useContent(page: string, category?: string, type?: string) {
  const [content, setContent] = useState<ContentItem[]>([]);
  
  useEffect(() => {
    // Initialiser le service de contenu
    ContentService.initialize();
    
    // Récupérer le contenu en fonction des filtres
    let pageContent: ContentItem[] = [];
    
    if (category && type) {
      // Filtre par page, catégorie et type
      pageContent = ContentService.getContentByPage(page)
        .filter(item => item.category === category && item.type === type);
    } else if (category) {
      // Filtre par page et catégorie
      pageContent = ContentService.getContentByPage(page)
        .filter(item => item.category === category);
    } else if (type) {
      // Filtre par page et type
      pageContent = ContentService.getContentByPage(page)
        .filter(item => item.type === type);
    } else {
      // Récupère tout le contenu de la page
      pageContent = ContentService.getContentByPage(page);
    }
    
    setContent(pageContent);
  }, [page, category, type]);

  // Fonction utilitaire pour trouver un élément spécifique par titre
  const getItemByTitle = (title: string): ContentItem | undefined => {
    return content.find(item => item.title === title);
  };
  
  // Fonction pour obtenir le contenu d'un élément par titre
  const getContentByTitle = (title: string, defaultValue: string = ''): string => {
    const item = getItemByTitle(title);
    return item ? item.content : defaultValue;
  };

  return {
    content,
    getItemByTitle,
    getContentByTitle,
  };
}
