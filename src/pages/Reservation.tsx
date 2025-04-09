
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Clock } from 'lucide-react';
import ReservationForm from '../components/reservation/ReservationForm';
import WhatsAppReservation from '../components/reservation/WhatsAppReservation';
import OnlineReservation from '../components/reservation/OnlineReservation';

const Reservation = () => {
  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Réservez votre billet
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez la méthode qui vous convient pour réserver votre billet d'avion ou demander un devis personnalisé.
          </p>
        </div>

        <Tabs defaultValue="form" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <PenSquare className="h-4 w-4" />
              <span className="hidden md:inline">Formulaire</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="hidden md:inline">WhatsApp</span>
            </TabsTrigger>
            <TabsTrigger value="online" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">En ligne</span>
              <span className="badge-coming-soon hidden md:inline text-[10px]">Bientôt</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <TabsContent value="form">
              <h2 className="text-2xl font-heading font-bold mb-6 text-center">
                Réserver via formulaire
              </h2>
              <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
                Remplissez le formulaire ci-dessous avec vos informations de voyage pour recevoir une proposition personnalisée.
              </p>
              <ReservationForm />
            </TabsContent>
            <TabsContent value="whatsapp">
              <WhatsAppReservation />
            </TabsContent>
            <TabsContent value="online">
              <OnlineReservation />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
};

export default Reservation;
