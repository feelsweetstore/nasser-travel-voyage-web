
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import ContentService from '@/services/ContentService';

const ResponseTemplateEditor = () => {
  const [quoteTemplate, setQuoteTemplate] = useState('');
  const [bookingTemplate, setBookingTemplate] = useState('');
  const [activeTab, setActiveTab] = useState('quote');
  
  useEffect(() => {
    // Charger les modèles de réponse
    setQuoteTemplate(ContentService.getResponseTemplate('quote'));
    setBookingTemplate(ContentService.getResponseTemplate('booking'));
  }, []);
  
  const saveTemplate = (type: 'quote' | 'booking') => {
    try {
      const template = type === 'quote' ? quoteTemplate : bookingTemplate;
      ContentService.saveResponseTemplate(type, template);
      
      toast.success(
        `Le modèle pour les ${type === 'quote' ? 'devis' : 'réservations'} a été mis à jour.`,
        {
          description: "Vos modifications ont été enregistrées avec succès."
        }
      );
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du modèle:", error);
      toast.error(
        "Impossible d'enregistrer le modèle de réponse.",
        {
          description: "Une erreur est survenue. Veuillez réessayer."
        }
      );
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Personnalisation des réponses</CardTitle>
        <CardDescription>
          Modifiez les modèles de réponse pour les demandes de devis et réservations.
          Utilisez {'{destination}'} et {'{response}'} comme variables de remplacement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="quote"
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quote">Réponses aux devis</TabsTrigger>
            <TabsTrigger value="booking">Réponses aux réservations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quote" className="space-y-4">
            <div className="mt-4">
              <Textarea 
                value={quoteTemplate}
                onChange={(e) => setQuoteTemplate(e.target.value)}
                className="min-h-[300px]"
                placeholder="Modèle de réponse pour les devis..."
              />
            </div>
            <Button onClick={() => saveTemplate('quote')} className="mt-4">
              Enregistrer le modèle de devis
            </Button>
          </TabsContent>
          
          <TabsContent value="booking" className="space-y-4">
            <div className="mt-4">
              <Textarea 
                value={bookingTemplate}
                onChange={(e) => setBookingTemplate(e.target.value)}
                className="min-h-[300px]"
                placeholder="Modèle de réponse pour les réservations..."
              />
            </div>
            <Button onClick={() => saveTemplate('booking')} className="mt-4">
              Enregistrer le modèle de réservation
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResponseTemplateEditor;
