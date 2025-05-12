
import React from 'react';
import ResponseTemplateEditor from '../content/ResponseTemplateEditor';

const ResponseTemplatesTab = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Personnalisation des réponses</h2>
      <p className="text-gray-600 mb-4">
        Personnalisez les modèles de réponse qui seront utilisés pour répondre aux demandes 
        de devis et de réservation. Ces modèles seront utilisés pour générer les PDF de réponse.
      </p>
      <ResponseTemplateEditor />
    </div>
  );
};

export default ResponseTemplatesTab;
