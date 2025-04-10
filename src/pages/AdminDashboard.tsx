
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, MessageSquare, FileText, BarChart2, Download, Eye, Send } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import OnlineReservationService from '../services/OnlineReservationService';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import PDFService from '../services/PDFService';
import ResponsePDFTemplate from '../components/pdf/ResponsePDFTemplate';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [onlineReservation, setOnlineReservation] = useState(false);
  const [clientAreaEnabled, setClientAreaEnabled] = useState(false);
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  
  // Mock data for this example
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

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = async () => {
      try {
        const onlineReservationStatus = await OnlineReservationService.getStatus();
        setOnlineReservation(onlineReservationStatus);
        
        // Load other settings
        const clientAreaStatus = localStorage.getItem('clientAreaEnabled') === 'true';
        const testimonialsStatus = localStorage.getItem('testimonialsEnabled') !== 'false'; // Default to true
        
        setClientAreaEnabled(clientAreaStatus);
        setTestimonialsEnabled(testimonialsStatus);
        
        // Load all form requests and quotes
        const reservations = await OnlineReservationService.getReservations();
        setRequests(reservations);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleReservationToggle = async () => {
    try {
      setIsLoading(true);
      const newStatus = !onlineReservation;
      await OnlineReservationService.updateStatus(newStatus);
      setOnlineReservation(newStatus);
      
      toast({
        title: newStatus ? "Réservation en ligne activée" : "Réservation en ligne désactivée",
        description: newStatus 
          ? "Les clients peuvent maintenant réserver en ligne." 
          : "La réservation en ligne est maintenant désactivée.",
      });
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClientAreaToggle = () => {
    const newStatus = !clientAreaEnabled;
    setClientAreaEnabled(newStatus);
    localStorage.setItem('clientAreaEnabled', newStatus.toString());
    
    toast({
      title: newStatus ? "Espace client activé" : "Espace client désactivé",
      description: newStatus 
        ? "L'espace client est maintenant accessible." 
        : "L'espace client est maintenant désactivé.",
    });
  };
  
  const handleTestimonialsToggle = () => {
    const newStatus = !testimonialsEnabled;
    setTestimonialsEnabled(newStatus);
    localStorage.setItem('testimonialsEnabled', newStatus.toString());
    
    toast({
      title: newStatus ? "Témoignages activés" : "Témoignages désactivés",
      description: newStatus 
        ? "La section témoignages est maintenant visible." 
        : "La section témoignages est maintenant masquée.",
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    );
    
    setRequests(updatedRequests);
    
    // Save to localStorage
    localStorage.setItem('reservations', JSON.stringify(updatedRequests));
    
    toast({
      title: "Statut mis à jour",
      description: `La demande #${id} a été marquée comme "${newStatus}".`,
    });
  };
  
  const handlePublishReview = (id: number, shouldPublish: boolean) => {
    toast({
      title: shouldPublish ? "Avis publié" : "Avis masqué",
      description: `L'avis #${id} a été ${shouldPublish ? "publié" : "masqué"}.`,
    });
  };
  
  const handleContentEdit = (id: number) => {
    toast({
      title: "Éditeur ouvert",
      description: `Modification du contenu #${id}.`,
    });
  };

  const handleViewRequest = (request: any) => {
    setActiveRequest(request);
  };

  const handleCloseDetails = () => {
    setActiveRequest(null);
  };

  const handleOpenResponseDialog = () => {
    if (activeRequest) {
      // Préremplir avec un modèle de réponse selon le type de demande
      const template = activeRequest.type === 'quote' 
        ? `Cher(e) ${activeRequest.fullName},\n\nMerci pour votre demande de devis pour ${activeRequest.destination}.\n\nVoici notre offre personnalisée:\n- \n- \n- \n\nPrix total: \n\nCette offre est valable jusqu'au \n\nCordialement,\nL'équipe NASSER TRAVEL HORIZON`
        : `Cher(e) ${activeRequest.fullName},\n\nMerci pour votre demande de réservation pour ${activeRequest.destination}.\n\nVotre réservation est confirmée avec les détails suivants:\n- \n- \n- \n\nMontant total: \n\nCordialement,\nL'équipe NASSER TRAVEL HORIZON`;
      
      setResponseText(template);
      setResponseDialogOpen(true);
    }
  };

  const handleSendResponse = async () => {
    if (!activeRequest || !responseText) return;

    try {
      // Stocker la réponse dans la demande
      const updatedRequests = requests.map(req => 
        req.id === activeRequest.id 
          ? { 
              ...req, 
              response: responseText,
              responseDate: new Date().toISOString(),
              status: "traité" 
            } 
          : req
      );
      
      setRequests(updatedRequests);
      localStorage.setItem('reservations', JSON.stringify(updatedRequests));
      
      // Mettre à jour activeRequest avec la réponse
      setActiveRequest({
        ...activeRequest,
        response: responseText,
        responseDate: new Date().toISOString(),
        status: "traité"
      });
      
      setResponseDialogOpen(false);
      
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été enregistrée et envoyée au client.",
      });
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la réponse.",
        variant: "destructive",
      });
    }
  };

  const generatePDF = () => {
    if (!activeRequest) return;
    
    try {
      // Générer le PDF avec les données
      setPdfPreviewOpen(true);
      
      // Le PDF sera généré quand l'utilisateur cliquera sur télécharger
      // dans la fenêtre d'aperçu
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadPDF = () => {
    if (!activeRequest || !pdfTemplateRef.current) return;
    
    try {
      // Utiliser html2canvas et jsPDF pour générer le PDF
      const filename = `${activeRequest.type === 'quote' ? 'devis' : 'reservation'}-${activeRequest.id}`;
      
      PDFService.generatePDF('pdfTemplate', filename);
      
      toast({
        title: "PDF téléchargé",
        description: "Le document a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du PDF.",
        variant: "destructive",
      });
    }
  };
  
  const handleDirectPDFDownload = () => {
    if (!activeRequest) return;
    
    try {
      // Générer directement le PDF sans aperçu
      const filename = `${activeRequest.type === 'quote' ? 'devis' : 'reservation'}-${activeRequest.id}`;
      
      PDFService.generateResponsePDF({
        ...activeRequest,
        response: activeRequest.response
      }, activeRequest.type === 'quote' ? 'Devis Personnalisé' : 'Confirmation de Réservation', filename);
      
      toast({
        title: "PDF téléchargé",
        description: "Le document a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du PDF.",
        variant: "destructive",
      });
    }
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
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Espace client</h3>
                      <p className="text-sm text-gray-500">Activer l'espace client</p>
                    </div>
                    <Switch 
                      checked={clientAreaEnabled}
                      onCheckedChange={handleClientAreaToggle}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Témoignages</h3>
                      <p className="text-sm text-gray-500">Activer la section témoignages</p>
                    </div>
                    <Switch 
                      checked={testimonialsEnabled}
                      onCheckedChange={handleTestimonialsToggle}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demandes */}
          <TabsContent value="requests">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Liste des demandes */}
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Demandes reçues</CardTitle>
                    <CardDescription>
                      Réservations et devis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="all" className="px-6">
                      <TabsList className="mb-4 w-full">
                        <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
                        <TabsTrigger value="reservations" className="flex-1">Réservations</TabsTrigger>
                        <TabsTrigger value="quotes" className="flex-1">Devis</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="max-h-[70vh] overflow-y-auto">
                        {requests.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucune demande pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {requests.map((request) => (
                              <div 
                                key={request.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeRequest?.id === request.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewRequest(request)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{request.fullName}</h4>
                                    <p className="text-sm text-gray-500">{request.destination}</p>
                                  </div>
                                  <Badge variant={request.type === 'quote' ? 'outline' : 'default'} className="ml-2">
                                    {request.type === 'quote' ? 'Devis' : 'Réservation'}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    request.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    request.status === "traité" ? "bg-green-100 text-green-800" :
                                    request.status === "en attente" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="reservations" className="max-h-[70vh] overflow-y-auto">
                        {requests.filter(r => r.type !== 'quote').length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucune réservation pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {requests.filter(r => r.type !== 'quote').map((request) => (
                              <div 
                                key={request.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeRequest?.id === request.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewRequest(request)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{request.fullName}</h4>
                                    <p className="text-sm text-gray-500">{request.destination}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    request.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    request.status === "traité" ? "bg-green-100 text-green-800" :
                                    request.status === "en attente" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="quotes" className="max-h-[70vh] overflow-y-auto">
                        {requests.filter(r => r.type === 'quote').length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucune demande de devis pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {requests.filter(r => r.type === 'quote').map((request) => (
                              <div 
                                key={request.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeRequest?.id === request.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewRequest(request)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{request.fullName}</h4>
                                    <p className="text-sm text-gray-500">{request.destination}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    request.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    request.status === "traité" ? "bg-green-100 text-green-800" :
                                    request.status === "en attente" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              {/* Détails de la demande */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Détails de la demande</CardTitle>
                    <CardDescription>
                      {activeRequest ? 
                        `${activeRequest.type === 'quote' ? 'Demande de devis' : 'Réservation'} - ${activeRequest.fullName}` : 
                        'Sélectionnez une demande pour voir les détails'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!activeRequest ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>Veuillez sélectionner une demande dans la liste</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Informations client</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p><strong>Nom:</strong> {activeRequest.fullName}</p>
                              <p><strong>Email:</strong> {activeRequest.email}</p>
                              <p><strong>Téléphone:</strong> {activeRequest.whatsapp || activeRequest.phone}</p>
                              <p><strong>Date de demande:</strong> {new Date(activeRequest.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Détails du voyage</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p><strong>Destination:</strong> {activeRequest.destination}</p>
                              <p>
                                <strong>Date de départ:</strong> {activeRequest.departureDate ? new Date(activeRequest.departureDate).toLocaleDateString() : 'Non spécifiée'}
                              </p>
                              <p>
                                <strong>Date de retour:</strong> {activeRequest.returnDate ? new Date(activeRequest.returnDate).toLocaleDateString() : 'Non spécifiée'}
                              </p>
                              <p><strong>Nombre de passagers:</strong> {activeRequest.passengers}</p>
                              <p><strong>Classe:</strong> {
                                activeRequest.travelClass === 'economy' ? 'Économique' :
                                activeRequest.travelClass === 'premium' ? 'Premium Economy' :
                                activeRequest.travelClass === 'business' ? 'Business' :
                                activeRequest.travelClass === 'first' ? 'Première classe' :
                                activeRequest.travelClass
                              }</p>
                            </div>
                          </div>
                        </div>
                        
                        {activeRequest.message && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Message du client</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p>{activeRequest.message}</p>
                            </div>
                          </div>
                        )}
                        
                        {activeRequest.response ? (
                          <div>
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium text-gray-500 mb-1">Votre réponse</h3>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => generatePDF()}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Aperçu PDF
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleDirectPDFDownload}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Télécharger PDF
                                </Button>
                              </div>
                            </div>
                            <div className="bg-nasser-primary/5 border border-nasser-primary/20 p-4 rounded-md">
                              <p className="whitespace-pre-line">{activeRequest.response}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Envoyée le {new Date(activeRequest.responseDate).toLocaleDateString()} à {new Date(activeRequest.responseDate).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={handleCloseDetails}>
                              Fermer
                            </Button>
                            <Button onClick={handleOpenResponseDialog}>
                              <Send className="h-4 w-4 mr-2" />
                              Répondre
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
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
                          <button 
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => toast({
                              title: "Détails de l'avis",
                              description: `"${review.message}"`,
                            })}
                          >
                            Voir
                          </button>
                          <button 
                            className="text-sm text-green-600 hover:underline ml-2"
                            onClick={() => handlePublishReview(review.id, !review.published)}
                          >
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
                          <button 
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => handleContentEdit(item.id)}
                          >
                            Modifier
                          </button>
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
      
      {/* Dialogue de réponse */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Répondre à {activeRequest?.type === 'quote' ? 'la demande de devis' : 'la réservation'} de {activeRequest?.fullName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <p className="text-sm text-gray-500">
              Rédigez votre réponse ci-dessous. Cette réponse sera enregistrée et pourra être téléchargée au format PDF.
            </p>
            <Textarea 
              value={responseText} 
              onChange={(e) => setResponseText(e.target.value)} 
              rows={12}
              placeholder="Rédigez votre réponse ici..."
              className="font-mono"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendResponse}>
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Aperçu PDF Dialog */}
      <Dialog open={pdfPreviewOpen} onOpenChange={setPdfPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Aperçu du PDF
            </DialogTitle>
          </DialogHeader>
          
          <ResponsePDFTemplate 
            ref={pdfTemplateRef}
            request={activeRequest}
            response={activeRequest?.response || ''}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfPreviewOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminDashboard;
