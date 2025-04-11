
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ContactService from '../../services/ContactService';

const ContactForm = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Enregistrer le message
      ContactService.addMessage({
        name,
        email,
        phone,
        subject,
        message,
      });
      
      // Réinitialiser le formulaire
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      
      toast({
        title: "Message envoyé",
        description: "Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom complet"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre-email@example.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+235 XX XX XX XX"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet de votre message"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message..."
          rows={6}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
};

export default ContactForm;
