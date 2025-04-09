
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, FileText, Bell, Clock, Shield } from 'lucide-react';

const ClientArea = () => {
  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-nasser-primary/10 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-nasser-primary" />
              </div>
              <div className="absolute -top-2 -right-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-white">
                  Bientôt
                </span>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-6">
            Espace Client
          </h1>
          
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Notre espace client est en cours de développement et sera bientôt disponible pour améliorer votre expérience avec NASSER TRAVEL HORIZON.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <Calendar className="h-8 w-8 text-nasser-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Gérez vos réservations</h3>
                <p className="text-gray-600">Consultez l'historique et le statut de vos réservations à tout moment.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <FileText className="h-8 w-8 text-nasser-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Téléchargez vos documents</h3>
                <p className="text-gray-600">Accédez à vos billets et documents de voyage en un clic.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <Bell className="h-8 w-8 text-nasser-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Recevez des notifications</h3>
                <p className="text-gray-600">Soyez informé des changements de vol et des offres spéciales.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <Shield className="h-8 w-8 text-nasser-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Profitez d'un espace sécurisé</h3>
                <p className="text-gray-600">Vos données personnelles et vos paiements sont entièrement protégés.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-nasser-primary/5 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Clock className="h-6 w-6 text-nasser-primary mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Date de lancement prévue</h3>
                <p className="text-gray-700">Notre espace client sera disponible au premier trimestre 2025. Nous travaillons d'arrache-pied pour vous offrir la meilleure expérience possible.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Vous souhaitez être informé du lancement de notre espace client ?
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center bg-nasser-primary hover:bg-nasser-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientArea;
