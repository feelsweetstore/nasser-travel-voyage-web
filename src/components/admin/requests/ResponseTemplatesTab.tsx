
import React from 'react';
import ResponseTemplateEditor from '@/components/admin/content/ResponseTemplateEditor';

const ResponseTemplatesTab = () => {
  return (
    <div className="w-full py-4">
      <h2 className="text-2xl font-bold mb-4">Modèles de réponse</h2>
      <p className="text-muted-foreground mb-6">
        Personnalisez les réponses automatiques pour les demandes de devis et de réservations.
      </p>
      
      <ResponseTemplateEditor />
    </div>
  );
};

export default ResponseTemplatesTab;
