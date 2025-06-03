
import React, { forwardRef, useEffect } from 'react';

interface ContactPDFProps {
  contactMessage: any;
  response?: string;
}

const ContactPDFTemplate = forwardRef<HTMLDivElement, ContactPDFProps>(({ contactMessage, response }, ref) => {
  useEffect(() => {
    console.log("ContactPDFTemplate rendu avec:", { 
      messageId: contactMessage?.id,
      responseLength: response?.length,
      hasRef: !!ref
    });
  }, [contactMessage, response, ref]);

  return (
    <div 
      ref={ref} 
      id="contactPdfTemplate" 
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
      {/* First page - Contact Message */}
      <div className="page page-1 p-8 max-w-3xl mx-auto my-8" style={{ pageBreakAfter: 'always', backgroundColor: 'white', border: '1px solid #f0f0f0', minHeight: '800px' }}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
          <p className="text-lg font-medium mt-2">Message de Contact</p>
          <p className="text-sm text-gray-500 mt-1">
            Date: {new Date(contactMessage?.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mb-5">
          <h2 className="text-lg font-semibold mb-2 text-[#00B0EA] border-b pb-2">Informations expéditeur</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p><strong>Nom:</strong> {contactMessage?.name}</p>
              <p><strong>Email:</strong> {contactMessage?.email}</p>
              {contactMessage?.phone && <p><strong>Téléphone:</strong> {contactMessage.phone}</p>}
            </div>
            <div>
              <p><strong>Date du message:</strong> {new Date(contactMessage?.createdAt).toLocaleDateString()}</p>
              <p><strong>Référence:</strong> #{contactMessage?.id}</p>
              <p><strong>Statut:</strong> {contactMessage?.status}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-5">
          <h2 className="text-lg font-semibold mb-2 text-[#00B0EA] border-b pb-2">Message</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p><strong>Objet:</strong> {contactMessage?.subject || 'Sans objet'}</p>
            <p className="mt-2"><strong>Message:</strong></p>
            <p className="mt-1 whitespace-pre-line">{contactMessage?.message}</p>
          </div>
        </div>
      </div>
      
      {/* Second page - Response (if exists) */}
      {response && (
        <div className="page page-2 p-8 max-w-3xl mx-auto my-8" style={{ backgroundColor: 'white', border: '1px solid #f0f0f0', minHeight: '800px' }}>
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-[#00B0EA]">NASSER TRAVEL HORIZON</h1>
            <p className="text-lg font-medium mt-1">Notre réponse</p>
          </div>
          
          <div className="mb-6">
            <div className="bg-gray-50 p-3 rounded">
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
      )}
    </div>
  );
});

ContactPDFTemplate.displayName = 'ContactPDFTemplate';

export default ContactPDFTemplate;
