
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/d19dbcf9-1907-4336-85b4-f60eec78f9b3.png" 
              alt="NASSER TRAVEL HORIZON" 
              className="h-14 md:h-16"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Accueil</Link>
            <Link to="/reserver" className="nav-link">Réserver</Link>
            <div className="relative group">
              <button 
                className="flex items-center nav-link"
                onClick={toggleServices}
              >
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                <div className="py-1">
                  <Link to="/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tous nos services</Link>
                  <Link to="/accompagnement-visa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Accompagnement visa</Link>
                  <Link to="/conseils-voyage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Conseils voyage</Link>
                </div>
              </div>
            </div>
            <Link to="/about" className="nav-link">À propos</Link>
            <Link to="/temoignages" className="nav-link">Témoignages</Link>
            <Link to="/galerie" className="nav-link">Galerie</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/faq" className="nav-link">FAQ</Link>
          </nav>

          {/* Client Area Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/espace-client" className="btn-outline py-2">
              Espace Client
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-nasser-dark"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <Link to="/" className="block py-2 nav-link">Accueil</Link>
            <Link to="/reserver" className="block py-2 nav-link">Réserver</Link>
            <div>
              <button 
                className="flex items-center py-2 w-full justify-between nav-link"
                onClick={toggleServices}
              >
                <span>Services</span> <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isServicesOpen && (
                <div className="pl-4 py-2 space-y-2">
                  <Link to="/services" className="block py-1 text-sm text-gray-700">Tous nos services</Link>
                  <Link to="/accompagnement-visa" className="block py-1 text-sm text-gray-700">Accompagnement visa</Link>
                  <Link to="/conseils-voyage" className="block py-1 text-sm text-gray-700">Conseils voyage</Link>
                </div>
              )}
            </div>
            <Link to="/about" className="block py-2 nav-link">À propos</Link>
            <Link to="/temoignages" className="block py-2 nav-link">Témoignages</Link>
            <Link to="/galerie" className="block py-2 nav-link">Galerie</Link>
            <Link to="/contact" className="block py-2 nav-link">Contact</Link>
            <Link to="/faq" className="block py-2 nav-link">FAQ</Link>
            <Link to="/espace-client" className="block py-2 nav-link">
              Espace Client
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
