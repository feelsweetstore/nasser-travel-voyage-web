
import React, { useState, useEffect } from 'react';
import ContentService from '@/services/ContentService';

const LegalNotice = () => {
  const [content, setContent] = useState('');
  const [textStyle, setTextStyle] = useState({});
  
  useEffect(() => {
    // Mettre à jour le contenu au chargement
    updateContent();
    
    // Écouter les changements de contenu
    const handleContentUpdated = () => updateContent();
    window.addEventListener('contentUpdated', handleContentUpdated);
    
    // Nettoyage
    return () => window.removeEventListener('contentUpdated', handleContentUpdated);
  }, []);
  
  const updateContent = () => {
    const legalContent = ContentService.getContentByType('legal')[0]?.content || '';
    const { text, style } = ContentService.extractTextAndStyle(legalContent);
    setContent(text);
    setTextStyle(style);
  };

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">
          Mentions légales
        </h1>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <pre 
              className="whitespace-pre-line text-gray-700 font-sans"
              style={{
                fontFamily: textStyle.fontFamily,
                fontSize: textStyle.fontSize,
                fontWeight: textStyle.fontWeight,
                fontStyle: textStyle.fontStyle,
                textDecoration: textStyle.textDecoration,
                textAlign: textStyle.textAlign as any
              }}
            >
              {content}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LegalNotice;
