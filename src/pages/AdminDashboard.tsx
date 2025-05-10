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
  
  const handleDirectPDFDownload = () => {
    if (!activeRequest) return;
    
    try {
      // Générer directement le PDF avec un nom incluant celui du client
      const filename = `${activeRequest.type === 'quote' ? 'Devis' : 'Reservation'}-${activeRequest.fullName.replace(/\s+/g, '_')}`;
      
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
  
  const handleDownloadPDF = () => {
    if (!activeRequest || !pdfTemplateRef.current) return;
    
    try {
      // Utiliser html2canvas et jsPDF pour générer le PDF avec un nom personnalisé
      const filename = `${activeRequest.type === 'quote' ? 'Devis' : 'Reservation'}-${activeRequest.fullName.replace(/\s+/g, '_')}`;
      
      PDFService.generatePDF('pdfTemplate', filename);
      
      toast({
        title: "PDF téléchargé",
        description: "Le document a été téléchargé avec succès.",
      });
      
      // Fermer automatiquement la fenêtre d'aperçu après téléchargement
      setTimeout(() => {
        setPdfPreviewOpen(false);
      }, 500);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du PDF.",
        variant: "destructive",
      });
    }
  };

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
Nous vous remercions pour votre message concernant "${activeContactMessage.subject || 'votre demande'}".

[Votre réponse personnalisée ici]

N'hésitez pas à nous contacter si vous avez d'autres questions.

Cordialement,
L'équipe NASSER TRAVEL HORIZON
📞 Tél : +235 66 38 69 37
📧 Email : contact@nassertravelhorizon.com
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

  const handleContactPDFDownload = () => {
    if (!activeContactMessage) return;
    
    try {
      // Générer le PDF pour le message de contact
      const filename = `Contact-${activeContactMessage.name.replace(/\s+/g, '_')}`;
      
      PDFService.generateResponsePDF({
        ...activeContactMessage,
        response: activeContactMessage.response
      }, 'Réponse à votre message', filename);
      
      toast({
        title: "PDF téléchargé",
        description: "Le document a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Error downloading contact PDF:', error);
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
                                  <Badge variant={request.type === 'quote' ? 'outline' : 'default'}>
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
              
              {/* Détails de la demande sélectionnée (ou message vide si aucune demande sélectionnée) */}
              <div className="md:col-span-2">
                {!activeRequest ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <h3 className="text-lg font-medium mb-1">Aucune demande sélectionnée</h3>
                      <p>Cliquez sur une demande pour afficher ses détails</p>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {activeRequest.fullName}
                          <Badge variant={activeRequest.type === 'quote' ? 'outline' : 'default'}>
                            {activeRequest.type === 'quote' ? 'Devis' : 'Réservation'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Créé le {formatDate(activeRequest.createdAt)} · {activeRequest.email}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                        ×
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Informations du voyage */}
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium mb-2">Détails du voyage</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p><span className="font-medium">Destination:</span> {activeRequest.destination}</p>
                            <p><span className="font-medium">Date de départ:</span> {formatDate(activeRequest.departureDate)}</p>
                            <p><span className="font-medium">Date de retour:</span> {formatDate(activeRequest.returnDate)}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Passagers:</span> {activeRequest.passengers || '1'}</p>
                            <p><span className="font-medium">Classe:</span> {getTravelClassInFrench(activeRequest.travelClass)}</p>
                            {activeRequest.budget && (
                              <p><span className="font-medium">Budget:</span> {activeRequest.budget} FCFA</p>
                            )}
                          </div>
                        </div>
                        {activeRequest.message && (
                          <div className="mt-3">
                            <h4 className="font-medium mb-1">Message:</h4>
                            <p className="text-sm">{activeRequest.message}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Coordonnées */}
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium mb-2">Coordonnées</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p><span className="font-medium">Nom:</span> {activeRequest.fullName}</p>
                            <p><span className="font-medium">Email:</span> {activeRequest.email}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Téléphone:</span> {activeRequest.phone || 'Non spécifié'}</p>
                            <p><span className="font-medium">WhatsApp:</span> {activeRequest.whatsapp || 'Non spécifié'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 justify-between">
                        <div className="space-x-2">
                          <Button 
                            onClick={handleOpenResponseDialog} 
                            className="flex items-center gap-2"
                            disabled={isLoading}
                          >
                            <Send className="h-4 w-4" />
                            {activeRequest.response ? 'Modifier la réponse' : 'Répondre'}
                          </Button>
                          {activeRequest.response && (
                            <>
                              <Button 
                                variant="outline" 
                                onClick={generatePDF}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Aperçu PDF
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={handleDirectPDFDownload}
                                className="flex items-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Télécharger PDF
                              </Button>
                            </>
                          )}
                        </div>
                        <div>
                          <select
                            className="border rounded p-2 text-sm"
                            value={activeRequest.status}
                            onChange={(e) => handleStatusChange(activeRequest.id, e.target.value)}
                          >
                            <option value="nouveau">Nouveau</option>
                            <option value="en attente">En attente</option>
                            <option value="traité">Traité</option>
                            <option value="annulé">Annulé</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Réponse (si existe) */}
                      {activeRequest.response && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Réponse</h3>
                            <span className="text-xs text-gray-500">
                              {activeRequest.responseDate ? formatDate(activeRequest.responseDate) : ''}
                            </span>
                          </div>
                          <div className="whitespace-pre-line text-sm">
                            {activeRequest.response}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Contacts */}
          <TabsContent value="contacts">
            {/* Contenu de l'onglet Contacts */}
          </TabsContent>

          {/* Avis */}
          <TabsContent value="reviews">
            {/* Contenu de l'onglet Avis */}
          </TabsContent>

          {/* Contenu */}
          <TabsContent value="content">
            {/* Contenu de l'onglet Contenu */}
          </TabsContent>

          {/* Statistiques */}
          <TabsContent value="stats">
            {/* Contenu de l'onglet Statistiques */}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog pour la réponse */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeRequest?.type === 'quote' ? 'Répondre à la demande de devis' : 'Répondre à la demande de réservation'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Textarea 
              value={responseText} 
              onChange={(e) => setResponseText(e.target.value)}
              rows={15}
              className="w-full mb-4"
              placeholder="Votre réponse..."
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

      {/* Dialog pour l'aperçu PDF */}
      <Dialog open={pdfPreviewOpen} onOpenChange={setPdfPreviewOpen} modal>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du document</DialogTitle>
          </DialogHeader>
          
          <div className="h-[70vh] overflow-y-auto border rounded-lg">
            {activeRequest && (
              <ResponsePDFTemplate 
                ref={pdfTemplateRef} 
                request={activeRequest}
                response={activeRequest.response || ''}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfPreviewOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handleDownloadPDF}>
              Télécharger PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour la confirmation de suppression de contenu */}
      <AlertDialog open={deleteContentDialogOpen} onOpenChange={setDeleteContentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le contenu sera définitivement supprimé.
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
      
      {/* Dialog pour la réponse au message de contact */}
      <Dialog open={contactResponseDialogOpen} onOpenChange={setContactResponseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Répondre au message de contact
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Textarea 
              value={contactResponseText} 
              onChange={(e) => setContactResponseText(e.target.value)}
              rows={15}
              className="w-full mb-4"
              placeholder="Votre réponse..."
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setContactResponseDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendContactResponse}>
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for content editing */}
      <ContentForm
        isOpen={contentDialogOpen}
        onClose={() => setContentDialogOpen(false)}
        contentItem={activeContentItem}
        onSave={handleSaveContent}
      />
    </main>
  );
};

export default AdminDashboard;
