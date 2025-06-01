
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Send } from 'lucide-react';

interface RequestDetailsProps {
  activeRequest: any;
  onCloseDetails: () => void;
  onOpenResponseDialog: () => void;
  onGeneratePDF: () => void;
  onDirectPDFDownload: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({
  activeRequest,
  onCloseDetails,
  onOpenResponseDialog,
  onGeneratePDF,
  onDirectPDFDownload
}) => {
  if (!activeRequest) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Détails de la demande</CardTitle>
          <CardDescription>
            Sélectionnez une demande pour voir les détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Veuillez sélectionner une demande dans la liste</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Détails de la demande</CardTitle>
        <CardDescription>
          {`${activeRequest.type === 'quote' ? 'Demande de devis' : 'Réservation'} - ${activeRequest.fullName}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Informations client</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Nom:</strong> {activeRequest.fullName}</p>
                <p><strong>Email:</strong> {activeRequest.email}</p>
                <p><strong>Téléphone:</strong> {activeRequest.whatsapp || activeRequest.phone}</p>
                <p><strong>Date de demande:</strong> {new Date(activeRequest.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Détails du voyage</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Destination:</strong> {activeRequest.destination}</p>
                <p>
                  <strong>Date de départ:</strong> {activeRequest.departureDate ? new Date(activeRequest.departureDate).toLocaleDateString() : 'Non spécifiée'}
                </p>
                <p>
                  <strong>Date de retour:</strong> {activeRequest.returnDate ? new Date(activeRequest.returnDate).toLocaleDateString() : 'Non spécifiée'}
                </p>
                <p><strong>Nombre de passagers:</strong> {activeRequest.passengers}</p>
                <p><strong>Classe:</strong> {
                  activeRequest.travelClass === 'economy' ? 'Économique' :
                  activeRequest.travelClass === 'premium' ? 'Premium Economy' :
                  activeRequest.travelClass === 'business' ? 'Business' :
                  activeRequest.travelClass === 'first' ? 'Première classe' :
                  activeRequest.travelClass
                }</p>
                {activeRequest.type === 'quote' && activeRequest.budget && 
                  <p><strong>Budget estimé:</strong> {activeRequest.budget} FCFA</p>
                }
              </div>
            </div>
          </div>
          
          {activeRequest.message && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Message du client</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p>{activeRequest.message}</p>
              </div>
            </div>
          )}
          
          {activeRequest.response ? (
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Votre réponse</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onGeneratePDF}>
                    <Eye className="h-4 w-4 mr-2" />
                    Aperçu PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={onDirectPDFDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </div>
              </div>
              <div className="bg-nasser-primary/5 border border-nasser-primary/20 p-4 rounded-md">
                <p className="whitespace-pre-line">{activeRequest.response}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Envoyée le {new Date(activeRequest.responseDate).toLocaleDateString()} à {new Date(activeRequest.responseDate).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCloseDetails}>
                Fermer
              </Button>
              <Button onClick={onOpenResponseDialog}>
                <Send className="h-4 w-4 mr-2" />
                Répondre
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestDetails;
