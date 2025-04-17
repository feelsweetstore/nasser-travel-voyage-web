import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, Settings, Clock } from 'lucide-react';
import ContentService from '../services/ContentService';

const Footer = () => {
  const hoursContent = ContentService.getContentByTypeAndCategory('hours', 'footer')[0]?.content || '';
  const hours = hoursContent.split('\n').slice(0, 3); // Only show first 3 days in footer

  return (
    <footer className="bg-nasser-dark text-white pt-12 pb-6 relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">NASSER TRAVEL HORIZON</h3>
            <p className="text-gray-300 mb-4">
              Votre partenaire de confiance pour tous vos voyages. Nous vous accompagnons 
              dans toutes vos démarches, de la réservation de billets jusqu'à votre retour.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-nasser-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-white hover:text-nasser-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-white hover:text-nasser-secondary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  Réservation de billets
                </Link>
              </li>
              <li>
                <Link to="/visa" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  Accompagnement visa
                </Link>
              </li>
              <li>
                <Link to="/conseil" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  Conseils de voyage
                </Link>
              </li>
              <li>
                <Link to="/assistance" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  Assistance clientèle
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/temoignages" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  Témoignages clients
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section with Opening Hours */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-nasser-secondary" />
                <a href="tel:+23566000000" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  +235 66 00 00 00
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-nasser-secondary" />
                <a href="mailto:contact@nassertravel.com" className="text-gray-300 hover:text-nasser-secondary transition-colors">
                  contact@nassertravel.com
                </a>
              </li>
              <li className="pt-4">
                <h4 className="text-lg font-semibold mb-2 flex items-center">
                  <Clock size={18} className="mr-2 text-nasser-secondary" />
                  Heures d'ouverture
                </h4>
                <div className="space-y-1">
                  {hours.map((day, index) => {
                    const [dayName, time] = day.split(': ');
                    return (
                      <p key={index} className="text-gray-300 text-sm">
                        {dayName}: <span className="text-nasser-secondary">{time}</span>
                      </p>
                    );
                  })}
                  <Link 
                    to="/horaires" 
                    className="text-nasser-secondary hover:text-nasser-secondary/80 transition-colors text-sm inline-block mt-2"
                  >
                    Voir tous les horaires →
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Admin Link */}
        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} NASSER TRAVEL HORIZON. Tous droits réservés.
          </p>
        </div>
      </div>
      
      {/* Admin access icon - discreet in the bottom right */}
      <Link 
        to="/admin" 
        className="absolute bottom-2 right-2 text-gray-700 hover:text-gray-500 transition-colors"
        aria-label="Admin Dashboard"
      >
        <Settings size={18} />
      </Link>
    </footer>
  );
};

export default Footer;
