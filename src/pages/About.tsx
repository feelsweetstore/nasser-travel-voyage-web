
import React from 'react';
import { Award, Users, Target, Shield } from 'lucide-react';

const About = () => {
  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            À propos de NASSER TRAVEL HORIZON
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Votre partenaire de voyage de confiance au Tchad depuis 2015
          </p>
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-heading font-semibold mb-6">Notre Histoire</h2>
            <p className="text-lg text-gray-700 mb-6">
              Fondée en 2015, NASSER TRAVEL HORIZON est née de la passion de son fondateur pour les voyages et de sa volonté d'offrir aux Tchadiens un service de qualité internationale pour leurs déplacements.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Au fil des années, nous avons développé des partenariats solides avec les principales compagnies aériennes et acteurs du tourisme mondial, nous permettant d'offrir à nos clients les meilleures options de voyage au meilleur prix.
            </p>
            <p className="text-lg text-gray-700">
              Notre équipe expérimentée a accompagné avec succès des milliers de voyageurs, aussi bien pour des déplacements professionnels que pour des voyages de loisirs ou familiaux.
            </p>
          </div>
          <div>
            <div className="relative h-full">
              <img 
                src="https://images.unsplash.com/photo-1562841857-1a498e6eb0e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Équipe NASSER TRAVEL HORIZON" 
                className="rounded-lg shadow-xl w-full h-full object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-lg font-bold font-heading text-nasser-primary">Plus de 5000</p>
                <p className="text-sm text-gray-600">Clients satisfaits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Founder Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
              alt="Fondateur de NASSER TRAVEL HORIZON" 
              className="w-40 h-40 object-cover rounded-full border-4 border-nasser-primary"
            />
            <div>
              <h3 className="text-2xl font-heading font-bold mb-4">Mot du Fondateur</h3>
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "Notre mission est simple : rendre le voyage accessible, agréable et sans stress pour tous les Tchadiens. Chaque client est unique et mérite un service personnalisé qui répond à ses besoins spécifiques. C'est cette philosophie qui guide notre travail quotidien."
              </blockquote>
              <p className="font-semibold">Nasser Ibrahim, Fondateur & Directeur</p>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-nasser-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Notre Mission</h3>
            <p className="text-gray-700">
              Faciliter les voyages nationaux et internationaux pour les Tchadiens en offrant un service complet, personnalisé et accessible.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-nasser-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Notre Vision</h3>
            <p className="text-gray-700">
              Devenir la référence en matière d'agence de voyage au Tchad et en Afrique centrale, reconnue pour son excellence et son innovation.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-nasser-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Nos Valeurs</h3>
            <p className="text-gray-700">
              Intégrité, excellence du service, innovation et écoute client sont les valeurs qui guident chacune de nos actions.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-heading font-semibold mb-8 text-center">Pourquoi nous faire confiance ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-10 w-10 text-nasser-primary" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">Garantie de service</h3>
                <p className="text-gray-700">
                  Nous nous engageons à vous offrir le meilleur service possible, avec des garanties claires sur nos prestations.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-nasser-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">Tarifs compétitifs</h3>
                <p className="text-gray-700">
                  Nos partenariats avec les compagnies aériennes nous permettent d'offrir des prix avantageux sans compromis sur la qualité.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-nasser-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">Support client 24/7</h3>
                <p className="text-gray-700">
                  Notre équipe est disponible à tout moment pour répondre à vos questions et résoudre vos problèmes pendant vos voyages.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-nasser-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">Expertise locale et internationale</h3>
                <p className="text-gray-700">
                  Notre équipe combine une profonde connaissance du marché tchadien avec une expertise des voyages internationaux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
