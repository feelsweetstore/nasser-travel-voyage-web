
import React from 'react';
import { Clock, CheckCircle, LockIcon } from 'lucide-react';

const OnlineReservation = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-dashed border-nasser-accent">
      <div className="relative mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-nasser-accent/20 text-nasser-accent rounded-full mx-auto">
          <Clock size={32} />
        </div>
        <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 badge-coming-soon py-1 px-3">
          Bientôt disponible
        </span>
      </div>
      
      <h3 className="text-2xl font-heading font-bold text-center mb-4">
        Réserver en ligne
      </h3>
      
      <p className="text-gray-600 text-center mb-8">
        Cette fonctionnalité vous permettra prochainement de réserver directement vos billets, 
        choisir votre vol, payer en ligne, et télécharger votre billet au format PDF sans intervention humaine.
      </p>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-start">
          <CheckCircle className="text-nasser-accent mr-3 mt-1 flex-shrink-0" size={20} />
          <p className="text-gray-600">Recherchez et comparez les vols en temps réel</p>
        </div>
        <div className="flex items-start">
          <CheckCircle className="text-nasser-accent mr-3 mt-1 flex-shrink-0" size={20} />
          <p className="text-gray-600">Réservez et payez en ligne de manière sécurisée</p>
        </div>
        <div className="flex items-start">
          <CheckCircle className="text-nasser-accent mr-3 mt-1 flex-shrink-0" size={20} />
          <p className="text-gray-600">Recevez votre billet électronique instantanément</p>
        </div>
        <div className="flex items-start">
          <CheckCircle className="text-nasser-accent mr-3 mt-1 flex-shrink-0" size={20} />
          <p className="text-gray-600">Gérez vos réservations depuis votre espace client</p>
        </div>
      </div>
      
      <div className="text-center">
        <button 
          disabled
          className="inline-flex items-center justify-center w-full bg-gray-300 text-gray-600 font-medium py-3 px-4 rounded-md cursor-not-allowed"
        >
          <LockIcon className="mr-2 h-5 w-5" />
          Fonctionnalité en développement
        </button>
        
        <p className="mt-4 text-sm text-gray-500 flex items-center justify-center">
          <LockIcon className="mr-2 h-4 w-4" />
          Nous travaillons activement sur cette fonctionnalité
        </p>
      </div>
    </div>
  );
};

export default OnlineReservation;
