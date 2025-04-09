
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, MessageSquare, FileText, BarChart2, Switch as SwitchIcon } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminDashboard = () => {
  const [onlineReservation, setOnlineReservation] = useState(false);
  
  // Mock data for this example
  const formRequests = [
    { id: 1, name: "Jean Dupont", email: "jean@example.com", destination: "Paris", date: "2025-05-15", status: "Nouveau" },
    { id: 2, name: "Marie Martin", email: "marie@example.com", destination: "Dubai", date: "2025-06-02", status: "Traité" },
    { id: 3, name: "Ahmed Bako", email: "ahmed@example.com", destination: "Istanbul", date: "2025-05-20", status: "En attente" },
  ];
  
  const reviews = [
    { id: 1, name: "Thomas Jean", email: "thomas@example.com", rating: 5, message: "Service exceptionnel et rapide!", published: true },
    { id: 2, name: "Sarah Ouma", email: "sarah@example.com", rating: 4, message: "Très bonne expérience, je recommande.", published: true },
    { id: 3, name: "Ali Mohammed", email: "ali@example.com", rating: 3, message: "Service correct mais délai un peu long.", published: false },
  ];
  
  const contentItems = [
    { id: 1, title: "Texte d'accueil", page: "Accueil", content: "Bienvenue chez NASSER TRAVEL HORIZON..." },
    { id: 2, title: "À propos", page: "À propos", content: "NASSER TRAVEL HORIZON est une agence de voyage..." },
    { id: 3, title: "Services", page: "Services", content: "Nous offrons une gamme complète de services..." },
  ];

  // Stats mock data
  const stats = {
    visits: 2543,
    pageViews: 12876,
    bookings: 87,
    topPage: "Accueil",
    conversionRate: "3.4%",
    growth: "+12% cette semaine"
  };

  const handleReservationToggle = () => {
    setOnlineReservation(!onlineReservation);
  };

  return (
    <main className="bg-white py-10">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Tableau de bord administrateur
          </h1>
          <p className="text-gray-600">
            Gérez les fonctionnalités et le contenu du site NASSER TRAVEL HORIZON.
          </p>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Paramètres</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Demandes</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">Avis</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Contenu</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden md:inline">Statistiques</span>
            </TabsTrigger>
          </TabsList>

          {/* Paramètres */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Activez ou désactivez les fonctionnalités du site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Réservation en ligne</h3>
                      <p className="text-sm text-gray-500">Permet aux clients de réserver directement en ligne</p>
                    </div>
                    <Switch 
                      checked={onlineReservation} 
                      onCheckedChange={handleReservationToggle} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Espace client</h3>
                      <p className="text-sm text-gray-500">Activer l'espace client (en développement)</p>
                    </div>
                    <Switch disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Témoignages</h3>
                      <p className="text-sm text-gray-500">Activer la section témoignages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demandes */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Demandes de réservation</CardTitle>
                <CardDescription>
                  Gérez les demandes de réservation reçues via le formulaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.destination}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === "Nouveau" ? "bg-blue-100 text-blue-800" :
                            request.status === "Traité" ? "bg-green-100 text-green-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <button className="text-sm text-blue-600 hover:underline">Voir</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avis */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Avis clients</CardTitle>
                <CardDescription>
                  Gérez les avis clients laissés sur le site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{review.id}</TableCell>
                        <TableCell>{review.name}</TableCell>
                        <TableCell>{review.email}</TableCell>
                        <TableCell>{review.rating}/5</TableCell>
                        <TableCell className="max-w-[200px] truncate">{review.message}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            review.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {review.published ? "Publié" : "Non publié"}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <button className="text-sm text-blue-600 hover:underline">Voir</button>
                          <button className="text-sm text-green-600 hover:underline ml-2">
                            {review.published ? "Masquer" : "Publier"}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenu */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du contenu</CardTitle>
                <CardDescription>
                  Modifiez les textes et contenus du site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Contenu</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.page}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{item.content}</TableCell>
                        <TableCell>
                          <button className="text-sm text-blue-600 hover:underline">Modifier</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistiques */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques du site</CardTitle>
                <CardDescription>
                  Aperçu des performances du site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.visits}</div>
                      <p className="text-sm text-gray-500">Visites totales</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.pageViews}</div>
                      <p className="text-sm text-gray-500">Pages vues</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.bookings}</div>
                      <p className="text-sm text-gray-500">Réservations</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.topPage}</div>
                      <p className="text-sm text-gray-500">Page la plus visitée</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.conversionRate}</div>
                      <p className="text-sm text-gray-500">Taux de conversion</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">{stats.growth}</div>
                      <p className="text-sm text-gray-500">Croissance</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
