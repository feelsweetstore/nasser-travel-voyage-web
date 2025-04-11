
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, MessageSquare, FileText, BarChart2, Download, Eye, Send, Plus, Pencil, Trash, Mail } from 'lucide-react';
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
import ContactService from '../services/ContactService';
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

  // État pour la gestion des messages de contact
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [activeContactMessage, setActiveContactMessage] = useState<any>(null);
  const [contactResponseDialogOpen, setContactResponseDialogOpen] = useState(false);
  const [contactResponseText, setContactResponseText] = useState('');

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
        
        // Charger les messages de contact
        const messages = ContactService.getMessages();
        setContactMessages(messages);
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

Nous vous remercions pour votre demande de devis concernant votre voyage vers ${destination}, du ${departureDate} au ${returnDate}, en classe ${travelClass} pour ${passengers} passager(s).\n
Voici notre proposition personnalisée :\n
✈️ Détails de l'offre (à remplir par l'agence)\n
Vol : [Compagnie aérienne]\n
Bagages : [Bagages inclus]\n
Temps de vol : [Durée estimée]\n
Escale(s) : [Oui / Non / Nombre]\n
💰 Prix total : \n
📅 Offre valable jusqu'au : [Date limite]\n
🎯 Budget client estimé : ${budget}\n
Veuillez noter que les tarifs de vols sont flexibles et peuvent changer a tout moment.\n
Cependant, merci de bien vouloir nous confirmer votre accord afin de finaliser la réservation et garantir la disponibilité au tarif indiqué.\n 
Si vous souhaitez modifier certaines informations (dates, classe, destination, etc.), n'hésitez pas à nous le faire savoir.\n
Cordialement,\n
L'équipe NASSER TRAVEL HORIZON\n
📞 Tél : +235 66 38 69 37\n
📧 Email : contact@nassertravelhorizon.com\n
📍 N'Djamena, Tchad`;
      } else {
        template = `Objet : Votre réservation de billet pour ${destination} – NASSER TRAVEL HORIZON

Cher(e) ${fullName},

Nous avons bien reçu votre demande de réservation de billet à destination de ${destination}, pour un départ prévu le ${departureDate} et un retour le ${returnDate}, en classe ${travelClass} pour ${passengers} passager(s).\n
Voici les détails de votre réservation en cours de traitement :\n
✈️ Détails du vol proposé (à compléter par l'agence)\n
Compagnie aérienne : [Nom de la compagnie]\n
Heure de départ : [Heure]\n
Heure d'arrivée : [Heure]\n
Escale(s) : [Oui / Non / Détails]\n
Bagages inclus : [Poids / type]\n
Numéro de vol : [XXXX]\n
💰 Tarif total : [Montant en FCFA]\n
📅 Validité de la réservation : [Date limite de confirmation]\n
Afin de finaliser votre réservation, merci de bien vouloir :\n
✅ Confirmer votre accord par retour de message via notre e-mail.\n
✅ Nous faire parvenir une copie de votre passeport (si ce n'est pas encore fait).\n
✅ Procéder au paiement dans le délai mentionné ci-dessus\n
Si vous avez des questions ou souhaitez ajuster certains détails de votre voyage, notre équipe reste à votre entière disposition.\n
Cordialement,\n
L'équipe NASSER TRAVEL HORIZON\n
📞 Tél : +235 66 38 69 37\n
📧 Email : contact@nassertravelhorizon.com\n
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

  // Fonctions de gestion des messages de contact
  const handleViewContactMessage = (message: any) => {
    setActiveContactMessage(message);
  };
  
  const handleCloseContactDetails = () => {
    setActiveContactMessage(null);
  };
  
  const handleOpenContactResponseDialog = () => {
    if (activeContactMessage) {
      // Préremplir avec un modèle de réponse
      const template = `Objet : Réponse à votre message - NASSER TRAVEL HORIZON

Cher(e) ${activeContactMessage.name},

Nous vous remercions pour votre message concernant "${activeContactMessage.subject || 'votre demande'}".\n
[Votre réponse personnalisée ici]\n
N'hésitez pas à nous contacter si vous avez d'autres questions.\n
Cordialement,\n
L'équipe NASSER TRAVEL HORIZON\n
📞 Tél : +235 66 38 69 37\n
📧 Email : contact@nassertravelhorizon.com\n
📍 N'Djamena, Tchad`;
      
      setContactResponseText(template);
      setContactResponseDialogOpen(true);
    }
  };
  
  const handleSendContactResponse = async () => {
    if (!activeContactMessage || !contactResponseText) return;

    try {
      // Stocker la réponse dans le message
      const updatedMessages = contactMessages.map(msg => 
        msg.id === activeContactMessage.id 
          ? { 
              ...msg, 
              response: contactResponseText,
              responseDate: new Date().toISOString(),
              status: "traité" 
            } 
          : msg
      );
      
      // Mise à jour dans le service
      ContactService.updateMessage(activeContactMessage.id, {
        response: contactResponseText,
        responseDate: new Date().toISOString(),
        status: "traité"
      });
      
      setContactMessages(updatedMessages);
      
      // Mettre à jour activeContactMessage avec la réponse
      setActiveContactMessage({
        ...activeContactMessage,
        response: contactResponseText,
        responseDate: new Date().toISOString(),
        status: "traité"
      });
      
      setContactResponseDialogOpen(false);
      
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été enregistrée et envoyée au client.",
      });
    } catch (error) {
      console.error('Error sending contact response:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la réponse.",
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
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Paramètres</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Demandes</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">Contacts</span>
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
                              <p><strong>Date de départ:</strong> {formatDate(activeRequest.departureDate)}</p>
                              <p><strong>Date de retour:</strong> {formatDate(activeRequest.returnDate)}</p>
                              <p><strong>Nombre de passagers:</strong> {activeRequest.passengers}</p>
                              <p><strong>Classe:</strong> {getTravelClassInFrench(activeRequest.travelClass)}</p>
                              {activeRequest.budget && (
                                <p><strong>Budget estimé:</strong> {activeRequest.budget} FCFA</p>
                              )}
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
                        
                        {activeRequest.response && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Votre réponse</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p className="whitespace-pre-line">{activeRequest.response}</p>
                              <div className="text-xs text-gray-500 mt-2">
                                Envoyée le {activeRequest.responseDate ? new Date(activeRequest.responseDate).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {activeRequest.status !== "traité" && (
                            <Button variant="default" onClick={handleOpenResponseDialog}>
                              <Send className="mr-2 h-4 w-4" />
                              Répondre
                            </Button>
                          )}
                          
                          {activeRequest.response && (
                            <Button variant="outline" onClick={handleDirectPDFDownload}>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger PDF
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            onClick={() => handleStatusChange(activeRequest.id, "en attente")}
                            disabled={activeRequest.status === "en attente"}
                          >
                            Marquer en attente
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => handleStatusChange(activeRequest.id, "traité")}
                            disabled={activeRequest.status === "traité"}
                          >
                            Marquer comme traité
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Contacts */}
          <TabsContent value="contacts">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Liste des messages de contact */}
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Messages reçus</CardTitle>
                    <CardDescription>
                      Formulaire de contact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contactMessages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Aucun message pour le moment
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {contactMessages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`p-3 rounded-md cursor-pointer ${activeContactMessage?.id === message.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                            onClick={() => handleViewContactMessage(message)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{message.name}</h4>
                                <p className="text-sm text-gray-500">{message.subject || 'Sans objet'}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                message.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                message.status === "traité" ? "bg-green-100 text-green-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Détails du message */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Détails du message</CardTitle>
                    <CardDescription>
                      {activeContactMessage ? 
                        `Message de ${activeContactMessage.name}` : 
                        'Sélectionnez un message pour voir les détails'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!activeContactMessage ? (
                      <div className="text-center py-12 text-gray-500">
                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>Veuillez sélectionner un message dans la liste</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Informations de contact</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p><strong>Nom:</strong> {activeContactMessage.name}</p>
                              <p><strong>Email:</strong> {activeContactMessage.email}</p>
                              {activeContactMessage.phone && (
                                <p><strong>Téléphone:</strong> {activeContactMessage.phone}</p>
                              )}
                              <p><strong>Date du message:</strong> {new Date(activeContactMessage.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Sujet</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p>{activeContactMessage.subject || 'Aucun sujet spécifié'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Message</h3>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="whitespace-pre-line">{activeContactMessage.message}</p>
                          </div>
                        </div>
                        
                        {activeContactMessage.response && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Votre réponse</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p className="whitespace-pre-line">{activeContactMessage.response}</p>
                              <div className="text-xs text-gray-500 mt-2">
                                Envoyée le {activeContactMessage.responseDate ? new Date(activeContactMessage.responseDate).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {activeContactMessage.status !== "traité" && (
                            <Button variant="default" onClick={handleOpenContactResponseDialog}>
                              <Send className="mr-2 h-4 w-4" />
                              Répondre
                            </Button>
                          )}
                        </div>
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
                <CardTitle>Avis Clients</CardTitle>
                <CardDescription>
                  Gérez les avis et témoignages de vos clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun avis client pour le moment
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.name}</TableCell>
                          <TableCell>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </TableCell>
                          <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={review.published ? "default" : "outline"}>
                              {review.published ? "Publié" : "Non publié"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewReview(review)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant={review.published ? "outline" : "default"} 
                                size="sm"
                                onClick={() => handlePublishReview(review.id, !review.published)}
                              >
                                {review.published ? "Masquer" : "Publier"}
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

          {/* Contenu */}
          <TabsContent value="content">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Gestion du Contenu</CardTitle>
                  <CardDescription>
                    Gérez le contenu du site web
                  </CardDescription>
                </div>
                <Button onClick={handleAddContent}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter du contenu
                </Button>
              </CardHeader>
              <CardContent>
                {contentItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun contenu à afficher
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contentItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{item.section}</TableCell>
                          <TableCell>{item.page}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditContent(item)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500"
                                onClick={() => handleConfirmDeleteContent(item.id)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques du site</CardTitle>
                  <CardDescription>
                    Aperçu des performances de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-md p-4">
                      <h3 className="text-sm text-gray-500">Visites</h3>
                      <p className="text-2xl font-bold">{stats.visits}</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <h3 className="text-sm text-gray-500">Pages vues</h3>
                      <p className="text-2xl font-bold">{stats.pageViews}</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <h3 className="text-sm text-gray-500">Réservations</h3>
                      <p className="text-2xl font-bold">{stats.bookings}</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <h3 className="text-sm text-gray-500">Taux de conversion</h3>
                      <p className="text-2xl font-bold">{stats.conversionRate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Page la plus visitée</CardTitle>
                  <CardDescription>
                    {stats.topPage} - {stats.growth}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] bg-gray-50 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 italic">Graphique de tendance (Démo)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Répondre à la demande</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="min-h-[300px]"
              placeholder="Entrez votre réponse ici..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendResponse}>
              <Send className="mr-2 h-4 w-4" />
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={pdfPreviewOpen} onOpenChange={setPdfPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du document</DialogTitle>
          </DialogHeader>
          <div>
            <ResponsePDFTemplate ref={pdfTemplateRef} request={activeRequest} response={activeRequest?.response || ''} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfPreviewOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de l'avis</DialogTitle>
          </DialogHeader>
          {activeReview && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Client</h3>
                <p>{activeReview.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Note</h3>
                <div className="flex text-lg">{renderStars(activeReview.rating)}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium">Commentaire</h3>
                <p className="bg-gray-50 p-4 rounded-md">{activeReview.comment}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Date</h3>
                <p>{new Date(activeReview.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Fermer
            </Button>
            {activeReview && (
              <Button 
                variant={activeReview.published ? "outline" : "default"}
                onClick={() => {
                  handlePublishReview(activeReview.id, !activeReview.published);
                  setReviewDialogOpen(false);
                }}
              >
                {activeReview.published ? "Masquer" : "Publier"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeContentItem ? 'Modifier le contenu' : 'Ajouter du contenu'}
            </DialogTitle>
          </DialogHeader>
          <ContentForm 
            initialData={activeContentItem} 
            onSave={(data) => {
              handleSaveContent(data);
              setContentDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteContentDialogOpen} onOpenChange={setDeleteContentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce contenu ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le contenu sera définitivement supprimé.
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
      
      <Dialog open={contactResponseDialogOpen} onOpenChange={setContactResponseDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Répondre au message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={contactResponseText}
              onChange={(e) => setContactResponseText(e.target.value)}
              className="min-h-[300px]"
              placeholder="Entrez votre réponse ici..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactResponseDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendContactResponse}>
              <Send className="mr-2 h-4 w-4" />
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminDashboard;
