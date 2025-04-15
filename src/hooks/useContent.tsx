
import { useEffect, useState } from 'react';
import ContentService, { ContentItem } from '../services/ContentService';

export function useContent(page: string, category?: string, type?: string) {
  const [content, setContent] = useState<ContentItem[]>([]);
  
  useEffect(() => {
    ContentService.initialize();
    
    let pageContent: ContentItem[] = [];
    
    if (category && type) {
      pageContent = ContentService.getContentByPage(page)
        .filter(item => item.category === category && item.type === type);
    } else if (category) {
      pageContent = ContentService.getContentByPage(page)
        .filter(item => item.category === category);
    } else if (type) {
      pageContent = ContentService.getContentByPage(page)
        .filter(item => item.type === type);
    } else {
      pageContent = ContentService.getContentByPage(page);
    }
    
    setContent(pageContent);
  }, [page, category, type]);

  const getItemByTitle = (title: string): ContentItem | undefined => {
    return content.find(item => item.title === title);
  };
  
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
