
import React from 'react';
import ContentService from '../services/ContentService';

const TermsOfService = () => {
  const termsContent = ContentService.getContentByTypeAndCategory('terms', 'legal')[0]?.content || '';

  return (
    <main className="bg-white py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center">Conditions Générales de Vente</h1>
        <div className="prose max-w-none">
          {termsContent.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;
