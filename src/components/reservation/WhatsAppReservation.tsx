
import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import ContentService from '@/services/ContentService';

const WhatsAppReservation = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: "+23566000000"
  });

  useEffect(() => {
    // Récupération initiale
    updateContactInfo();
    
    // Écouter les événements de mise à jour du contenu
    const handleContentUpdate = () => {
      updateContactInfo();
    };
    
    window.addEventListener('contentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, []);

  // Fonction pour mettre à jour les coordonnées depuis ContentService
  const updateContactInfo = () => {
    const contactContent = ContentService.getContentByType('contact')[0]?.content || '';
    const contactLines = contactContent.split('\n');
    
    const phoneLine = contactLines.find(line => line.startsWith('Téléphone:'))?.replace('Téléphone:', '').trim() || '';
    const phone = phoneLine.split(',')[0]?.trim() || '+235 66 00 00 00';
    
    setContactInfo({ phone });
  };

  const message = encodeURIComponent(
    "Bonjour, je souhaite réserver un billet d'avion via NASSER TRAVEL HORIZON."
  );
  const whatsappLink = `https://wa.me/${contactInfo.phone.replace(/\s/g, '').replace('+', '')}?text=${message}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <div className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mx-auto mb-6">
        <MessageSquare size={32} />
      </div>
      
      <h3 className="text-2xl font-heading font-bold text-center mb-4">
        Réservation via WhatsApp
      </h3>
      
      <p className="text-gray-600 text-center mb-6">
        Préférez-vous une conversation directe ? Contactez-nous via WhatsApp pour un traitement rapide de votre demande de réservation.
      </p>
      
      <div className="text-center mb-6">
        <p className="font-medium text-lg mb-1">Notre numéro WhatsApp :</p>
        <a 
          href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
          className="text-xl font-bold text-green-600 hover:underline"
        >
          {contactInfo.phone}
        </a>
      </div>
      
      <div className="text-center">
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Contacter via WhatsApp <ArrowRight className="ml-2 h-5 w-5" />
        </a>
        
        <p className="mt-4 text-sm text-gray-500">
          Réponse généralement en moins de 30 minutes durant nos heures d'ouverture.
        </p>
      </div>
    </div>
  );
};

export default WhatsAppReservation;
