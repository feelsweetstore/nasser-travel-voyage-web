
import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ReservationCardProps {
  reservation: any;
}

const ReservationCard = ({ reservation }: ReservationCardProps) => {
  const { toast } = useToast();

  const downloadTicket = async () => {
    try {
      // Simuler la génération et le téléchargement d'un billet
      const ticketContent = generateTicketContent(reservation);
      const blob = new Blob([ticketContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billet-${reservation.id.substring(4, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Votre billet a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement.",
        variant: "destructive",
      });
    }
  };

  const downloadItinerary = async () => {
    try {
      // Simuler la génération et le téléchargement d'un itinéraire
      const itineraryContent = generateItineraryContent(reservation);
      const blob = new Blob([itineraryContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `itineraire-${reservation.id.substring(4, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Votre itinéraire a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Error downloading itinerary:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement.",
        variant: "destructive",
      });
    }
  };

  const generateTicketContent = (reservation: any) => {
    return `
===========================================
         NASSER TRAVEL HORIZON
            BILLET DE VOYAGE
===========================================

Référence: ${reservation.id}
Date d'émission: ${new Date().toLocaleDateString('fr-FR')}

-------------------------------------------
INFORMATIONS DU PASSAGER
-------------------------------------------
Nom: ${reservation.fullName || 'Non spécifié'}
Email: ${reservation.email || 'Non spécifié'}
Téléphone: ${reservation.whatsapp || reservation.phone || 'Non spécifié'}

-------------------------------------------
DÉTAILS DU VOYAGE
-------------------------------------------
Destination: ${reservation.destination}
Date de départ: ${reservation.departureDate ? new Date(reservation.departureDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
Date de retour: ${reservation.returnDate ? new Date(reservation.returnDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
Nombre de passagers: ${reservation.passengers}
Classe: ${
  reservation.travelClass === 'economy' ? 'Économique' :
  reservation.travelClass === 'premium' ? 'Premium Economy' :
  reservation.travelClass === 'business' ? 'Business' :
  reservation.travelClass === 'first' ? 'Première classe' :
  reservation.travelClass
}
Statut: ${reservation.status === 'confirmed' ? 'Confirmée' : reservation.status}

-------------------------------------------
CONTACT
-------------------------------------------
NASSER TRAVEL HORIZON
Tél: +235 66 38 69 37
Email: contact@nassertravelhorizon.com
Adresse: NDjamena, Tchad

===========================================
     Merci de voyager avec nous !
===========================================
`;
  };

  const generateItineraryContent = (reservation: any) => {
    return `
===========================================
         NASSER TRAVEL HORIZON
           ITINÉRAIRE DE VOYAGE
===========================================

Référence: ${reservation.id}
Destination: ${reservation.destination}

-------------------------------------------
PLANNING PRÉVISIONNEL
-------------------------------------------

JOUR 1 - DÉPART
${reservation.departureDate ? new Date(reservation.departureDate).toLocaleDateString('fr-FR') : 'Date à confirmer'}
- Départ de NDjamena
- Arrivée à ${reservation.destination}
- Installation à l'hôtel

${reservation.returnDate ? `
JOUR FINAL - RETOUR
${new Date(reservation.returnDate).toLocaleDateString('fr-FR')}
- Départ de ${reservation.destination}
- Retour à NDjamena
` : ''}

-------------------------------------------
INFORMATIONS IMPORTANTES
-------------------------------------------
- Vérifiez la validité de votre passeport
- Consultez les exigences de visa si nécessaire
- Respectez les horaires de départ
- Contactez-nous pour toute modification

-------------------------------------------
CONTACT D'URGENCE
-------------------------------------------
NASSER TRAVEL HORIZON
Tél: +235 66 38 69 37
Email: contact@nassertravelhorizon.com

===========================================
        Bon voyage !
===========================================
`;
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{reservation.destination}</h3>
          <p className="text-gray-600">
            Départ: {new Date(reservation.departureDate).toLocaleDateString('fr-FR')}
            {reservation.returnDate && ` | Retour: ${new Date(reservation.returnDate).toLocaleDateString('fr-FR')}`}
          </p>
          <p className="text-gray-600 mt-1">
            {reservation.passengers} passager(s) | Classe {
              reservation.travelClass === 'economy' ? 'Économique' :
              reservation.travelClass === 'premium' ? 'Premium' :
              reservation.travelClass === 'business' ? 'Business' : 'Première'
            }
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {reservation.status === 'confirmed' ? 'Confirmée' : reservation.status}
          </span>
          <span className="text-gray-500 text-sm mt-1">
            Réservation #{reservation.id.substring(4, 10)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={downloadTicket}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Télécharger le billet
        </Button>
        <Button 
          onClick={downloadItinerary}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Télécharger l'itinéraire
        </Button>
      </div>
    </div>
  );
};

export default ReservationCard;
