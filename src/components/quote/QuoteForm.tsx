
import React, { useState } from 'react';
import { CalendarIcon, Users, Plane, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OnlineReservationService from '../../services/OnlineReservationService';

const QuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    travelClass: 'economy',
    ticketType: 'roundTrip',
    budget: '',
    flexibility: 'strict',
    message: ''
  });

  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update form data with formatted dates
    const submissionData = {
      ...formData,
      departureDate: departureDate ? format(departureDate, 'yyyy-MM-dd') : '',
      returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : '',
      requestType: 'quote' // Always set to quote
    };
    
    console.log('Quote form data submitted:', submissionData);
    
    try {
      // Save the quote request
      await OnlineReservationService.createReservation({
        ...submissionData,
        createdAt: new Date().toISOString(),
        type: 'quote',
        status: 'nouveau'
      });
      
      // Show success message
      toast({
        title: "Demande de devis envoyée avec succès!",
        description: "Nous vous contacterons très prochainement avec votre devis personnalisé.",
        variant: "default",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        whatsapp: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        passengers: '1',
        travelClass: 'economy',
        ticketType: 'roundTrip',
        budget: '',
        flexibility: 'strict',
        message: ''
      });
      setDepartureDate(undefined);
      setReturnDate(undefined);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom complet */}
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

        {/* Email */}
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

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro WhatsApp *
          </label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            placeholder="+235 66 00 00 00"
          />
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination souhaitée *
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            placeholder="Ex: Paris, Dubai, etc."
          />
        </div>

        {/* Date de départ */}
        <div>
          <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de départ approximative *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal p-3 border border-gray-300",
                  !departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "PPP") : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={(date) => {
                  setDepartureDate(date);
                  if (date) {
                    setFormData(prev => ({ ...prev, departureDate: format(date, 'yyyy-MM-dd') }));
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date de retour */}
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de retour approximative
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal p-3 border border-gray-300",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {returnDate ? format(returnDate, "PPP") : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={(date) => {
                  setReturnDate(date);
                  if (date) {
                    setFormData(prev => ({ ...prev, returnDate: format(date, 'yyyy-MM-dd') }));
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Nombre de passagers */}
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
              className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
              <option value="11+">11 ou plus</option>
            </select>
            <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>

        {/* Classe de voyage */}
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
              className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            >
              <option value="economy">Économique</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">Première classe</option>
            </select>
            <Plane className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget approximatif
          </label>
          <div className="relative">
            <input
              type="text"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
              placeholder="Ex: 500 000 FCFA"
            />
            <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>

        {/* Flexibility */}
        <div>
          <label htmlFor="flexibility" className="block text-sm font-medium text-gray-700 mb-1">
            Flexibilité des dates
          </label>
          <div className="relative">
            <select
              id="flexibility"
              name="flexibility"
              value={formData.flexibility}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            >
              <option value="strict">Dates fixes</option>
              <option value="flexible-days">Flexible (±2-3 jours)</option>
              <option value="flexible-week">Flexible (±1 semaine)</option>
              <option value="very-flexible">Très flexible</option>
            </select>
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>

        {/* Type de billet */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Type de billet *
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="ticketType"
                value="oneWay"
                checked={formData.ticketType === 'oneWay'}
                onChange={handleChange}
                className="h-4 w-4 text-nasser-primary"
              />
              <span className="ml-2">Aller simple</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="ticketType"
                value="roundTrip"
                checked={formData.ticketType === 'roundTrip'}
                onChange={handleChange}
                className="h-4 w-4 text-nasser-primary"
              />
              <span className="ml-2">Aller-retour</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="ticketType"
                value="multiCity"
                checked={formData.ticketType === 'multiCity'}
                onChange={handleChange}
                className="h-4 w-4 text-nasser-primary"
              />
              <span className="ml-2">Multi-destinations</span>
            </label>
          </div>
        </div>

        {/* Message / demande particulière */}
        <div className="md:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Précisions sur votre demande
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            placeholder="Précisez toute demande particulière, préférences, ou spécificités pour votre devis..."
          ></textarea>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="btn-primary py-3 px-8 text-lg"
        >
          Demander mon devis
        </button>
        <p className="mt-3 text-sm text-gray-500">
          Nous vous contacterons rapidement pour vous proposer un devis personnalisé.
        </p>
      </div>
    </form>
  );
};

export default QuoteForm;
