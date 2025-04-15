
import React, { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import ContentService from '../services/ContentService';

const Home = () => {
  // Force re-render when localStorage changes (content updates)
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Listen for storage events (when content is updated in admin panel)
    const handleStorageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Initialize content if needed
    ContentService.initialize();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
