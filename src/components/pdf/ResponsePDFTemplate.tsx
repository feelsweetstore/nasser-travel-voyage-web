
import React, { forwardRef } from 'react';

interface ResponsePDFProps {
  request: any;
  response: string;
}

const ResponsePDFTemplate = forwardRef<HTMLDivElement, ResponsePDFProps>(({ request, response }, ref) => {
  // Formater la date pour un affichage plus concis
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Non spécifiée';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Date invalide';
    }
  };

  // Obtenir la classe de voyage en français
  const getTravelClass = (travelClass: string | undefined): string => {
    if (!travelClass) return 'Non spécifiée';
    switch (travelClass) {
      case 'economy': return 'Économique';
      case 'premium': return 'Premium Economy';
      case 'business': return 'Business';
      case 'first': return 'Première classe';
      default: return travelClass;
    }
  };

  return (
    <div 
      ref={ref} 
      id="pdfTemplate" 
      className="bg-white print:shadow-none"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* First page - Request Details */}
      <div className="page page-1 p-8 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
          <p className="text-lg font-medium mt-1">
            {request?.type === 'quote' ? 'Devis Personnalisé' : 'Confirmation de Réservation'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Date: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-[#00B0EA] border-b pb-1">Informations client</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p><strong>Nom:</strong> {request?.fullName}</p>
              <p><strong>Email:</strong> {request?.email}</p>
              <p><strong>Téléphone:</strong> {request?.whatsapp || request?.phone || 'Non spécifié'}</p>
            </div>
            <div>
              <p><strong>Demande créée le:</strong> {formatDate(request?.createdAt)}</p>
              <p><strong>Référence:</strong> {request?.id}</p>
              <p><strong>Type:</strong> {request?.type === 'quote' ? 'Devis' : 'Réservation'}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-[#00B0EA] border-b pb-1">Détails du voyage</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p><strong>Destination:</strong> {request?.destination}</p>
              <p><strong>Date de départ:</strong> {formatDate(request?.departureDate)}</p>
              <p><strong>Date de retour:</strong> {formatDate(request?.returnDate)}</p>
            </div>
            <div>
              <p><strong>Passagers:</strong> {request?.passengers || '1'}</p>
              <p><strong>Classe:</strong> {getTravelClass(request?.travelClass)}</p>
              {request?.budget && <p><strong>Budget:</strong> {request.budget} FCFA</p>}
            </div>
          </div>
        </div>
        
        {request?.message && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-[#00B0EA] border-b pb-1">Message du client</h2>
            <p className="text-sm">{request.message}</p>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-500 mt-8 pt-2 border-t">
          <p>NASSER TRAVEL HORIZON</p>
          <p>Tél: +235 66 38 69 37 | Email: contact@nassertravelhorizon.com</p>
          <p>N'Djamena, Tchad</p>
        </div>
      </div>
      
      {/* Second page - Response */}
      <div className="page page-2 p-8 max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
          <p className="text-lg font-medium mt-1">Notre réponse</p>
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-[#00B0EA] border-b pb-1">
            Objet: {request?.type === 'quote' ? 'Devis pour' : 'Réservation pour'} {request?.destination} - NASSER TRAVEL HORIZON
          </h2>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p className="mb-3"><strong>Cher(e) {request?.fullName},</strong></p>
            
            <p className="mb-3">
              Nous vous remercions pour votre demande concernant votre voyage vers {request?.destination}, 
              du {formatDate(request?.departureDate)} 
              au {formatDate(request?.returnDate)}, 
              en classe {getTravelClass(request?.travelClass)} pour {request?.passengers || '1'} passager(s).
            </p>
            
            <div className="whitespace-pre-line text-sm mb-3">
              {response}
            </div>
            
            <p className="text-sm mb-3">
              Les tarifs de vols sont flexibles et peuvent changer. Merci de bien vouloir nous confirmer 
              votre accord rapidement pour garantir la disponibilité au tarif indiqué.
            </p>
            
            <p className="text-sm">
              Cordialement,<br />
              L'équipe NASSER TRAVEL HORIZON<br />
              📞 +235 66 38 69 37<br />
              📧 contact@nassertravelhorizon.com
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-4 pt-2 border-t">
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
