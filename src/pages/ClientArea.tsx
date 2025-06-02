import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, FileText, Bell, Shield, Loader2, LockIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OnlineReservationService from '../services/OnlineReservationService';
import ClientAreaService from '../services/ClientAreaService';
import EditableProfile from '../components/client/EditableProfile';
import ReservationCard from '../components/client/ReservationCard';

const ClientArea = () => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await ClientAreaService.getStatus();
        setIsEnabled(status);
        
        // Check if user is already logged in
        const loggedIn = ClientAreaService.isLoggedIn();
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
          loadReservations();
        }
      } catch (error) {
        console.error('Error checking client area status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await OnlineReservationService.getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const success = await ClientAreaService.login(loginData.email, loginData.password);
      
      if (success) {
        setIsLoggedIn(true);
        loadReservations();
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace client.",
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    ClientAreaService.logout();
    setIsLoggedIn(false);
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de votre espace client.",
    });
  };

  if (isLoading) {
    return (
      <main className="bg-nasser-light py-16">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-nasser-primary mb-4" />
            <p className="text-gray-600">Chargement de votre espace client...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isEnabled) {
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
  }

  if (!isLoggedIn) {
    return (
      <main className="bg-nasser-light py-16">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-nasser-primary/10 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-nasser-primary" />
              </div>
            </div>
            
            <h1 className="text-3xl font-heading font-bold text-center mb-6">
              Connexion
            </h1>
            
            <p className="text-gray-600 text-center mb-8">
              Connectez-vous à votre espace client pour gérer vos réservations et accéder à vos documents de voyage.
            </p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nasser-primary"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-nasser-primary hover:bg-nasser-primary/90 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Pour les tests, utilisez: demo@example.com / password123
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-nasser-primary/10 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-nasser-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold">
                  Bienvenue dans votre espace
                </h1>
                <p className="text-gray-600">
                  Gérez vos réservations et accédez à vos documents de voyage
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
          
          <Tabs defaultValue="reservations" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Mes réservations</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profil</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reservations">
              <Card>
                <CardHeader>
                  <CardTitle>Mes réservations</CardTitle>
                </CardHeader>
                <CardContent>
                  {reservations.length > 0 ? (
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        <ReservationCard 
                          key={reservation.id} 
                          reservation={reservation} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucune réservation</h3>
                      <p className="text-gray-600 mb-6">
                        Vous n'avez pas encore de réservation active.
                      </p>
                      <Link
                        to="/reserver"
                        className="bg-nasser-primary hover:bg-nasser-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Réserver maintenant
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Mes documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Aucun document</h3>
                    <p className="text-gray-600">
                      Vos billets et documents de voyage apparaîtront ici après votre réservation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Mon profil</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableProfile />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default ClientArea;
