
import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import ContentService from '../services/ContentService';

const Home = () => {
  useEffect(() => {
    // S'assurer que le contenu est initialisé
    ContentService.initialize();
    
    // Pour déboguer
    console.log('Home component mounted, content initialized');
    
    // Afficher le contenu actuel dans la console pour le débogage
    const heroContent = ContentService.getHeroContent();
    console.log('Current hero content:', heroContent);
  }, []);

  return (
    <main className="font-[Arial]">
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
};

export default Home;
