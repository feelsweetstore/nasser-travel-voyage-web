
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ContentService from '@/services/ContentService';

const HeroSection = () => {
  const [heroContent, setHeroContent] = useState({
    title: "Bienvenue chez NASSER TRAVEL HORIZON",
    subtitle: "Votre partenaire de confiance pour tous vos voyages au départ du Tchad et partout dans le monde."
  });

  useEffect(() => {
    // Récupérer le contenu initial
    updateHeroContent();
    
    // Écouter les mises à jour du contenu
    const handleContentUpdate = () => {
      updateHeroContent();
    };
    
    window.addEventListener('contentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, []);
  
  const updateHeroContent = () => {
    const content = ContentService.getHeroContent();
    setHeroContent(content);
  };

  return (
    <section className="relative h-[90vh] md:h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat font-[Arial]" 
        style={{ 
          backgroundImage: 'url("/lovable-uploads/0acf3f82-7efa-40da-8002-87c0518ed21e.png")',
          backgroundPosition: 'center 30%'
        }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container-custom relative z-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 animate-fade-in">
            {heroContent.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/reserver" className="btn-primary flex items-center">
              Réserver maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/devis" className="btn-secondary flex items-center">
              Demander un devis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a href="https://wa.me/23566000000" className="btn-outline bg-white/10 flex items-center backdrop-blur-sm">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contact WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
