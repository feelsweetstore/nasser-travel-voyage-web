
import React from 'react';
import ContentService from '@/services/ContentService';

const OpeningHours = () => {
  const hoursContent = ContentService.getContentByType('hours')[0]?.content || '';

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">
          Heures d'ouverture
        </h1>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <pre className="whitespace-pre-line text-lg text-gray-700 font-sans">
            {hoursContent}
          </pre>
        </div>
      </div>
    </main>
  );
};

export default OpeningHours;
