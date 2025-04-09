
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-nasser-dark text-white pt-12 pb-6">
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

          {/* Contact */}
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
            </ul>
            <div className="mt-6">
              <a href="https://wa.me/23566000000" 
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center w-max hover:bg-green-700 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} NASSER TRAVEL HORIZON. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
