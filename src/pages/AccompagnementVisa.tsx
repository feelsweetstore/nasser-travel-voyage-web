
import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, Users, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContentService from '../services/ContentService';

const AccompagnementVisa = () => {
  const [pageContent, setPageContent] = useState({
    title: "Accompagnement Visa",
    subtitle: "Facilitez vos démarches administratives avec notre service d'accompagnement visa personnalisé",
    description: "Notre équipe d'experts vous accompagne dans toutes vos démarches de demande de visa."
  });

  useEffect(() => {
    // Charger le contenu modifiable depuis ContentService
    const content = ContentService.getContentByPage('AccompagnementVisa');
    
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

  const visaTypes = [
    {
      title: "Visa Touristique",
      description: "Pour vos voyages de loisirs et découvertes",
      duration: "5-15 jours",
      documents: ["Passeport valide", "Photos d'identité", "Attestation d'hébergement", "Billet d'avion"]
    },
    {
      title: "Visa d'Affaires",
      description: "Pour vos déplacements professionnels",
      duration: "7-21 jours",
      documents: ["Passeport valide", "Invitation d'entreprise", "Justificatifs professionnels", "Assurance voyage"]
    },
    {
      title: "Visa Transit",
      description: "Pour les escales et correspondances",
      duration: "3-7 jours",
      documents: ["Passeport valide", "Billet de continuation", "Visa du pays de destination"]
    },
    {
      title: "Visa Étudiant",
      description: "Pour poursuivre vos études à l'étranger",
      duration: "15-30 jours",
      documents: ["Passeport valide", "Lettre d'admission", "Justificatifs financiers", "Certificats médicaux"]
    }
  ];

  const processSteps = [
    {
      icon: <FileText className="h-8 w-8 text-nasser-primary" />,
      title: "Consultation initiale",
      description: "Évaluation de votre dossier et définition de la stratégie"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-nasser-primary" />,
      title: "Préparation des documents",
      description: "Rassemblement et vérification de tous les documents requis"
    },
    {
      icon: <Clock className="h-8 w-8 text-nasser-primary" />,
      title: "Dépôt de la demande",
      description: "Soumission officielle de votre demande de visa"
    },
    {
      icon: <Users className="h-8 w-8 text-nasser-primary" />,
      title: "Suivi personnalisé",
      description: "Accompagnement jusqu'à l'obtention de votre visa"
    }
  ];

  const countries = [
    "France", "Canada", "États-Unis", "Royaume-Uni", "Allemagne", "Italie",
    "Espagne", "Belgique", "Pays-Bas", "Suisse", "Australie", "Dubaï",
    "Arabie Saoudite", "Turquie", "Maroc", "Sénégal", "Côte d'Ivoire"
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

        {/* Types de visa */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Types de visa traités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visaTypes.map((visa, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-heading font-bold mb-3 text-nasser-primary">{visa.title}</h3>
                <p className="text-gray-600 mb-4">{visa.description}</p>
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-nasser-primary/10 text-nasser-primary">
                    <Clock className="h-4 w-4 mr-1" />
                    Délai: {visa.duration}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Documents requis :</h4>
                  <ul className="space-y-1">
                    {visa.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Processus */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Notre processus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-heading font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Destinations prises en charge</h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {countries.map((country, index) => (
                <div key={index} className="text-center p-3 rounded-md border border-gray-200 hover:border-nasser-primary transition-colors">
                  <span className="font-medium text-gray-700">{country}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-gradient-to-r from-nasser-primary to-blue-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-heading font-bold text-center mb-8">Pourquoi choisir notre accompagnement ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Expertise reconnue</h3>
                <p className="text-sm opacity-90">Plus de 10 ans d'expérience dans les démarches visa</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Accompagnement personnalisé</h3>
                <p className="text-sm opacity-90">Suivi individuel de chaque dossier jusqu'à l'obtention</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">Rapidité d'exécution</h3>
                <p className="text-sm opacity-90">Traitement accéléré grâce à notre réseau de partenaires</p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Prêt à démarrer vos démarches ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour une consultation gratuite sur votre projet de voyage
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/reserver" 
              className="bg-nasser-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Demander un accompagnement
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

export default AccompagnementVisa;
