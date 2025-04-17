
import React from 'react';
import ContentService from '../services/ContentService';

const PrivacyPolicy = () => {
  const content = ContentService.getContentByType('privacy');
  const privacyContent = content.find(item => item.category === 'legal');

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center">
          Politique de Confidentialité
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            {privacyContent ? (
              <div dangerouslySetInnerHTML={{ __html: privacyContent.content }} />
            ) : (
              <p>Contenu en cours de chargement...</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
