
import React, { forwardRef } from 'react';

interface ResponsePDFProps {
  request: any;
  response: string;
}

const ResponsePDFTemplate = forwardRef<HTMLDivElement, ResponsePDFProps>(({ request, response }, ref) => {
  return (
    <div 
      ref={ref} 
      id="pdfTemplate" 
      className="bg-white p-8 max-w-3xl mx-auto my-8 shadow-lg print:shadow-none"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-nasser-primary">NASSER TRAVEL HORIZON</h1>
        <p className="text-lg font-medium mt-2">
          {request?.type === 'quote' ? 'Devis Personnalisé' : 'Confirmation de Réservation'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Date: {new Date().toLocaleDateString()}
        </p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-nasser-primary border-b pb-2">Informations client</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Nom:</strong> {request?.fullName}</p>
            <p><strong>Email:</strong> {request?.email}</p>
            <p><strong>Téléphone:</strong> {request?.whatsapp || request?.phone || 'Non spécifié'}</p>
          </div>
          <div>
            <p><strong>Demande créée le:</strong> {request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Référence:</strong> {request?.id}</p>
            <p><strong>Type:</strong> {request?.type === 'quote' ? 'Devis' : 'Réservation'}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-nasser-primary border-b pb-2">Détails du voyage</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Destination:</strong> {request?.destination}</p>
            <p>
              <strong>Date de départ:</strong> {request?.departureDate ? new Date(request.departureDate).toLocaleDateString() : 'Non spécifiée'}
            </p>
            <p>
              <strong>Date de retour:</strong> {request?.returnDate ? new Date(request.returnDate).toLocaleDateString() : 'Non spécifiée'}
            </p>
          </div>
          <div>
            <p><strong>Nombre de passagers:</strong> {request?.passengers}</p>
            <p><strong>Classe:</strong> {
              request?.travelClass === 'economy' ? 'Économique' :
              request?.travelClass === 'premium' ? 'Premium Economy' :
              request?.travelClass === 'business' ? 'Business' :
              request?.travelClass === 'first' ? 'Première classe' :
              request?.travelClass
            }</p>
            {request?.budget && <p><strong>Budget estimé:</strong> {request.budget} FCFA</p>}
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-nasser-primary border-b pb-2">Notre réponse</h2>
        <div className="bg-gray-50 p-4 rounded whitespace-pre-line">
          {response}
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t">
        <p>NASSER TRAVEL HORIZON</p>
        <p>Tél: +235 66 38 69 37 | Email: contact@nassertravelhorizon.com</p>
        <p>NDjamena, Tchad</p>
      </div>
    </div>
  );
});

ResponsePDFTemplate.displayName = 'ResponsePDFTemplate';

export default ResponsePDFTemplate;
