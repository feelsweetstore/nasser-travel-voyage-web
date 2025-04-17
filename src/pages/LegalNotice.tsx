
import React from 'react';
import ContentService from '../services/ContentService';

const LegalNotice = () => {
  const content = ContentService.getContentByType('legal');
  const legalContent = content.find(item => item.category === 'legal');

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center">
          Mentions Légales
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            {legalContent ? (
              <div dangerouslySetInnerHTML={{ __html: legalContent.content }} />
            ) : (
              <p>Contenu en cours de chargement...</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LegalNotice;
