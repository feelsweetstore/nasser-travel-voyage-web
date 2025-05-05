
import React, { useState, useEffect } from 'react';
import ContentService from '@/services/ContentService';

const OpeningHours = () => {
  const [hoursContent, setHoursContent] = useState('');

  useEffect(() => {
    // Récupération initiale
    updateHoursContent();
    
    // Écouter les événements de mise à jour du contenu
    const handleContentUpdate = () => {
      updateHoursContent();
    };
    
    window.addEventListener('contentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, []);
  
  // Fonction pour mettre à jour les heures d'ouverture
  const updateHoursContent = () => {
    const content = ContentService.getContentByType('hours')[0]?.content || '';
    setHoursContent(content);
  };

  return (
    <main className="bg-nasser-light py-16 font-[Arial]">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">
          Heures d'ouverture
        </h1>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <pre className="whitespace-pre-line text-lg text-gray-700">
            {hoursContent}
          </pre>
        </div>
      </div>
    </main>
  );
};

export default OpeningHours;
