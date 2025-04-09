
import React from 'react';
import { Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    id: 1,
    name: "Sophie Mahamat",
    avatar: null,
    role: "Cliente régulière",
    content: "J'ai réservé plusieurs fois avec NASSER TRAVEL HORIZON et le service est toujours impeccable. Ils m'ont aidée à obtenir un visa pour la France rapidement. Je les recommande vivement !",
    rating: 5
  },
  {
    id: 2,
    name: "Ibrahim Ousmane",
    avatar: null,
    role: "Voyageur d'affaires",
    content: "En tant que voyageur fréquent pour affaires, je peux affirmer que NASSER TRAVEL offre un service de qualité supérieure. Leur réactivité et leur professionnalisme sont remarquables.",
    rating: 5
  },
  {
    id: 3,
    name: "Aisha Djimet",
    avatar: null,
    role: "Première expérience",
    content: "Pour mon premier voyage à l'étranger, j'étais inquiète. L'équipe m'a guidée à chaque étape et m'a donné d'excellents conseils. Un grand merci pour leur patience !",
    rating: 4
  }
];

const renderRatingStars = (rating: number) => {
  return Array(5).fill(0).map((_, i) => (
    <Star key={i} size={16} 
      className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
  ));
};

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <p className="section-subtitle">
            Découvrez les expériences de nos clients qui nous ont fait confiance pour leurs voyages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card bg-white border border-gray-100">
              <div className="flex items-center mb-4">
                {testimonial.avatar ? (
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-nasser-primary/10 flex items-center justify-center mr-4">
                    <User size={24} className="text-nasser-primary" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-lg">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {renderRatingStars(testimonial.rating)}
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/temoignages" className="btn-outline">
            Voir tous les témoignages
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
