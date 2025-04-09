
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Quote, Star, StarHalf, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const testimonialSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }),
  rating: z.number().min(1).max(5),
});

const Testimonials = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      rating: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof testimonialSchema>) => {
    console.log(values);
    toast({
      title: "Témoignage envoyé",
      description: "Merci pour votre témoignage ! Il sera examiné puis publié prochainement.",
    });
    setIsDialogOpen(false);
    form.reset();
    setSelectedRating(0);
  };

  const testimonials = [
    {
      id: 1,
      name: "Moussa Ibrahim",
      role: "Homme d'affaires",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      message: "Je voyage régulièrement entre N'Djamena et Dubaï pour mes affaires. NASSER TRAVEL est mon partenaire de confiance depuis 3 ans. Leur service est toujours rapide, professionnel et ils trouvent constamment les meilleures options pour mon emploi du temps chargé.",
      rating: 5,
      date: "15 Mars 2023"
    },
    {
      id: 2,
      name: "Aisha Mahamat",
      role: "Étudiante",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      message: "Grâce à NASSER TRAVEL, mon processus de visa et de réservation pour mes études en France s'est déroulé sans accroc. L'équipe m'a guidée étape par étape et a même suivi mon dossier après mon arrivée pour s'assurer que tout allait bien. Vraiment au-delà de mes attentes !",
      rating: 5,
      date: "7 Septembre 2023"
    },
    {
      id: 3,
      name: "Ahmed Ousmane",
      role: "Médecin",
      image: "https://randomuser.me/api/portraits/men/62.jpg",
      message: "Lorsque j'ai dû voyager d'urgence pour une conférence médicale à Nairobi, NASSER TRAVEL a organisé mon voyage en moins de 24 heures. Leur réactivité et leur professionnalisme m'ont impressionné. Je recommande vivement leurs services à tous mes collègues.",
      rating: 4.5,
      date: "22 Novembre 2023"
    },
    {
      id: 4,
      name: "Fatima Youssouf",
      role: "Enseignante",
      image: "https://randomuser.me/api/portraits/women/17.jpg",
      message: "Notre voyage en famille au Maroc a été parfaitement organisé par NASSER TRAVEL. Ils ont pris en compte toutes nos préférences et ont même prévu des activités pour nos enfants. Le suivi pendant le voyage était excellent, avec des conseils utiles à chaque étape.",
      rating: 5,
      date: "3 Janvier 2024"
    },
    {
      id: 5,
      name: "Hassan Ali",
      role: "Ingénieur",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      message: "Je suis client de NASSER TRAVEL depuis leur ouverture. Leur constance dans la qualité de service est remarquable. Ils connaissent mes préférences et me proposent toujours des options qui correspondent parfaitement à mes besoins. Une agence qui traite vraiment ses clients comme des VIP.",
      rating: 5,
      date: "19 Février 2024"
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400 w-5 h-5" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400 w-5 h-5" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300 w-5 h-5" />);
    }

    return stars;
  };

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Témoignages de nos clients
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les expériences partagées par nos clients satisfaits
          </p>
          
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="mt-6 bg-nasser-primary hover:bg-nasser-primary/90"
          >
            Partagez votre expérience
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full border-2 border-nasser-primary"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-nasser-primary/20" />
                  <p className="text-gray-700 mb-4 pl-4">{testimonial.message}</p>
                </div>
                
                <div className="text-right text-gray-500 text-sm italic mt-4">
                  {testimonial.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Votre opinion compte !
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Partagez votre expérience avec NASSER TRAVEL HORIZON et aidez-nous à améliorer continuellement nos services.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="bg-nasser-primary hover:bg-nasser-primary/90"
          >
            <Star className="mr-2 h-4 w-4" />
            Laisser un témoignage
          </Button>
        </div>

        {/* Add Testimonial Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Partagez votre expérience</DialogTitle>
              <DialogDescription>
                Votre témoignage aide d'autres voyageurs et nous permet d'améliorer nos services.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => {
                                setSelectedRating(rating);
                                field.onChange(rating);
                              }}
                              className="focus:outline-none"
                            >
                              <Star 
                                className={`h-6 w-6 ${
                                  rating <= selectedRating 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-300"
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votre témoignage</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Partagez votre expérience avec notre agence..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-nasser-primary hover:bg-nasser-primary/90">
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default Testimonials;
