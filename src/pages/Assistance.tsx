
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ContactService from '../services/ContactService';
import ContentService from '@/services/ContentService';

const Assistance = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  // État pour stocker les coordonnées
  const [contactInfo, setContactInfo] = useState({
    phone: '+235 66 38 69 37',
    email: 'contact@nassertravelhorizon.com',
    address: 'Avenue Charles de Gaulle, N\'Djamena, Tchad'
  });

  // Fonction pour extraire et formater les coordonnées
  const parseContactInfo = () => {
    const contactContent = ContentService.getContentByType('contact')[0]?.content || '';
    const contactLines = contactContent.split('\n');
    
    const phoneLine = contactLines.find(line => line.startsWith('Téléphone:'))?.replace('Téléphone:', '').trim() || '';
    const phone = phoneLine.split(',')[0]?.trim() || '+235 66 38 69 37';
    
    const emailLine = contactLines.find(line => line.startsWith('Email:'))?.replace('Email:', '').trim() || '';
    const email = emailLine.split(',')[0]?.trim() || 'contact@nassertravelhorizon.com';
    
    const addressLine = contactLines.find(line => line.startsWith('Adresse:'))?.replace('Adresse:', '').trim() 
      || 'Avenue Charles de Gaulle, N\'Djamena, Tchad';
    
    setContactInfo({
      phone,
      email, 
      address: addressLine
    });
  };

  // Charger les coordonnées au chargement de la page
  useEffect(() => {
    parseContactInfo();
    
    // Écouter les événements de mise à jour du contenu
    const handleContentUpdate = () => {
      parseContactInfo();
    };
    
    window.addEventListener('contentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Enregistrer le message dans ContactService
      ContactService.addMessage({
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      // Notification de succès
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="bg-white py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Besoin d'aide ?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à vos questions et vous accompagner dans vos projets de voyage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="mx-auto bg-nasser-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Phone className="text-nasser-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Téléphone</h3>
            <p className="text-gray-600 mb-4">Du lundi au vendredi : 8h-18h</p>
            <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-nasser-primary font-medium hover:underline">{contactInfo.phone}</a>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="mx-auto bg-nasser-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Mail className="text-nasser-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Réponse sous 24-48h</p>
            <a href={`mailto:${contactInfo.email}`} className="text-nasser-primary font-medium hover:underline">{contactInfo.email}</a>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="mx-auto bg-nasser-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <MapPin className="text-nasser-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Adresse</h3>
            <p className="text-gray-600 mb-4">Bureaux ouverts de 8h à 17h</p>
            <address className="not-italic text-nasser-primary font-medium">{contactInfo.address}</address>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 bg-nasser-primary text-white">
              <h2 className="text-3xl font-bold mb-6">Envoyez-nous un message</h2>
              <p className="mb-8">
                Vous avez une question spécifique ? Remplissez notre formulaire et nous vous répondrons dans les plus brefs délais.
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5" />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5" />
                  <span>{contactInfo.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5" />
                  <span>{contactInfo.address}</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                    placeholder="Votre nom"
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
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                    placeholder="+235 66 00 00 00"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                    placeholder="Objet de votre message"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                    placeholder="Détaillez votre demande..."
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="btn-primary py-3 px-6 w-full"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Où nous trouver</h2>
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61671.46087450973!2d15.02893554863281!3d12.134844499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x111bcbf64e7b0687%3A0xb2b527da4739094a!2sN&#39;Djamena%2C%20Chad!5e0!3m2!1sen!2sus!4v1649688368107!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{border: 0}} 
              allowFullScreen={true} 
              loading="lazy" 
              title="Emplacement de NASSER TRAVEL HORIZON"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Assistance;
