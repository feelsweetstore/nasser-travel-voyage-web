
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ContentService from '../../../services/ContentService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ResponseTemplateEditor: React.FC = () => {
  const { toast } = useToast();
  const [quoteTemplate, setQuoteTemplate] = useState<string>(() => {
    const templates = ContentService.getContentByTypeAndCategory('response_template', 'quote');
    return templates.length > 0 ? templates[0].content : '';
  });
  
  const [bookingTemplate, setBookingTemplate] = useState<string>(() => {
    const templates = ContentService.getContentByTypeAndCategory('response_template', 'booking');
    return templates.length > 0 ? templates[0].content : '';
  });

  const saveTemplate = (type: 'quote' | 'booking') => {
    const template = type === 'quote' ? quoteTemplate : bookingTemplate;
    const templates = ContentService.getContentByTypeAndCategory('response_template', type);
    
    if (templates.length > 0) {
      ContentService.updateContent(templates[0].id, { content: template });
      toast({
        title: "Modèle de réponse mis à jour",
        description: "Le modèle a été enregistré avec succès.",
        variant: "default",
      });
    } else {
      ContentService.addContent({
        title: `Modèle de réponse pour ${type === 'quote' ? 'devis' : 'réservation'}`,
        page: 'Paramètres',
        content: template,
        type: 'response_template',
        category: type
      });
      toast({
        title: "Modèle de réponse créé",
        description: "Un nouveau modèle a été ajouté avec succès.",
        variant: "default",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#00B0EA] mb-4">Modèles de réponse</h2>
      
      <Tabs defaultValue="quote" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="quote">Réponses aux devis</TabsTrigger>
          <TabsTrigger value="booking">Réponses aux réservations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quote" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-2">
              Personnalisez le modèle de réponse pour les demandes de devis. Utilisez les variables suivantes :
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-4 mb-3">
              <li><code>{'{destination}'}</code> - Sera remplacé par la destination demandée</li>
              <li><code>{'{response}'}</code> - Sera remplacé par votre réponse spécifique</li>
            </ul>
          </div>
          
          <Textarea 
            value={quoteTemplate} 
            onChange={(e) => setQuoteTemplate(e.target.value)} 
            className="min-h-[300px] font-mono text-sm"
          />
          
          <Button onClick={() => saveTemplate('quote')} className="mt-2">
            Enregistrer le modèle de devis
          </Button>
        </TabsContent>
        
        <TabsContent value="booking" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-2">
              Personnalisez le modèle de réponse pour les demandes de réservation. Utilisez les variables suivantes :
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-4 mb-3">
              <li><code>{'{destination}'}</code> - Sera remplacé par la destination demandée</li>
              <li><code>{'{response}'}</code> - Sera remplacé par votre réponse spécifique</li>
            </ul>
          </div>
          
          <Textarea 
            value={bookingTemplate} 
            onChange={(e) => setBookingTemplate(e.target.value)} 
            className="min-h-[300px] font-mono text-sm"
          />
          
          <Button onClick={() => saveTemplate('booking')} className="mt-2">
            Enregistrer le modèle de réservation
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseTemplateEditor;
