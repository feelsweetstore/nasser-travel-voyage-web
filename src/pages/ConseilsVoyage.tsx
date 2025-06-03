import React, { useEffect, useState } from 'react';
import { MapPin, Shield, Heart, Briefcase, Camera, Utensils, Plane, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContentService from '../services/ContentService';

const ConseilsVoyage = () => {
  const [pageContent, setPageContent] = useState({
    title: "Conseils Voyage",
    subtitle: "Découvrez nos conseils d'experts pour organiser et profiter pleinement de votre voyage",
    description: "Nos conseillers expérimentés partagent avec vous leurs meilleurs conseils pour voyager en toute sérénité."
  });

  useEffect(() => {
    // Charger le contenu modifiable depuis ContentService
    const content = ContentService.getContentByPage('ConseilsVoyage');
    
    const newContent = { ...pageContent };
    content.forEach(item => {
      if (item.category === 'title') {
        newContent.title = item.content;
      } else if (item.category === 'subtitle') {
        newContent.subtitle = item.content;
      } else if (item.category === 'description') {
        newContent.description = item.content;
      }
    });
    
    setPageContent(newContent);
  }, []);

  const travelTips = [
    {
      icon: <Shield className="h-8 w-8 text-nasser-primary" />,
      title: "Sécurité et santé",
      description: "Conseils pour voyager en toute sécurité",
      tips: [
        "Vérifiez les conditions sanitaires du pays de destination",
        "Souscrivez une assurance voyage adaptée",
        "Emportez une trousse de premiers secours",
        "Conservez des copies de vos documents importants",
        "Renseignez-vous sur les vaccinations requises"
      ]
    },
    {
      icon: <Briefcase className="h-8 w-8 text-nasser-primary" />,
      title: "Préparation administrative",
      description: "Documents et formalités essentiels",
      tips: [
        "Vérifiez la validité de votre passeport (6 mois minimum)",
        "Demandez votre visa suffisamment à l'avance",
        "Informez votre banque de votre voyage",
        "Préparez vos justificatifs financiers",
        "Conservez vos billets et réservations"
      ]
    },
    {
      icon: <Utensils className="h-8 w-8 text-nasser-primary" />,
      title: "Culture et gastronomie",
      description: "Découvrez les traditions locales",
      tips: [
        "Apprenez quelques mots de la langue locale",
        "Renseignez-vous sur les coutumes du pays",
        "Goûtez aux spécialités culinaires locales",
        "Respectez les codes vestimentaires",
        "Adaptez-vous aux horaires locaux"
      ]
    },
    {
      icon: <Camera className="h-8 w-8 text-nasser-primary" />,
      title: "Que mettre dans sa valise",
      description: "Conseils pour bien préparer ses bagages",
      tips: [
        "Vérifiez les restrictions de bagages de votre compagnie",
        "Emportez des vêtements adaptés au climat",
        "N'oubliez pas les adaptateurs électriques",
        "Préparez une trousse de toilette de voyage",
        "Gardez l'essentiel dans votre bagage à main"
      ]
    }
  ];

  const destinations = [
    {
      name: "Europe",
      image: "/lovable-uploads/0acf3f82-7efa-40da-8002-87c0518ed21e.png",
      tips: "Climat tempéré, riche patrimoine historique, transports développés",
      bestTime: "Avril à octobre",
      budget: "Moyen à élevé"
    },
    {
      name: "Afrique",
      image: "/lovable-uploads/d19dbcf9-1907-4336-85b4-f60eec78f9b3.png",
      tips: "Diversité culturelle, safaris, plages magnifiques",
      bestTime: "Mai à septembre",
      budget: "Faible à moyen"
    },
    {
      name: "Amérique du Nord",
      image: "/placeholder.svg",
      tips: "Grandes métropoles, parcs nationaux, technologie avancée",
      bestTime: "Mai à septembre",
      budget: "Moyen à élevé"
    },
    {
      name: "Asie",
      image: "/placeholder.svg",
      tips: "Temples ancestraux, cuisine raffinée, hospitalité légendaire",
      bestTime: "Octobre à mars",
      budget: "Faible à moyen"
    }
  ];

  const budgetTips = [
    {
      category: "Hébergement",
      tips: ["Réservez à l'avance pour de meilleurs tarifs", "Considérez les auberges de jeunesse", "Utilisez les plateformes de partage"]
    },
    {
      category: "Transport",
      tips: ["Comparez les prix des compagnies aériennes", "Voyagez en basse saison", "Utilisez les transports publics locaux"]
    },
    {
      category: "Restauration",
      tips: ["Mangez dans les restaurants locaux", "Évitez les zones touristiques", "Préparez quelques repas vous-même"]
    },
    {
      category: "Activités",
      tips: ["Recherchez les activités gratuites", "Achetez des pass touristiques", "Négociez les prix quand c'est possible"]
    }
  ];

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {pageContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {pageContent.subtitle}
          </p>
        </div>

        {/* Description Section */}
        <div className="text-center mb-16">
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            {pageContent.description}
          </p>
        </div>

        {/* Conseils essentiels */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Conseils essentiels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {travelTips.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-nasser-primary/10 rounded-full flex items-center justify-center mr-4">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-nasser-primary">{category.title}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <span className="w-2 h-2 bg-nasser-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Destinations populaires */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Destinations populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-nasser-primary to-blue-600"></div>
                <div className="p-4">
                  <h3 className="text-lg font-heading font-bold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{destination.tips}</p>
                  <div className="space-y-1 text-xs">
                    <p><strong>Meilleure période:</strong> {destination.bestTime}</p>
                    <p><strong>Budget:</strong> {destination.budget}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conseils budget */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Optimiser votre budget voyage</h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {budgetTips.map((category, index) => (
                <div key={index}>
                  <h3 className="font-heading font-bold text-nasser-primary mb-3">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-nasser-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Check-list voyage */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-nasser-primary to-blue-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-heading font-bold text-center mb-8">Check-list avant le départ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold mb-4">3 mois avant</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>✓ Vérifier la validité du passeport</li>
                  <li>✓ Demander le visa si nécessaire</li>
                  <li>✓ Réserver les vols</li>
                  <li>✓ Souscrire une assurance voyage</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">1 mois avant</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>✓ Réserver l'hébergement</li>
                  <li>✓ Faire les vaccinations</li>
                  <li>✓ Informer la banque</li>
                  <li>✓ Préparer l'itinéraire</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">1 semaine avant</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>✓ Confirmer les réservations</li>
                  <li>✓ Préparer les bagages</li>
                  <li>✓ Échanger des devises</li>
                  <li>✓ Télécharger les apps utiles</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Besoin de conseils personnalisés ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nos experts voyage sont là pour vous accompagner dans la planification de votre séjour
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
              WhatsApp
            </a>
            <a 
              href="mailto:contact@nassertravelhorizon.com"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConseilsVoyage;
