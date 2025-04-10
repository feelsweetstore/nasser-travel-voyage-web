
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ReviewService from '../../services/ReviewService';

const ReviewForm = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs du formulaire.",
        variant: "destructive",
      });
      return;
    }

    try {
      ReviewService.addReview({
        name,
        email,
        message,
        rating
      });

      toast({
        title: "Avis envoyé avec succès",
        description: "Merci pour votre avis ! Il sera publié après vérification par notre équipe.",
      });

      // Réinitialiser le formulaire
      setName('');
      setEmail('');
      setMessage('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre avis.",
        variant: "destructive",
      });
    }
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl focus:outline-none ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Partagez votre expérience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Note</Label>
            {renderRatingStars()}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Partagez votre expérience avec nous"
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full">Envoyer votre avis</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
