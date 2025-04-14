
import React from 'react';
import { Plane, FileText, Award, Headphones, CreditCard, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';

const Services = () => {
  const { getContentByTitle } = useContent('Services');
  
  // Récupération des titres et sous-titres
  const pageTitle = getContentByTitle('Titre Services', 'Nos Services');
  const pageSubtitle = getContentByTitle('Sous-titre Services', 'Des solutions complètes pour tous vos besoins de voyage, du billet d\'avion à l\'assistance sur place');
  const ctaTitle = getContentByTitle('Titre CTA Services', 'Prêt à planifier votre prochain voyage ?');
  const ctaSubtitle = getContentByTitle('Sous-titre CTA Services', 'Contactez-nous dès aujourd\'hui et laissez notre équipe d\'experts s\'occuper de tous les détails de votre voyage.');

  const services = [
    {
      icon: <Plane className="h-12 w-12 text-nasser-primary" />,
      title: "Réservation de billets d'avion",
      description: "Nous vous offrons les meilleures options de vols aux tarifs les plus compétitifs pour toutes vos destinations.",
      details: [
        "Billets pour toutes les compagnies aériennes",
        "Vols nationaux et internationaux",
        "Options économiques et premium",
        "Assistance complète pour les groupes"
      ]
    },
    {
      icon: <FileText className="h-12 w-12 text-nasser-primary" />,
      title: "Accompagnement administratif",
      description: "Nous vous guidons à travers toutes les démarches administratives liées à votre voyage.",
      details: [
        "Assistance pour les demandes de visa",
        "Préparation des documents nécessaires",
        "Conseils sur les exigences d'entrée par pays",
        "Suivi personnalisé de chaque dossier"
      ]
    },
    {
      icon: <Globe className="h-12 w-12 text-nasser-primary" />,
      title: "Conseils de voyage personnalisés",
      description: "Profitez de notre expertise pour planifier votre voyage selon vos besoins spécifiques.",
      details: [
        "Recommandations d'itinéraires",
        "Informations sur les destinations",
        "Conseils de sécurité et santé",
        "Suggestions d'hébergement et activités"
      ]
    },
    {
      icon: <Headphones className="h-12 w-12 text-nasser-primary" />,
      title: "Assistance clientèle 24/7",
      description: "Notre équipe reste à votre disposition avant, pendant et après votre voyage pour toute assistance.",
      details: [
        "Support téléphonique permanent",
        "Assistance d'urgence pendant le voyage",
        "Gestion des imprévus et changements",
        "Service client réactif et attentif"
      ]
    },
    {
      icon: <CreditCard className="h-12 w-12 text-nasser-primary" />,
      title: "Options de paiement flexibles",
      description: "Nous vous proposons plusieurs méthodes de paiement adaptées à vos préférences.",
      details: [
        "Paiement en espèces",
        "Virement bancaire",
        "Mobile Money (Orange Money, MoMo)",
        "Paiement en ligne (bientôt disponible)"
      ]
    },
    {
      icon: <Award className="h-12 w-12 text-nasser-primary" />,
      title: "Programme de fidélité",
      description: "Bénéficiez d'avantages exclusifs en rejoignant notre programme de fidélité client.",
      details: [
        "Réductions sur vos réservations",
        "Services premium pour clients fidèles",
        "Offres spéciales et promotions exclusives",
        "Traitement prioritaire de vos demandes"
      ]
    }
  ];

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {pageTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {pageSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
              <div className="p-6">
                <div className="w-20 h-20 bg-nasser-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {service.icon}
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-center">{service.title}</h3>
                <p className="text-gray-700 mb-6 text-center">{service.description}</p>
                <ul className="space-y-2">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-nasser-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-nasser-primary to-blue-600 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center text-white">
            <h2 className="text-3xl font-heading font-bold mb-6">{ctaTitle}</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {ctaSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/reserver" 
                className="bg-white text-nasser-primary hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-colors"
              >
                Demander un devis
              </Link>
              <a 
                href="https://wa.me/23566000000" 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Contacter via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Services;
