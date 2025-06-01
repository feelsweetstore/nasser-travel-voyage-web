
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ResponseTemplateService from '../../services/ResponseTemplateService';

interface ResponseTemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResponseTemplateManager: React.FC<ResponseTemplateManagerProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [quoteTemplate, setQuoteTemplate] = useState('');
  const [reservationTemplate, setReservationTemplate] = useState('');
  const [activeTab, setActiveTab] = useState('quote');

  useEffect(() => {
    if (isOpen) {
      // Charger les modèles existants
      const templates = ResponseTemplateService.getTemplates();
      setQuoteTemplate(templates.quote || '');
      setReservationTemplate(templates.reservation || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      // Sauvegarder les deux modèles
      ResponseTemplateService.updateTemplate('quote', quoteTemplate);
      ResponseTemplateService.updateTemplate('reservation', reservationTemplate);
      
      toast({
        title: "Modèles mis à jour",
        description: "Les modèles de réponse ont été sauvegardés avec succès.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving templates:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des modèles.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des modèles de réponse</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quote">Modèle pour les devis</TabsTrigger>
              <TabsTrigger value="reservation">Modèle pour les réservations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quote" className="space-y-4">
              <div>
                <Label htmlFor="quote-template" className="text-sm font-medium">
                  Modèle de réponse pour les demandes de devis
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Variables disponibles : [DESTINATION], [NOM_CLIENT], [DATE_DEPART], [DATE_RETOUR], [PASSAGERS], [CLASSE], [BUDGET]
                </p>
                <Textarea
                  id="quote-template"
                  value={quoteTemplate}
                  onChange={(e) => setQuoteTemplate(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Saisissez votre modèle de réponse pour les devis..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="reservation" className="space-y-4">
              <div>
                <Label htmlFor="reservation-template" className="text-sm font-medium">
                  Modèle de réponse pour les demandes de réservation
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Variables disponibles : [DESTINATION], [NOM_CLIENT], [DATE_DEPART], [DATE_RETOUR], [PASSAGERS], [CLASSE]
                </p>
                <Textarea
                  id="reservation-template"
                  value={reservationTemplate}
                  onChange={(e) => setReservationTemplate(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Saisissez votre modèle de réponse pour les réservations..."
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder les modèles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResponseTemplateManager;
