
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
      className="bg-white print:shadow-none"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* First page - Request Details */}
      <div className="page page-1 p-8 max-w-3xl mx-auto my-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
          <p className="text-lg font-medium mt-2">
            {request?.type === 'quote' ? 'Devis Personnalisé' : 'Confirmation de Réservation'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Date: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-[#00B0EA] border-b pb-2">Informations client</h2>
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
          <h2 className="text-lg font-semibold mb-3 text-[#00B0EA] border-b pb-2">Détails du voyage</h2>
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
      </div>
      
      {/* Second page - Response */}
      <div className="page page-2 p-8 max-w-3xl mx-auto my-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
          <p className="text-lg font-medium mt-2">Notre réponse</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-[#00B0EA] border-b pb-2">
            Objet: Votre devis pour un voyage vers {request?.destination} - NASSER TRAVEL HORIZON
          </h2>
          <div className="bg-gray-50 p-4 rounded whitespace-pre-line">
            <p className="mb-4"><strong>Cher(e) {request?.fullName},</strong></p>
            
            <p className="mb-4">
              Nous vous remercions pour votre demande de devis concernant votre voyage vers {request?.destination}, 
              du {request?.departureDate ? new Date(request.departureDate).toLocaleDateString() : 'N/A'} 
              au {request?.returnDate ? new Date(request.returnDate).toLocaleDateString() : 'N/A'}, 
              en classe {request?.travelClass === 'economy' ? 'Économique' : 
                      request?.travelClass === 'premium' ? 'Premium Economy' : 
                      request?.travelClass === 'business' ? 'Business' : 
                      request?.travelClass === 'first' ? 'Première classe' : 
                      request?.travelClass} pour {request?.passengers} passager(s).
            </p>
            
            <p className="mb-4"><strong>Voici notre proposition personnalisée :</strong></p>
            
            <div className="whitespace-pre-line">
              {response}
            </div>
            
            <p className="mt-4">
              Veuillez noter que les tarifs de vols sont flexibles et peuvent changer à tout moment. 
              Cependant, merci de bien vouloir nous confirmer votre accord afin de finaliser la réservation et 
              garantir la disponibilité au tarif indiqué.
            </p>
            
            <p className="mt-4">
              Si vous souhaitez modifier certaines informations (dates, classe, destination, etc.), n'hésitez 
              pas à nous le faire savoir.
            </p>
            
            <p className="mt-4">
              Cordialement,<br />
              L'équipe NASSER TRAVEL HORIZON<br />
              📞 Tél: +235 66 38 69 37<br />
              📧 Email: contact@nassertravelhorizon.com<br />
              📍 N'Djamena, Tchad
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-12 pt-6 border-t">
          <p>NASSER TRAVEL HORIZON</p>
          <p>Tél: +235 66 38 69 37 | Email: contact@nassertravelhorizon.com</p>
          <p>NDjamena, Tchad</p>
        </div>
      </div>
    </div>
  );
});

ResponsePDFTemplate.displayName = 'ResponsePDFTemplate';

export default ResponsePDFTemplate;
