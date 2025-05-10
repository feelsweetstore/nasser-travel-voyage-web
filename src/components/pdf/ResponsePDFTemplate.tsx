
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
          <p className="text-lg font-medium mt-2">
            {request?.type === 'quote' ? 'Devis Personnalisé' : 'Confirmation de Réservation'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Date: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div className="mb-5">
          <h2 className="text-lg font-semibold mb-2 text-[#00B0EA] border-b pb-2">Informations client</h2>
          <div className="grid grid-cols-2 gap-3">
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
        
        <div className="mb-5">
          <h2 className="text-lg font-semibold mb-2 text-[#00B0EA] border-b pb-2">Détails du voyage</h2>
          <div className="grid grid-cols-2 gap-3">
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
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
          <p className="text-lg font-medium mt-1">Notre réponse</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-2 text-[#00B0EA] border-b pb-1">
            Objet: Votre {request?.type === 'quote' ? 'devis' : 'réservation'} pour un voyage vers {request?.destination}
          </h2>
          <div className="bg-gray-50 p-3 rounded whitespace-pre-line text-sm">
            <p className="mb-3"><strong>Cher(e) {request?.fullName},</strong></p>
            
            <p className="mb-3">
              Nous vous remercions pour votre demande concernant votre voyage vers {request?.destination}, 
              du {request?.departureDate ? new Date(request.departureDate).toLocaleDateString() : 'N/A'} 
              au {request?.returnDate ? new Date(request.returnDate).toLocaleDateString() : 'N/A'}.
            </p>
            
            <div className="whitespace-pre-line">
              {response}
            </div>
            
            <div className="mt-3 space-y-1 text-sm">
              <p>
                <strong>Pour finaliser votre réservation :</strong>
              </p>
              <ul className="list-none pl-4 space-y-1">
                <li>✅ Confirmer votre accord par retour de message</li>
                <li>✅ Nous faire parvenir une copie de votre passeport</li>
                <li>✅ Procéder au paiement du montant indiqué ci-dessus</li>
              </ul>
            </div>
            
            <p className="mt-3 text-sm">
              Cordialement,<br />
              L'équipe NASSER TRAVEL HORIZON<br />
              📞 Tél: +235 66 38 69 37<br />
              📧 Email: contact@nassertravelhorizon.com<br />
            </p>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t">
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
