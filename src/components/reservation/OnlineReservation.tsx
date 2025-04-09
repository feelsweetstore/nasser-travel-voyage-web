
import React, { useState, useEffect } from 'react';
import { CheckCircle, LockIcon, Loader2, Calendar, MapPin, Users, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OnlineReservationService from '../../services/OnlineReservationService';

type ReservationFormData = {
  fullName: string;
  email: string;
  phone: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  travelClass: string;
  additionalInfo: string;
};

const initialFormData: ReservationFormData = {
  fullName: '',
  email: '',
  phone: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  passengers: 1,
  travelClass: 'economy',
  additionalInfo: ''
};

const OnlineReservation = () => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ReservationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [reservationId, setReservationId] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await OnlineReservationService.getStatus();
        setIsEnabled(status);
      } catch (error) {
        console.error('Error checking online reservation status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'passengers' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate first step
      if (!formData.fullName || !formData.email || !formData.phone || !formData.destination) {
        toast({
          title: "Formulaire incomplet",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the reservation
      const id = await OnlineReservationService.createReservation(formData);
      setReservationId(id);
      
      toast({
        title: "Réservation confirmée!",
        description: "Votre réservation a été enregistrée avec succès.",
      });
      
      // Move to confirmation step
      setStep(3);
      
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast({
        title: "Erreur de réservation",
        description: "Une erreur est survenue lors de la création de votre réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setStep(1);
    setReservationId(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-nasser-primary mb-4" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-dashed border-nasser-accent">
        <div className="relative mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-nasser-accent/20 text-nasser-accent rounded-full mx-auto">
            <LockIcon size={32} />
          </div>
        </div>
        
        <h3 className="text-2xl font-heading font-bold text-center mb-4">
          Réservation en ligne
        </h3>
        
        <p className="text-gray-600 text-center mb-8">
          La réservation en ligne n'est pas disponible actuellement. Veuillez utiliser le formulaire de contact 
          ou nous contacter directement via WhatsApp pour réserver votre billet.
        </p>
        
        <div className="text-center">
          <button 
            disabled
            className="inline-flex items-center justify-center w-full bg-gray-300 text-gray-600 font-medium py-3 px-4 rounded-md cursor-not-allowed"
          >
            <LockIcon className="mr-2 h-5 w-5" />
            Service temporairement indisponible
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="bg-white rounded-lg p-6 md:p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-heading font-bold text-center mb-4">
            Réservation confirmée!
          </h3>
          
          <p className="text-gray-600 text-center mb-4">
            Votre réservation a été enregistrée avec succès. Votre numéro de réservation est:
          </p>
          
          <div className="bg-gray-100 rounded-md px-4 py-2 font-mono text-lg mb-6">
            {reservationId}
          </div>
          
          <p className="text-gray-600 text-center mb-8">
            Un email de confirmation a été envoyé à {formData.email}. Vous pouvez suivre le statut de votre réservation 
            dans votre espace client.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={resetForm}
              className="flex-1 bg-nasser-primary hover:bg-nasser-primary/90 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Nouvelle réservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 md:p-8">
      <h3 className="text-2xl font-heading font-bold text-center mb-4">
        Réserver en ligne
      </h3>
      
      <p className="text-gray-600 text-center mb-8">
        Réservez votre billet simplement en quelques étapes et recevez votre confirmation immédiatement.
      </p>
      
      <div className="flex justify-between items-center mb-8">
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-nasser-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 1 ? 'bg-nasser-primary text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="text-xs">Informations</span>
        </div>
        <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-nasser-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center ${step >= 2 ? 'text-nasser-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 2 ? 'bg-nasser-primary text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="text-xs">Détails du vol</span>
        </div>
        <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-nasser-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center ${step >= 3 ? 'text-nasser-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 3 ? 'bg-nasser-primary text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="text-xs">Confirmation</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                placeholder="Entrez votre nom complet"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                placeholder="+235 66 00 00 00"
              />
            </div>
            
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                  placeholder="Ex: Paris, Dubai, etc."
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de départ *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
              
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de retour
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de passagers *
                </label>
                <div className="relative">
                  <select
                    id="passengers"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    required
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
              
              <div>
                <label htmlFor="travelClass" className="block text-sm font-medium text-gray-700 mb-1">
                  Classe de voyage *
                </label>
                <div className="relative">
                  <select
                    id="travelClass"
                    name="travelClass"
                    value={formData.travelClass}
                    onChange={handleChange}
                    required
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                  >
                    <option value="economy">Économique</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">Première classe</option>
                  </select>
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                Informations complémentaires
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                placeholder="Précisez toute demande particulière..."
              ></textarea>
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Retour
            </button>
          )}
          
          <button
            type={step === 2 ? "submit" : "button"}
            disabled={isSubmitting}
            className={`${step === 1 ? 'ml-auto' : ''} bg-nasser-primary hover:bg-nasser-primary/90 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Traitement...
              </>
            ) : step === 2 ? (
              "Confirmer la réservation"
            ) : (
              "Continuer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnlineReservation;
