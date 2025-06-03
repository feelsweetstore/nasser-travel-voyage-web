
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Download, Send } from 'lucide-react';
import ContactPDFTemplate from '../pdf/ContactPDFTemplate';

interface ContactDetailsProps {
  activeContactMessage: any;
  onCloseContactDetails: () => void;
  onOpenContactResponseDialog: () => void;
  onContactPDFDownload: () => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  activeContactMessage,
  onCloseContactDetails,
  onOpenContactResponseDialog,
  onContactPDFDownload
}) => {
  if (!activeContactMessage) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Détails du message</CardTitle>
          <CardDescription>
            Sélectionnez un message pour voir les détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Veuillez sélectionner un message dans la liste</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Détails du message</CardTitle>
          <CardDescription>
            {`Message de ${activeContactMessage.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Informations expéditeur</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><strong>Nom:</strong> {activeContactMessage.name}</p>
                  <p><strong>Email:</strong> {activeContactMessage.email}</p>
                  {activeContactMessage.phone && <p><strong>Téléphone:</strong> {activeContactMessage.phone}</p>}
                  <p><strong>Date du message:</strong> {new Date(activeContactMessage.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Détails du message</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><strong>Objet:</strong> {activeContactMessage.subject || 'Sans objet'}</p>
                  <p className="mt-2"><strong>Message:</strong></p>
                  <p className="mt-1">{activeContactMessage.message}</p>
                </div>
              </div>
            </div>
            
            {activeContactMessage.response ? (
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Votre réponse</h3>
                  <Button variant="outline" size="sm" onClick={onContactPDFDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </div>
                <div className="bg-nasser-primary/5 border border-nasser-primary/20 p-4 rounded-md">
                  <p className="whitespace-pre-line">{activeContactMessage.response}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Envoyée le {new Date(activeContactMessage.responseDate).toLocaleDateString()} à {new Date(activeContactMessage.responseDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onCloseContactDetails}>
                  Fermer
                </Button>
                <Button onClick={onOpenContactResponseDialog}>
                  <Send className="h-4 w-4 mr-2" />
                  Répondre
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template PDF caché pour la génération */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <ContactPDFTemplate 
          contactMessage={activeContactMessage} 
          response={activeContactMessage?.response}
        />
      </div>
    </>
  );
};

export default ContactDetails;
