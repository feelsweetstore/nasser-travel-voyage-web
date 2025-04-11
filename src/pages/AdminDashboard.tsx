
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, MessageSquare, FileText, BarChart2, Download, Eye, Send, Plus, Pencil, Trash } from 'lucide-react';
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
import ReviewService from '../services/ReviewService';
import ContentService from '../services/ContentService';
import ContentForm from '../components/admin/ContentForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  
  // État pour la gestion des avis
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // État pour la gestion du contenu
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [activeContentItem, setActiveContentItem] = useState<any>(null);
  const [deleteContentDialogOpen, setDeleteContentDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);

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
    // Charger les paramètres depuis localStorage
    const loadSettings = async () => {
      try {
        const onlineReservationStatus = await OnlineReservationService.getStatus();
        setOnlineReservation(onlineReservationStatus);
        
        // Charger les autres paramètres
        const clientAreaStatus = localStorage.getItem('clientAreaEnabled') === 'true';
        const testimonialsStatus = localStorage.getItem('testimonialsEnabled') !== 'false'; // Par défaut à true
        
        setClientAreaEnabled(clientAreaStatus);
        setTestimonialsEnabled(testimonialsStatus);
        
        // Charger toutes les demandes de formulaires et devis
        const reservations = await OnlineReservationService.getReservations();
        setRequests(reservations);
        
        // Charger les avis clients
        const clientReviews = ReviewService.getReviews();
        setReviews(clientReviews);
        
        // Charger le contenu du site
        const siteContent = ContentService.getContent();
        setContentItems(siteContent);
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
    
    // Enregistrer dans localStorage
    localStorage.setItem('reservations', JSON.stringify(updatedRequests));
    
    toast({
      title: "Statut mis à jour",
      description: `La demande #${id} a été marquée comme "${newStatus}".`,
    });
  };
  
  // Fonctions de gestion des avis
  const handleViewReview = (review: any) => {
    setActiveReview(review);
    setReviewDialogOpen(true);
  };
  
  const handlePublishReview = (id: number, shouldPublish: boolean) => {
    try {
      // Mettre à jour le statut de l'avis
      const updatedReviews = ReviewService.updateReviewStatus(id, shouldPublish);
      setReviews(updatedReviews);
      
      // Si l'avis actif est celui qui a été modifié, mettre à jour son état
      if (activeReview && activeReview.id === id) {
        setActiveReview({ ...activeReview, published: shouldPublish });
      }
      
      toast({
        title: shouldPublish ? "Avis publié" : "Avis masqué",
        description: `L'avis #${id} a été ${shouldPublish ? "publié" : "masqué"}.`,
      });
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'avis.",
        variant: "destructive",
      });
    }
  };
  
  // Fonctions de gestion du contenu
  const handleAddContent = () => {
    setActiveContentItem(null);
    setContentDialogOpen(true);
  };
  
  const handleEditContent = (contentItem: any) => {
    setActiveContentItem(contentItem);
    setContentDialogOpen(true);
  };
  
  const handleSaveContent = (contentItem: any) => {
    try {
      let updatedContent;
      
      if (contentItem.id) {
        // Mise à jour d'un élément existant
        updatedContent = ContentService.updateContent(contentItem.id, contentItem);
        toast({
          title: "Contenu mis à jour",
          description: "Le contenu a été modifié avec succès.",
        });
      } else {
        // Ajout d'un nouvel élément
        const newItem = ContentService.addContent(contentItem);
        updatedContent = [...contentItems, newItem];
        toast({
          title: "Contenu ajouté",
          description: "Le nouveau contenu a été ajouté avec succès.",
        });
      }
      
      setContentItems(updatedContent);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du contenu.",
        variant: "destructive",
      });
    }
  };
  
  const handleConfirmDeleteContent = (id: number) => {
    setContentToDelete(id);
    setDeleteContentDialogOpen(true);
  };
  
  const handleDeleteContent = () => {
    if (!contentToDelete) return;
    
    try {
      const updatedContent = ContentService.deleteContent(contentToDelete);
      setContentItems(updatedContent);
      
      toast({
        title: "Contenu supprimé",
        description: "Le contenu a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du contenu.",
        variant: "destructive",
      });
    } finally {
      setDeleteContentDialogOpen(false);
      setContentToDelete(null);
    }
  };

  const handleViewRequest = (request: any) => {
    setActiveRequest(request);
  };

  const handleCloseDetails = () => {
    setActiveRequest(null);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Non spécifiée';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Date invalide';
    }
  };

  const getTravelClassInFrench = (travelClass: string): string => {
    switch (travelClass) {
      case 'economy': return 'Économique';
      case 'premium': return 'Premium Economy';
      case 'business': return 'Business';
      case 'first': return 'Première classe';
      default: return travelClass || 'Non spécifiée';
    }
  };

  const handleOpenResponseDialog = () => {
    if (activeRequest) {
      // Préremplir avec un modèle de réponse selon le type de demande
      const destination = activeRequest.destination || '[Destination]';
      const fullName = activeRequest.fullName || '[Nom du client]';
      const departureDate = formatDate(activeRequest.departureDate);
      const returnDate = formatDate(activeRequest.returnDate);
      const passengers = activeRequest.passengers || '1';
      const travelClass = getTravelClassInFrench(activeRequest.travelClass);
      const budget = activeRequest.budget ? `${activeRequest.budget} FCFA` : '[Budget non spécifié]';
      
      let template = '';
      
      if (activeRequest.type === 'quote') {
        template = `Objet : Votre devis pour un voyage vers ${destination} – NASSER TRAVEL HORIZON

Cher(e) ${fullName},

Nous vous remercions pour votre demande de devis concernant votre voyage vers ${destination}, du ${departureDate} au ${returnDate}, en classe ${travelClass} pour ${passengers} passager(s).

Voici notre proposition personnalisée :

✈️ Détails de l'offre (à remplir par l'agence)

Vol : [Compagnie aérienne]

Bagages : [Bagages inclus]

Temps de vol : [Durée estimée]

Escale(s) : [Oui / Non / Nombre]

💰 Prix total : 
📅 Offre valable jusqu'au : [Date limite]
🎯 Budget client estimé : ${budget}

Veuillez noter que les tarifs de vols sont flexibles et peuvent changer a tout moment.
Cependant, merci de bien vouloir nous confirmer votre accord afin de finaliser la réservation et garantir la disponibilité au tarif indiqué.
 
Si vous souhaitez modifier certaines informations (dates, classe, destination, etc.), n'hésitez pas à nous le faire savoir.

Cordialement,
L'équipe NASSER TRAVEL HORIZON
📞 Tél : +235 66 38 69 37
📧 Email : contact@nassertravelhorizon.com
📍 N'Djamena, Tchad`;
      } else {
        template = `Objet : Votre réservation de billet pour ${destination} – NASSER TRAVEL HORIZON

Cher(e) ${fullName},

Nous avons bien reçu votre demande de réservation de billet à destination de ${destination}, pour un départ prévu le ${departureDate} et un retour le ${returnDate}, en classe ${travelClass} pour ${passengers} passager(s).

Voici les détails de votre réservation en cours de traitement :

✈️ Détails du vol proposé (à compléter par l'agence)

Compagnie aérienne : [Nom de la compagnie]

Heure de départ : [Heure]

Heure d'arrivée : [Heure]

Escale(s) : [Oui / Non / Détails]

Bagages inclus : [Poids / type]

Numéro de vol : [XXXX]

💰 Tarif total : [Montant en FCFA]
📅 Validité de la réservation : [Date limite de confirmation]

Afin de finaliser votre réservation, merci de bien vouloir :
✅ Confirmer votre accord par retour de message via notre e-mail.
✅ Nous faire parvenir une copie de votre passeport (si ce n'est pas encore fait).
✅ Procéder au paiement dans le délai mentionné ci-dessus

Si vous avez des questions ou souhaitez ajuster certains détails de votre voyage, notre équipe reste à votre entière disposition.

Cordialement,
L'équipe NASSER TRAVEL HORIZON
📞 Tél : +235 66 38 69 37
📧 Email : contact@nassertravelhorizon.com
📍 N'Djamena, Tchad`;
      }
      
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

  // Fonction qui génère un rang d'étoiles pour l'affichage des avis
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index} className={index < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
    ));
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
                              {activeRequest.type === 'quote' && activeRequest.budget && 
                                <p><strong>Budget estimé:</strong> {activeRequest.budget} FCFA</p>
                              }
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

          {/* Avis - Mise à jour complète avec fonctionnalités opérationnelles */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Avis clients</CardTitle>
                  <CardDescription>
                    Gérez les avis clients laissés sur le site
                  </CardDescription>
                </div>
                <p className="text-sm text-muted-foreground">
                  {reviews.filter(r => r.published).length} avis publiés / {reviews.length} total
                </p>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Aucun avis client pour le moment</p>
                  </div>
                ) : (
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
                          <TableCell>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </TableCell>
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
                              onClick={() => handleViewReview(review)}
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contenu - Mise à jour avec fonctionnalités opérationnelles */}
          <TabsContent value="content">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestion du contenu</CardTitle>
                  <CardDescription>
                    Modifiez le contenu des pages du site
                  </CardDescription>
                </div>
                <Button onClick={handleAddContent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                {contentItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Aucun contenu pour le moment</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Titre</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead>Contenu</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contentItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.page}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{item.content}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditContent(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleConfirmDeleteContent(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Statistiques */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques du site</CardTitle>
                <CardDescription>
                  Performances et analytiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Visites</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 p-4">
                      <p className="text-3xl font-bold">{stats.visits}</p>
                      <p className="text-sm text-gray-500">{stats.growth}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Pages vues</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 p-4">
                      <p className="text-3xl font-bold">{stats.pageViews}</p>
                      <p className="text-sm text-gray-500">Page la plus visitée: {stats.topPage}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Réservations</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 p-4">
                      <p className="text-3xl font-bold">{stats.bookings}</p>
                      <p className="text-sm text-gray-500">Taux de conversion: {stats.conversionRate}</p>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Répondre à la demande</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={responseText} 
              onChange={(e) => setResponseText(e.target.value)} 
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendResponse}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'aperçu PDF */}
      <Dialog open={pdfPreviewOpen} onOpenChange={setPdfPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du PDF</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div ref={pdfTemplateRef} id="pdfTemplate" className="border p-8 rounded-md bg-white">
              <ResponsePDFTemplate request={activeRequest} response={activeRequest?.response || ''} />
            </div>
          </div>
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
      
      {/* Dialogue de détail d'avis */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Détail de l'avis</DialogTitle>
          </DialogHeader>
          {activeReview && (
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">{activeReview.name}</h3>
                  <p className="text-gray-500">{activeReview.email}</p>
                </div>
                <Badge variant={activeReview.published ? "default" : "outline"}>
                  {activeReview.published ? "Publié" : "Non publié"}
                </Badge>
              </div>
              
              <div>
                <div className="flex mb-2">
                  {renderStars(activeReview.rating)}
                  <span className="ml-2 text-sm text-gray-500">{activeReview.rating}/5</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="italic">"{activeReview.message}"</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                  Fermer
                </Button>
                <Button 
                  variant={activeReview.published ? "destructive" : "default"}
                  onClick={() => handlePublishReview(activeReview.id, !activeReview.published)}
                >
                  {activeReview.published ? "Masquer l'avis" : "Publier l'avis"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Formulaire d'ajout/édition de contenu */}
      <ContentForm 
        isOpen={contentDialogOpen}
        onClose={() => setContentDialogOpen(false)}
        onSave={handleSaveContent}
        contentItem={activeContentItem}
      />
      
      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteContentDialogOpen} onOpenChange={setDeleteContentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContent} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default AdminDashboard;
