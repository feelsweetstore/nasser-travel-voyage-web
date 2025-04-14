
import { useState, useEffect } from 'react';
import ContentService, { ContentItem } from '../services/ContentService';

export const useContent = (page: string) => {
  const [content, setContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    const pageContent = ContentService.getContentByPage(page);
    setContent(pageContent);
  }, [page]);

  const getContentByType = (type: string, category: string) => {
    return content.find(item => item.type === type && item.category === category);
  };

  const getContentsByCategory = (category: string) => {
    return content.filter(item => item.category === category);
  };

  return {
    content,
    getContentByType,
    getContentsByCategory
  };
};
