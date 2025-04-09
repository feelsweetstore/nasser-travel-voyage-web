
import React from 'react';
import { Plane, CreditCard, FileText, Users, Headphones, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Plane size={40} className="text-nasser-primary" />,
    title: "Réservation de billets d'avion",
    description: "Réservez vos billets d'avion vers toutes les destinations dans le monde à des prix compétitifs."
  },
  {
    icon: <FileText size={40} className="text-nasser-primary" />,
    title: "Accompagnement administratif",
    description: "Assistance pour l'obtention de visas et préparation de tous les documents nécessaires à votre voyage."
  },
  {
    icon: <Globe size={40} className="text-nasser-primary" />,
    title: "Conseils personnalisés",
    description: "Bénéficiez de conseils personnalisés pour organiser votre voyage selon vos besoins et préférences."
  },
  {
    icon: <Users size={40} className="text-nasser-primary" />,
    title: "Voyages de groupe",
    description: "Organisation de voyages de groupe pour entreprises, associations ou particuliers."
  },
  {
    icon: <CreditCard size={40} className="text-nasser-primary" />,
    title: "Options de paiement flexibles",
    description: "Plusieurs options de paiement pour faciliter vos réservations de voyage."
  },
  {
    icon: <Headphones size={40} className="text-nasser-primary" />,
    title: "Assistance permanente",
    description: "Service client disponible pour vous assister avant, pendant et après votre voyage."
  }
];

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-nasser-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Nos Services</h2>
          <p className="section-subtitle">
            Découvrez la gamme complète de services que NASSER TRAVEL HORIZON propose pour rendre votre voyage inoubliable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card group hover:border-nasser-primary hover:border transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services" className="btn-primary">
            Voir tous nos services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
