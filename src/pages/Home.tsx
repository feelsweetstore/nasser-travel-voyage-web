
import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import ContentService from '../services/ContentService';

const Home = () => {
  useEffect(() => {
    // S'assurer que le contenu est initialisé au chargement de la page
    ContentService.initialize();
    console.info('Home component mounted, content initialized');
    
    // Log du contenu actuel pour le débogage
    const heroTextContent = ContentService.getContentByTypeAndCategory('text', 'hero')[0];
    console.info('Current hero text content:', heroTextContent);
  }, []);

  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
};

export default Home;
