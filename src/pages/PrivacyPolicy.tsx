
import React from 'react';
import ContentService from '@/services/ContentService';

const PrivacyPolicy = () => {
  const privacyContent = ContentService.getContentByType('privacy')[0]?.content || '';

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">
          Politique de confidentialité
        </h1>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: privacyContent }} 
              style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }} 
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
