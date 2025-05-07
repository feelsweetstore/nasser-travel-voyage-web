
import React, { useState, useEffect } from 'react';
import ContentService from '@/services/ContentService';

interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
}

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontFamily: 'Arial',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left'
  });
  
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
    const privacyContent = ContentService.getContentByType('privacy')[0]?.content || '';
    const { text, style } = ContentService.extractTextAndStyle(privacyContent);
    
    // Process any inline styling tags
    const processedText = ContentService.processInlineStyles(text);
    
    setContent(processedText);
    setTextStyle(style);
  };

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">
          Politique de confidentialité
        </h1>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 font-sans whitespace-pre-line"
              style={{
                fontFamily: textStyle.fontFamily,
                fontSize: textStyle.fontSize,
                fontWeight: textStyle.fontWeight,
                fontStyle: textStyle.fontStyle,
                textDecoration: textStyle.textDecoration,
                textAlign: textStyle.textAlign as any
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
