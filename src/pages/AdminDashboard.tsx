
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
                              {activeRequest.budget && <p><strong>Budget:</strong> {activeRequest.budget} FCFA</p>}
                            </div>
                          </div>
                        </div>
                        
                        {activeRequest.additionalInfo && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Informations complémentaires</h3>
                            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                              {activeRequest.additionalInfo}
                            </div>
                          </div>
                        )}
                        
                        {activeRequest.response && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Réponse envoyée</h3>
                            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                              {activeRequest.response}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Envoyée le {formatDate(activeRequest.responseDate)}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-3 pt-2">
                          {!activeRequest.response ? (
                            <Button 
                              onClick={handleOpenResponseDialog}
                              className="flex items-center gap-2"
                            >
                              <Send className="h-4 w-4" />
                              Répondre
                            </Button>
                          ) : (
                            <>
                              <Button 
                                onClick={handleDirectPDFDownload}
                                className="flex items-center gap-2"
                                variant="outline"
                              >
                                <Download className="h-4 w-4" />
                                Télécharger PDF
                              </Button>
                              <Button 
                                onClick={generatePDF}
                                className="flex items-center gap-2"
                                variant="outline"
                              >
                                <Eye className="h-4 w-4" />
                                Aperçu PDF
                              </Button>
                            </>
                          )}
                          
                          {activeRequest.status !== "traité" && (
                            <Button 
                              onClick={() => handleStatusChange(activeRequest.id, "traité")}
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              Marquer comme traité
                            </Button>
                          )}
                          
                          {activeRequest.status !== "en attente" && (
                            <Button 
                              onClick={() => handleStatusChange(activeRequest.id, "en attente")}
                              variant="outline"
                              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            >
                              Marquer en attente
                            </Button>
                          )}
                          
                          <Button 
                            onClick={handleCloseDetails}
                            variant="ghost"
                          >
                            Fermer
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Onglet Contacts */}
          <TabsContent value="contacts">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Liste des messages de contact */}
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Messages de contact</CardTitle>
                    <CardDescription>
                      Demandes d'information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="px-6">
                      <div className="max-h-[70vh] overflow-y-auto">
                        {contactMessages.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun message pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {contactMessages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeContactMessage?.id === message.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewContactMessage(message)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{message.name}</h4>
                                    <p className="text-sm text-gray-500 truncate">{message.subject || "Sans objet"}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    message.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    message.status === "traité" ? "bg-green-100 text-green-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Détails du message de contact */}
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
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Informations du contact</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p><strong>Nom:</strong> {activeContactMessage.name}</p>
                              <p><strong>Email:</strong> {activeContactMessage.email}</p>
                              {activeContactMessage.phone && <p><strong>Téléphone:</strong> {activeContactMessage.phone}</p>}
                              <p><strong>Date du message:</strong> {new Date(activeContactMessage.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Sujet et message</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p><strong>Sujet:</strong> {activeContactMessage.subject || "Sans objet"}</p>
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="whitespace-pre-wrap">{activeContactMessage.message}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {activeContactMessage.response && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Réponse envoyée</h3>
                            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                              {activeContactMessage.response}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Envoyée le {formatDate(activeContactMessage.responseDate)}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-3 pt-2">
                          {!activeContactMessage.response ? (
                            <Button 
                              onClick={handleOpenContactResponseDialog}
                              className="flex items-center gap-2"
                            >
                              <Send className="h-4 w-4" />
                              Répondre
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => {
                                // Logique pour renvoyer un mail si nécessaire
                                handleOpenContactResponseDialog();
                              }}
                              className="flex items-center gap-2"
                              variant="outline"
                            >
                              <Send className="h-4 w-4" />
                              Renvoyer
                            </Button>
                          )}
                          
                          {activeContactMessage.status !== "traité" && (
                            <Button 
                              onClick={() => {
                                ContactService.updateMessage(activeContactMessage.id, { status: "traité" });
                                setActiveContactMessage({...activeContactMessage, status: "traité"});
                                const updatedMessages = contactMessages.map(m => 
                                  m.id === activeContactMessage.id ? {...m, status: "traité"} : m
                                );
                                setContactMessages(updatedMessages);
                                
                                toast({
                                  title: "Statut mis à jour",
                                  description: "Le message a été marqué comme traité."
                                });
                              }}
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              Marquer comme traité
                            </Button>
                          )}
                          
                          <Button 
                            onClick={handleCloseContactDetails}
                            variant="ghost"
                          >
                            Fermer
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Onglet Avis */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des avis clients</CardTitle>
                <CardDescription>
                  Approuver et publier les avis clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                          Aucun avis client pour le moment
                        </TableCell>
                      </TableRow>
                    ) : (
                      reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                              <span className="ml-2">{review.rating}/5</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={review.published ? "default" : "outline"}>
                              {review.published ? "Publié" : "Non publié"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewReview(review)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handlePublishReview(review.id, !review.published)}
                                className={review.published ? "text-red-500" : "text-green-500"}
                              >
                                {review.published ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Contenu */}
          <TabsContent value="content">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Gestion du contenu</CardTitle>
                  <CardDescription>
                    Gérez les textes, images et informations du site
                  </CardDescription>
                </div>
                <Button onClick={handleAddContent} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter du contenu
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Identifiant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                          Aucun élément de contenu. Ajoutez-en pour personnaliser votre site.
                        </TableCell>
                      </TableRow>
                    ) : (
                      contentItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.key}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {item.type === 'text' && 'Texte'}
                              {item.type === 'image' && 'Image'}
                              {item.type === 'link' && 'Lien'}
                              {item.type === 'contact' && 'Contact'}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.section}</TableCell>
                          <TableCell className="max-w-xs truncate">{
                            item.type === 'text' ? item.value.substring(0, 50) + (item.value.length > 50 ? '...' : '') :
                            item.type === 'image' ? 'URL image' :
                            item.type === 'link' ? item.label || 'Lien' :
                            item.label || 'Information'
                          }</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
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
                                className="text-red-500"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Statistiques */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visites</CardTitle>
                  <CardDescription>Nombre total de visites</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stats.visits}</div>
                  <p className="text-sm text-green-600 mt-2">{stats.growth}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pages vues</CardTitle>
                  <CardDescription>Pages consultées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stats.pageViews}</div>
                  <p className="text-sm mt-2">Page la plus consultée: <span className="font-medium">{stats.topPage}</span></p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Réservations</CardTitle>
                  <CardDescription>Nombre de réservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stats.bookings}</div>
                  <p className="text-sm mt-2">Taux de conversion: <span className="font-medium">{stats.conversionRate}</span></p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog pour la réponse à une demande */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Répondre à la demande</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              className="min-h-[400px] font-mono text-sm"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Votre réponse..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSendResponse} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour la réponse à un message de contact */}
      <Dialog open={contactResponseDialogOpen} onOpenChange={setContactResponseDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Répondre au message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              className="min-h-[400px] font-mono text-sm"
              value={contactResponseText}
              onChange={(e) => setContactResponseText(e.target.value)}
              placeholder="Votre réponse..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactResponseDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSendContactResponse} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour la visualisation d'un avis */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avis client</DialogTitle>
          </DialogHeader>
          {activeReview && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{activeReview.name}</h3>
                  <div className="flex items-center mt-1">
                    {renderStars(activeReview.rating)}
                    <span className="ml-2 text-sm text-gray-600">{activeReview.rating}/5</span>
                  </div>
                </div>
                <Badge variant={activeReview.published ? "default" : "outline"}>
                  {activeReview.published ? "Publié" : "Non publié"}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Témoignage:</h4>
                <div className="bg-gray-50 p-3 rounded-md mt-1">
                  {activeReview.comment}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Soumis le {new Date(activeReview.date).toLocaleDateString()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Fermer</Button>
            {activeReview && (
              <Button 
                onClick={() => {
                  handlePublishReview(activeReview.id, !activeReview.published);
                  setReviewDialogOpen(false);
                }}
                variant={activeReview.published ? "destructive" : "default"}
              >
                {activeReview.published ? "Masquer l'avis" : "Publier l'avis"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour l'ajout/modification de contenu */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeContentItem ? "Modifier le contenu" : "Ajouter du contenu"}</DialogTitle>
          </DialogHeader>
          <div>
            <ContentForm 
              contentItem={activeContentItem} 
              onSave={(item) => {
                handleSaveContent(item);
                setContentDialogOpen(false);
              }}
              onCancel={() => setContentDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour la confirmation de suppression de contenu */}
      <AlertDialog open={deleteContentDialogOpen} onOpenChange={setDeleteContentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement cet élément de contenu du site.
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
      
      {/* Dialog pour l'aperçu PDF */}
      <Dialog open={pdfPreviewOpen} onOpenChange={setPdfPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Aperçu du document</DialogTitle>
          </DialogHeader>
          <div className="bg-white p-4 rounded-md border" id="pdfTemplate" ref={pdfTemplateRef}>
            <ResponsePDFTemplate 
              request={activeRequest}
              title={activeRequest?.type === 'quote' ? 'Devis Personnalisé' : 'Confirmation de Réservation'}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfPreviewOpen(false)}>Fermer</Button>
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminDashboard;
