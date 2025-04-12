import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, MessageSquare, FileText, BarChart2, Download, Eye, Send, Plus, Pencil, Trash, Mail, Layout, Image, Text, LayoutDashboard } from 'lucide-react';
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
import ContentService, { ContentItem } from '../services/ContentService';
import ContentForm from '../components/admin/ContentForm';
import ContactService from '../services/ContactService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  
  // État pour la gestion du contenu du site
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [activeContentItem, setActiveContentItem] = useState<ContentItem | undefined>(undefined);
  const [deleteContentDialogOpen, setDeleteContentDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeContentTab, setActiveContentTab] = useState('all');

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
        
        // Charger le contenu du site modifiable
        const editableContent = ContentService.getEditableContent();
        setContentItems(editableContent);
        
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
  
  const handleEditContent = (contentItem: ContentItem) => {
    setActiveContentItem(contentItem);
    setContentDialogOpen(true);
  };
  
  const handleSaveContent = (contentItem: Partial<ContentItem>) => {
    try {
      // Mise à jour d'un élément existant
      const updatedContent = ContentService.updateContent(contentItem.id!, contentItem);
      
      // Filtrer pour ne garder que le contenu éditable
      const editableUpdatedContent = ContentService.getEditableContent();
      
      setContentItems(editableUpdatedContent);
      
      toast({
        title: "Contenu mis à jour",
        description: "Le contenu a été modifié avec succès.",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du contenu.",
        variant: "destructive",
      });
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = searchTerm 
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesTab = activeContentTab === 'all' 
      ? true 
      : item.page.toLowerCase() === activeContentTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });

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
        template = `Objet : Votre devis pour un voyage vers ${destination} – NASSER TRAVEL HORIZON\n\nCher(e) ${fullName},\n\nNous vous remercions pour votre demande de devis concernant votre voyage vers ${destination}, du ${departureDate} au ${returnDate}, en classe ${travelClass} pour ${passengers} passager(s).\n\nVoici notre proposition personnalisée :\n\n✈️ Détails de l'offre (à remplir par l'agence)\n\nVol : [Compagnie aérienne]\n\nBagages : [Bagages inclus]\n\nTemps de vol : [Durée estimée]\n\nEscale(s) : [Oui / Non / Nombre]\n\n💰 Prix total : \n📅 Offre valable jusqu'au : [Date limite]\n🎯 Budget client estimé : ${budget}\n\nVeuillez noter que les tarifs de vols sont flexibles et peuvent changer a tout moment.\nCependant, merci de bien vouloir nous confirmer votre accord afin de finaliser la réservation et garantir la disponibilité au tarif indiqué.\n \nSi vous souhaitez modifier certaines informations (dates, classe, destination, etc.), n'hésitez pas à nous le faire savoir.\n\nCordialement,\nL'équipe NASSER TRAVEL HORIZON\n📞 Tél : +235 66 38 69 37\n📧 Email : contact@nassertravelhorizon.com\n📍 N'Djamena, Tchad`;
      } else {
        template = `Objet : Votre réservation de billet pour ${destination} – NASSER TRAVEL HORIZON\n\nCher(e) ${fullName},\n\nNous avons bien reçu votre demande de réservation de billet à destination de ${destination}, pour un départ prévu le ${departureDate} et un retour le ${returnDate}, en classe ${travelClass} pour ${passengers} passager(s).\n\nVoici les détails de votre réservation en cours de traitement :\n\n✈️ Détails du vol proposé (à compléter par l'agence)\n\nCompagnie aérienne : [Nom de la compagnie]\n\nHeure de départ : [Heure]\n\nHeure d'arrivée : [Heure]\n\nEscale(s) : [Oui / Non / Détails]\n\nBagages inclus : [Poids / type]\n\nNuméro de vol : [XXXX]\n\n💰 Tarif total : [Montant en FCFA]\n📅 Validité de la réservation : [Date limite de confirmation]\n\nAfin de finaliser votre réservation, merci de bien vouloir :\n✅ Confirmer votre accord par retour de message via notre e-mail.\n✅ Nous faire parvenir une copie de votre passeport (si ce n'est pas encore fait).\n✅ Procéder au paiement dans le délai mentionné ci-dessus\n\nSi vous avez des questions ou souhaitez ajuster certains détails de votre voyage, notre équipe reste à votre entière disposition.\n\nCordialement,\nL'équipe NASSER TRAVEL HORIZON\n📞 Tél : +235 66 38 69 37\n📧 Email : contact@nassertravelhorizon.com\n📍 N'Djamena, Tchad`;
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index} className={index < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
    ));
  };

  const handleViewContactMessage = (message: any) => {
    setActiveContactMessage(message);
  };
  
  const handleCloseContactDetails = () => {
    setActiveContactMessage(null);
  };
  
  const handleOpenContactResponseDialog = () => {
    if (activeContactMessage) {
      // Préremplir avec un modèle de réponse
      const template = `Objet : Réponse à votre message - NASSER TRAVEL HORIZON\n\nCher(e) ${activeContactMessage.name},\n\nNous vous remercions pour votre message concernant "${activeContactMessage.subject || 'votre demande'}\".\n\n[Votre réponse personnalisée ici]\n\nN'hésitez pas à nous contacter si vous avez d'autres questions.\n\nCordialement,\nL'équipe NASSER TRAVEL HORIZON\n📞 Tél : +235 66 38 69 37\n📧 Email : contact@nassertravelhorizon.com\n📍 N'Djamena, Tchad`;
      
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
      const filename = `contact-${activeContactMessage.id}`;
      
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
          <TabsList className="grid grid-cols-5 mb-8">
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
            <TabsTrigger value="site-content" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Contenu du site</span>
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="requests">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                              <p>
                                <span className="font-medium">Nom du client :</span> {activeRequest.fullName}
                              </p>
                              <p>
                                <span className="font-medium">Destination :</span> {activeRequest.destination}
                              </p>
                              <p>
                                <span className="font-medium">Date de départ :</span> {formatDate(activeRequest.departureDate)}
                              </p>
                              <p>
                                <span className="font-medium">Date de retour :</span> {formatDate(activeRequest.returnDate)}
                              </p>
                              <p>
                                <span className="font-medium">Nombre de passagers :</span> {activeRequest.passengers}
                              </p>
                              <p>
                                <span className="font-medium">Classe :</span> {getTravelClassInFrench(activeRequest.travelClass)}
                              </p>
                              <p>
                                <span className="font-medium">Budget :</span> {activeRequest.budget ? `${activeRequest.budget} FCFA` : '[Budget non spécifié]'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Messages de contact</CardTitle>
                    <CardDescription>
                      Tous les messages reçus
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="all" className="px-6">
                      <TabsList className="mb-4 w-full">
                        <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
                        <TabsTrigger value="new" className="flex-1">Nouveaux</TabsTrigger>
                        <TabsTrigger value="read" className="flex-1">Lus</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="max-h-[70vh] overflow-y-auto">
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
                                    <p className="text-sm text-gray-500">{message.subject}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    message.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    message.status === "lu" ? "bg-green-100 text-green-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="new" className="max-h-[70vh] overflow-y-auto">
                        {contactMessages.filter(m => m.status === "nouveau").length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun nouveau message pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {contactMessages.filter(m => m.status === "nouveau").map((message) => (
                              <div 
                                key={message.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeContactMessage?.id === message.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewContactMessage(message)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{message.name}</h4>
                                    <p className="text-sm text-gray-500">{message.subject}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    message.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    message.status === "lu" ? "bg-green-100 text-green-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="read" className="max-h-[70vh] overflow-y-auto">
                        {contactMessages.filter(m => m.status === "lu").length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun message lu pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {contactMessages.filter(m => m.status === "lu").map((message) => (
                              <div 
                                key={message.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeContactMessage?.id === message.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewContactMessage(message)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{message.name}</h4>
                                    <p className="text-sm text-gray-500">{message.subject}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    message.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    message.status === "lu" ? "bg-green-100 text-green-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
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
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>Veuillez sélectionner un message dans la liste</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Informations du message</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p>
                                <span className="font-medium">Nom du client :</span> {activeContactMessage.name}
                              </p>
                              <p>
                                <span className="font-medium">Sujet :</span> {activeContactMessage.subject}
                              </p>
                              <p>
                                <span className="font-medium">Date :</span> {new Date(activeContactMessage.createdAt).toLocaleDateString()}
                              </p>
                              <p>
                                <span className="font-medium">Statut :</span> {activeContactMessage.status.charAt(0).toUpperCase() + activeContactMessage.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Avis clients</CardTitle>
                    <CardDescription>
                      Tous les avis clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="all" className="px-6">
                      <TabsList className="mb-4 w-full">
                        <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
                        <TabsTrigger value="published" className="flex-1">Publiés</TabsTrigger>
                        <TabsTrigger value="unpublished" className="flex-1">Non publiés</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all" className="max-h-[70vh] overflow-y-auto">
                        {reviews.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun avis pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {reviews.map((review) => (
                              <div 
                                key={review.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeReview?.id === review.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewReview(review)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{review.fullName}</h4>
                                    <p className="text-sm text-gray-500">{review.destination}</p>
                                  </div>
                                  <Badge variant={review.published ? 'outline' : 'default'} className="ml-2">
                                    {review.published ? 'Publié' : 'Non publié'}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    review.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    review.status === "traité" ? "bg-green-100 text-green-800" :
                                    review.status === "en attente" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="published" className="max-h-[70vh] overflow-y-auto">
                        {reviews.filter(r => r.published).length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun avis publié pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {reviews.filter(r => r.published).map((review) => (
                              <div 
                                key={review.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeReview?.id === review.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewReview(review)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{review.fullName}</h4>
                                    <p className="text-sm text-gray-500">{review.destination}</p>
                                  </div>
                                  <Badge variant={review.published ? 'outline' : 'default'} className="ml-2">
                                    {review.published ? 'Publié' : 'Non publié'}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    review.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    review.status === "traité" ? "bg-green-100 text-green-800" :
                                    review.status === "en attente" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="unpublished" className="max-h-[70vh] overflow-y-auto">
                        {reviews.filter(r => !r.published).length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun avis non publié pour le moment
                          </div>
                        ) : (
                          <div className="space-y-2 pb-4">
                            {reviews.filter(r => !r.published).map((review) => (
                              <div 
                                key={review.id} 
                                className={`p-3 rounded-md cursor-pointer ${activeReview?.id === review.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                                onClick={() => handleViewReview(review)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{review.fullName}</h4>
                                    <p className="text-sm text-gray-500">{review.destination}</p>
                                  </div>
                                  <Badge variant={review.published ? 'outline' : 'default'} className="ml-2">
                                    {review.published ? 'Publié' : 'Non publié'}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    review.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                                    review.status === "traité" ? "bg-green-100 text-green-800" :
                                    review.status === "en attente" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                  }`}>
                                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
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
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Détails de l'avis</CardTitle>
                    <CardDescription>
                      {activeReview ? 
                        `Avis de ${activeReview.fullName}` : 
                        'Sélectionnez un avis pour voir les détails'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!activeReview ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>Veuillez sélectionner un avis dans la liste</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Informations de l'avis</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <p>
                                <span className="font-medium">Nom du client :</span> {activeReview.fullName}
                              </p>
                              <p>
                                <span className="font-medium">Destination :</span> {activeReview.destination}
                              </p>
                              <p>
                                <span className="font-medium">Date :</span> {new Date(activeReview.createdAt).toLocaleDateString()}
                              </p>
                              <p>
                                <span className="font-medium">Statut :</span> {activeReview.status.charAt(0).toUpperCase() + activeReview.status.slice(1)}
                              </p>
                              <p>
                                <span className="font-medium">Note :</span> {activeReview.rating}
                              </p>
                              <p>
                                <span className="font-medium">Commentaire :</span> {activeReview.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="site-content">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion du contenu du site</CardTitle>
                  <CardDescription>
                    Modifier le contenu des pages du site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 md:items-center">
                    <Input 
                      placeholder="Rechercher un contenu..." 
                      className="flex-1" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select 
                      value={activeContentTab} 
                      onValueChange={(value) => setActiveContentTab(value)}
                    >
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Toutes les pages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les pages</SelectItem>
                        <SelectItem value="Global">Global</SelectItem>
                        <SelectItem value="Accueil">Accueil</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Galerie">Galerie</SelectItem>
                        <SelectItem value="FAQ">FAQ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {filteredContent.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Layout className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Aucun contenu ne correspond à votre recherche</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {filteredContent.map((item) => (
                        <div key={item.id} className="border rounded-md p-4 flex flex-col h-full relative group">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-xs text-gray-500">
                                {item.page} {item.type === 'logo' ? '- Logo' : 
                                 item.type === 'text' ? '- Texte' : 
                                 item.type === 'image' ? '- Image' : 
                                 item.type === 'gallery' ? '- Galerie' : 
                                 item.type === 'service' ? '- Service' : 
                                 item.type === 'faq' ? '- FAQ' : ''}
                              </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditContent(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Modifier</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex-1 text-sm">
                            {item.type === 'text' || item.type === 'service' || item.type === 'faq' ? (
                              <p className="line-clamp-3 text-gray-600">{item.content}</p>
                            ) : (item.type === 'logo' || item.type === 'image' || item.type === 'gallery') ? (
                              <div className="flex justify-center items-center bg-gray-100 rounded-md h-24 overflow-hidden">
                                <img 
                                  src={item.content} 
                                  alt={item.title} 
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            ) : (
                              <p className="line-clamp-3 text-gray-600">{item.content}</p>
                            )}
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditContent(item)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ContentForm 
        isOpen={contentDialogOpen}
        onClose={() => setContentDialogOpen(false)}
        onSave={handleSaveContent}
        contentItem={activeContentItem}
      />
    </main>
  );
};

export default AdminDashboard;
