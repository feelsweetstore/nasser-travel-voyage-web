
import React from 'react';
import ContentService from '../../services/ContentService';

const HeroSection = () => {
  const content = ContentService.getContentByPage('Accueil');
  const backgroundImage = content.find(item => item.type === 'background' && item.category === 'hero')?.content || '/placeholder.svg';
  const title = content.find(item => item.type === 'text' && item.category === 'hero' && item.title === 'Titre principal')?.content;
  const subtitle = content.find(item => item.type === 'text' && item.category === 'hero' && item.title === 'Sous-titre Hero')?.content;

  return (
    <section 
      className="relative h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
