
import React from 'react';
import ContentService from '../services/ContentService';
import { Clock } from 'lucide-react';

const OpeningHours = () => {
  const content = ContentService.getContentByType('hours');
  const hoursContent = content.find(item => item.category === 'footer');

  const renderHours = (hours: string) => {
    return hours.split('\n').map((line, index) => (
      <div key={index} className="flex items-center space-x-2 py-2">
        <Clock className="h-5 w-5 text-nasser-primary" />
        <span>{line}</span>
      </div>
    ));
  };

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center">
          Heures d'Ouverture
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          {hoursContent ? (
            <div className="space-y-2">
              {renderHours(hoursContent.content)}
            </div>
          ) : (
            <p>Horaires en cours de chargement...</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default OpeningHours;
