
import React from 'react';
import ContentService from '@/services/ContentService';

const LegalNotice = () => {
  const legalContent = ContentService.getContentByType('legal')[0]?.content || '';

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">
          Mentions légales
        </h1>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <pre className="whitespace-pre-line text-gray-700">
              {legalContent}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LegalNotice;
