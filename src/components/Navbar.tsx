import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';

const Navbar = () => {
  const { getContentByTitle } = useContent('Global');
  const logoUrl = getContentByTitle('Logo du site', '/placeholder.svg');

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom flex justify-between items-center py-4">
        <Link to="/" className="flex items-center">
          <img src={logoUrl} alt="Logo Nasser Travel" className="h-12" />
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-500">Accueil</Link>
          <Link to="/services" className="hover:text-gray-500">Services</Link>
          <Link to="/a-propos" className="hover:text-gray-500">À propos</Link>
          <Link to="/galerie" className="hover:text-gray-500">Galerie</Link>
          <Link to="/faq" className="hover:text-gray-500">FAQ</Link>
          <Link to="/contact" className="btn-primary">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
