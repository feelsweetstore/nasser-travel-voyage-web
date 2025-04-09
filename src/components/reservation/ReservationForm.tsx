
import React, { useState } from 'react';
import { CalendarIcon, Users, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReservationForm = () => {
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
    requestType: 'reservation',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    
    // Simulation d'un envoi réussi
    toast({
      title: "Demande envoyée avec succès!",
      description: "Nous vous contacterons très prochainement.",
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
      requestType: 'reservation',
      message: ''
    });
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>

        {/* Date de retour */}
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
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

        {/* Option pour cocher */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Type de demande *
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="requestType"
                value="reservation"
                checked={formData.requestType === 'reservation'}
                onChange={handleChange}
                className="h-4 w-4 text-nasser-primary"
              />
              <span className="ml-2">Réservation</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="requestType"
                value="quote"
                checked={formData.requestType === 'quote'}
                onChange={handleChange}
                className="h-4 w-4 text-nasser-primary"
              />
              <span className="ml-2">Demande de devis</span>
            </label>
          </div>
        </div>

        {/* Message / demande particulière */}
        <div className="md:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message / demande particulière
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
            placeholder="Précisez toute information complémentaire importante pour votre voyage..."
          ></textarea>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="btn-primary py-3 px-8 text-lg"
        >
          Envoyer ma demande
        </button>
        <p className="mt-3 text-sm text-gray-500">
          Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>
    </form>
  );
};

export default ReservationForm;
