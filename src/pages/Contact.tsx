
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/components/ui/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Send } from 'lucide-react';
import ContentService from '@/services/ContentService';
import ContactService from '@/services/ContactService';

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  subject: z.string().min(3, { message: "Le sujet est requis" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }),
});

const Contact = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });
  
  // Utiliser useState pour gérer les coordonnées
  const [contactInfo, setContactInfo] = useState({
    address: {
      line1: 'Avenue Charles de Gaulle',
      line2: 'N\'Djamena, Tchad'
    },
    phones: ['+235 66 00 00 00', '+235 99 00 00 00'],
    emails: ['contact@nassertravel.com', 'info@nassertravel.com'],
    hours: {
      weekdays: 'Lundi - Vendredi: 8h - 18h',
      saturday: 'Samedi: 9h - 15h',
      sunday: 'Dimanche: Fermé'
    }
  });

  // Fonction pour extraire et formater les coordonnées
  const parseContactInfo = () => {
    // Récupérer les coordonnées
    const contactContent = ContentService.getContentByType('contact')[0]?.content || '';
    const contactLines = contactContent.split('\n');
    
    // Adresse
    const addressLine = contactLines.find(line => line.startsWith('Adresse:'))?.replace('Adresse:', '').trim() || '';
    const addressParts = addressLine.split(',').map(part => part.trim());
    
    // Téléphones
    const phoneLine = contactLines.find(line => line.startsWith('Téléphone:'))?.replace('Téléphone:', '').trim() || '';
    const phones = phoneLine.split(',').map(phone => phone.trim());
    
    // Emails
    const emailLine = contactLines.find(line => line.startsWith('Email:'))?.replace('Email:', '').trim() || '';
    const emails = emailLine.split(',').map(email => email.trim());
    
    // Heures d'ouverture
    const formattedHours = ContentService.getFormattedOpeningHours();
    
    // Mise à jour de l'état avec toutes les informations récupérées
    setContactInfo({
      address: {
        line1: addressParts[0] || 'Avenue Charles de Gaulle',
        line2: addressParts.slice(1).join(', ') || 'N\'Djamena, Tchad'
      },
      phones: phones.length ? phones : ['+235 66 00 00 00', '+235 99 00 00 00'],
      emails: emails.length ? emails : ['contact@nassertravel.com', 'info@nassertravel.com'],
      hours: formattedHours
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Enregistrer le message dans ContactService
    try {
      ContactService.addMessage(values);
      
      toast({
        title: "Message envoyé",
        description: "Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.",
      });
      form.reset();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <main className="bg-nasser-light py-16 font-[Arial]">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-heading font-semibold mb-6">Nos Coordonnées</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-nasser-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-nasser-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Adresse</h3>
                    <p className="text-gray-600 mt-1">{contactInfo.address.line1}</p>
                    <p className="text-gray-600">{contactInfo.address.line2}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-nasser-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-nasser-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Téléphone</h3>
                    {contactInfo.phones.map((phone, index) => (
                      <p className="text-gray-600 mt-1" key={index}>
                        <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-nasser-primary">{phone}</a>
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-nasser-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-nasser-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Email</h3>
                    {contactInfo.emails.map((email, index) => (
                      <p className="text-gray-600 mt-1" key={index}>
                        <a href={`mailto:${email}`} className="hover:text-nasser-primary">{email}</a>
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-nasser-primary/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-nasser-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Heures d'ouverture</h3>
                    <p className="text-gray-600 mt-1">{contactInfo.hours.weekdays}</p>
                    <p className="text-gray-600">{contactInfo.hours.saturday}</p>
                    <p className="text-gray-600">{contactInfo.hours.sunday}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-gray-900 mb-4">Réseaux sociaux</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href={`https://wa.me/${contactInfo.phones[0]?.replace(/[^0-9]/g, '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-heading font-semibold mb-6">Envoyez-nous un message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+235 66 XX XX XX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sujet</FormLabel>
                          <FormControl>
                            <Input placeholder="Sujet de votre message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Détaillez votre demande..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-nasser-primary hover:bg-nasser-primary/90">
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer le message
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-16 rounded-xl overflow-hidden shadow-md">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62214.16988078196!2d15.023259774621924!3d12.126349025073334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1111700707c52dd7%3A0xc28b96bc33e7212!2sNdjamena%2C%20Tchad!5e0!3m2!1sfr!2s!4v1691689854950!5m2!1sfr!2s" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="NASSER TRAVEL HORIZON location"
          ></iframe>
        </div>
      </div>
    </main>
  );
};

export default Contact;
