
import React from 'react';
import ContentService from '../services/ContentService';

const LegalNotice = () => {
  const legalContent = ContentService.getContentByTypeAndCategory('legal', 'legal')[0]?.content || '';

  return (
    <main className="bg-white py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center">Mentions légales</h1>
        <div className="prose max-w-none">
          {legalContent.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LegalNotice;
