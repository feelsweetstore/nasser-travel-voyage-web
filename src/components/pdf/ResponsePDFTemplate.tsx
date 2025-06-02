
import React, { forwardRef, useEffect } from 'react';

interface ResponsePDFProps {
  request: any;
  response: string;
}

const ResponsePDFTemplate = forwardRef<HTMLDivElement, ResponsePDFProps>(({ request, response }, ref) => {
  useEffect(() => {
    console.log("ResponsePDFTemplate rendu avec:", { 
      requestId: request?.id,
      responseLength: response?.length,
      hasRef: !!ref
    });
  }, [request, response, ref]);

  return (
    <div 
      ref={ref} 
      id="pdfTemplate" 
      className="bg-white print:shadow-none"
      style={{ 
        fontFamily: 'Arial, sans-serif', 
        width: '100%', 
        maxWidth: '800px', 
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* First page - Request Details */}
      <div className="page page-1 p-8 max-w-3xl mx-auto my-8" style={{ pageBreakAfter: 'always', backgroundColor: 'white', border: '1px solid #f0f0f0', minHeight: '800px' }}>
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
      
      {/* Second page - Response (contenu personnalisé uniquement) */}
      <div className="page page-2 p-8 max-w-3xl mx-auto my-8" style={{ backgroundColor: 'white', border: '1px solid #f0f0f0', minHeight: '800px' }}>
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
          <p className="text-lg font-medium mt-1">Notre réponse</p>
        </div>
        
        <div className="mb-6">
          <div className="bg-gray-50 p-3 rounded">
            {/* Contenu personnalisé uniquement - sans aucun texte automatique */}
            <div className="whitespace-pre-line" style={{ lineHeight: '1.5', wordBreak: 'break-word' }}>
              {response}
            </div>
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
