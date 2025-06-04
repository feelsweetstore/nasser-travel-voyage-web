
import React from 'react';
import { MapPin, Shield, Heart, Plane, CheckCircle, Phone, Mail, Globe, Calendar, CreditCard, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContentService from '../services/ContentService';

const ConseilsVoyage = () => {
  // Récupérer le contenu depuis le service
  const pageContent = ContentService.getContentByPage('Conseils Voyage');
  
  const getContentByTitle = (title: string) => {
    const item = pageContent.find(item => item.title === title);
    return item ? item.content : '';
  };

  const mainTitle = getContentByTitle('Titre principal') || 'Conseils Voyage';
  const subtitle = getContentByTitle('Sous-titre') || 'Profitez de notre expertise pour préparer au mieux votre voyage';
  const description = getContentByTitle('Description') || 'Bénéficiez de conseils personnalisés de nos experts pour organiser votre voyage dans les meilleures conditions.';
  const beforeDepartureContent = getContentByTitle('Conseils avant départ') || '';
  const destinationContent = getContentByTitle('Conseils destination') || '';

  // Parser les conseils avant départ
  const beforeDeparture = beforeDepartureContent.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|');
    return {
      title: parts[0] || '',
      description: parts[1] || ''
    };
  });

  // Parser les conseils destination
  const destinationTips = destinationContent.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|');
    return {
      title: parts[0] || '',
      description: parts[1] || ''
    };
  });

  const services = [
    {
      icon: <MapPin className="h-8 w-8 text-nasser-primary" />,
      title: "Conseils destination",
      description: "Informations détaillées sur votre destination : culture, climat, monnaie, sécurité"
    },
    {
      icon: <Shield className="h-8 w-8 text-nasser-primary" />,
      title: "Formalités & Visas",
      description: "Assistance complète pour vos démarches administratives et obtention de visas"
    },
    {
      icon: <Heart className="h-8 w-8 text-nasser-primary" />,
      title: "Santé & Vaccinations",
      description: "Recommandations médicales et vaccinations obligatoires selon votre destination"
    },
    {
      icon: <Plane className="h-8 w-8 text-nasser-primary" />,
      title: "Transport & Logistique",
      description: "Conseils sur les moyens de transport et l'organisation de vos déplacements"
    }
  ];

  const travelCategories = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Voyage d'affaires",
      tips: ["Réservation d'hôtels d'affaires", "Organisation de réunions", "Transport VIP", "Assistance 24h/24"]
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Voyage de loisirs",
      tips: ["Sélection d'activités", "Restaurants recommandés", "Sites touristiques", "Excursions guidées"]
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Voyage en famille",
      tips: ["Activités pour enfants", "Hébergements familiaux", "Sécurité renforcée", "Programmes adaptés"]
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Voyage d'études",
      tips: ["Logement étudiant", "Transport économique", "Assurance étudiante", "Assistance administrative"]
    }
  ];

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {mainTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Description */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>
        </section>

        {/* Services de conseil */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Nos services de conseil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="font-heading font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conseils avant départ */}
        {beforeDeparture.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">Conseils avant départ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beforeDeparture.map((tip, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-heading font-bold mb-2 text-nasser-primary">{tip.title}</h3>
                      <p className="text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Conseils destination */}
        {destinationTips.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">Conseils destination</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinationTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-nasser-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-heading font-bold mb-2 text-nasser-primary">{tip.title}</h3>
                      <p className="text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Types de voyage */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Conseils par type de voyage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {travelCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-nasser-primary/10 rounded-full flex items-center justify-center mr-4">
                    {category.icon}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-nasser-primary">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section avantages */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-nasser-primary to-blue-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-heading font-bold text-center mb-8">Pourquoi choisir nos conseils ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Expertise mondiale</h3>
                <p className="text-sm opacity-90">Connaissance approfondie de plus de 50 destinations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Conseils personnalisés</h3>
                <p className="text-sm opacity-90">Recommandations adaptées à vos besoins et budget</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Assistance continue</h3>
                <p className="text-sm opacity-90">Support avant, pendant et après votre voyage</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Besoin de conseils pour votre voyage ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contactez nos experts dès maintenant pour bénéficier de conseils personnalisés
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/reserver" 
              className="bg-nasser-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Demander des conseils
            </Link>
            <a 
              href="https://wa.me/23566386937" 
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Phone className="w-5 h-5 mr-2" />
              Appeler maintenant
            </a>
            <a 
              href="mailto:contact@nassertravelhorizon.com"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Nous écrire
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConseilsVoyage;
