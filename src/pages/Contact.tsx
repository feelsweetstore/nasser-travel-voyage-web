
import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';
import ContentService from '../services/ContentService';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    // Charger les informations de contact
    const info = ContentService.getContactInfo();
    setContactInfo(info);
  }, []);

  return (
    <main className="bg-white py-10">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Contactez-nous</h1>
          <p className="text-gray-600">Nous sommes à votre écoute pour toute question ou demande</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg h-full">
              <h2 className="text-xl font-bold mb-6">Nos coordonnées</h2>
              
              <div className="space-y-6">
                {contactInfo?.address && (
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <MapPin className="h-5 w-5 text-nasser-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">Adresse</h3>
                      <p className="mt-1 text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
                
                {contactInfo?.phone && (
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <Phone className="h-5 w-5 text-nasser-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">Téléphone</h3>
                      <p className="mt-1 text-gray-600">{contactInfo.phone}</p>
                      {contactInfo?.whatsapp && (
                        <p className="mt-1 text-gray-600">WhatsApp: {contactInfo.whatsapp}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {contactInfo?.email && (
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <Mail className="h-5 w-5 text-nasser-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">Email</h3>
                      <p className="mt-1 text-gray-600">{contactInfo.email}</p>
                    </div>
                  </div>
                )}
                
                {contactInfo?.hours && (
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="h-5 w-5 text-nasser-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">Horaires d'ouverture</h3>
                      <p className="mt-1 text-gray-600 whitespace-pre-line">{contactInfo.hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-6">Envoyez-nous un message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
        
        {/* Carte - Pour une implémentation réelle, remplacer par une carte Google Maps */}
        <div className="mt-12">
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Carte Google Maps ici</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
