
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-20">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3506&q=80")',
        }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-nasser-primary/90 mix-blend-multiply"></div>
      </div>

      <div className="container-custom relative z-10 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Prêt pour votre prochain voyage ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contactez-nous dès maintenant pour obtenir les meilleures offres et un service personnalisé pour votre prochaine aventure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/reserver" className="btn-secondary flex items-center">
              Réserver maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/devis" className="btn-outline border-white flex items-center">
              Demander un devis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
