import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, MessageSquare, FileText, BarChart2, Download, Send, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import OnlineReservationService from '../services/OnlineReservationService';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import PDFService from '../services/PDFService';
import ResponsePDFTemplate from '../components/pdf/ResponsePDFTemplate';
import ResponseTemplateManager from '../components/admin/ResponseTemplateManager';
import ResponseTemplateService from '../services/ResponseTemplateService';
import ReviewService from '../services/ReviewService';
import ContentService from '../services/ContentService';
import ContentForm from '../components/admin/ContentForm';
import ContactService from '../services/ContactService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Import des nouveaux composants
import AdminSettings from '../components/admin/AdminSettings';
import AdminRequests from '../components/admin/AdminRequests';
import AdminContacts from '../components/admin/AdminContacts';
import AdminReviews from '../components/admin/AdminReviews';
import AdminContent from '../components/admin/AdminContent';
import AdminStats from '../components/admin/AdminStats';

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

  // État pour la gestion des modèles de réponse
  const [templateManagerOpen, setTemplateManagerOpen] = useState(false);

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
      // Utiliser le service de modèles pour générer la réponse
      const template = ResponseTemplateService.fillTemplate(
        activeRequest.type === 'quote' ? 'quote' : 'reservation',
        activeRequest
      );
      
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
      console.log("Ouverture de l'aperçu PDF pour:", activeRequest.fullName);
      // Ouvrir la fenêtre d'aperçu
      setPdfPreviewOpen(true);
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
      console.log("Téléchargement direct du PDF pour:", activeRequest.fullName);
      // Générer directement le PDF avec un nom incluant celui du client
      const filename = `${activeRequest.type === 'quote' ? 'Devis' : 'Reservation'}-${activeRequest.fullName.replace(/\s+/g, '_')}`;
      
      // Notification du début du téléchargement
      toast({
        title: "Préparation du PDF",
        description: "Le téléchargement va commencer dans un instant...",
      });
      
      // Générer et télécharger le PDF
      PDFService.generateResponsePDF({
        ...activeRequest,
        response: activeRequest.response
      }, activeRequest.type === 'quote' ? 'Devis Personnalisé' : 'Confirmation de Réservation', filename);
      
      // Notification de succès (après un court délai)
      setTimeout(() => {
        toast({
          title: "PDF téléchargé",
          description: "Le document a été téléchargé avec succès.",
        });
      }, 1000);
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
      console.log("Téléchargement du PDF depuis l'aperçu pour:", activeRequest.fullName);
      // Utiliser html2canvas et jsPDF pour générer le PDF avec un nom personnalisé
      const filename = `${activeRequest.type === 'quote' ? 'Devis' : 'Reservation'}-${activeRequest.fullName.replace(/\s+/g, '_')}`;
      
      // Notification du début du téléchargement
      toast({
        title: "Préparation du PDF",
        description: "Le téléchargement va commencer dans un instant...",
      });
      
      // Générer et télécharger le PDF
      PDFService.generatePDF('pdfTemplate', filename);
      
      // Notification de succès (après un court délai)
      setTimeout(() => {
        toast({
          title: "PDF téléchargé",
          description: "Le document a été téléchargé avec succès.",
        });
        
        // Fermer automatiquement la fenêtre d'aperçu après téléchargement
        setPdfPreviewOpen(false);
      }, 1500);
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
      console.log("Téléchargement du PDF de contact pour:", activeContactMessage.name);
      // Générer le PDF pour le message de contact
      const filename = `Contact-${activeContactMessage.name.replace(/\s+/g, '_')}-${activeContactMessage.id}`;
      
      // Notification du début du téléchargement
      toast({
        title: "Préparation du PDF",
        description: "Le téléchargement va commencer dans un instant...",
      });
      
      PDFService.generateContactPDF(activeContactMessage, filename);
      
      // Notification de succès (après un court délai)
      setTimeout(() => {
        toast({
          title: "PDF téléchargé",
          description: "Le document a été téléchargé avec succès.",
        });
      }, 1000);
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

          <TabsContent value="settings">
            <AdminSettings 
              onlineReservation={onlineReservation}
              clientAreaEnabled={clientAreaEnabled}
              testimonialsEnabled={testimonialsEnabled}
              isLoading={isLoading}
              onReservationToggle={handleReservationToggle}
              onClientAreaToggle={handleClientAreaToggle}
              onTestimonialsToggle={handleTestimonialsToggle}
            />
          </TabsContent>

          <TabsContent value="requests">
            <AdminRequests 
              requests={requests}
              activeRequest={activeRequest}
              onViewRequest={handleViewRequest}
              onCloseDetails={handleCloseDetails}
              onOpenResponseDialog={handleOpenResponseDialog}
              onGeneratePDF={generatePDF}
              onDirectPDFDownload={handleDirectPDFDownload}
              onOpenTemplateManager={() => setTemplateManagerOpen(true)}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <AdminContacts 
              contactMessages={contactMessages}
              activeContactMessage={activeContactMessage}
              onViewContactMessage={handleViewContactMessage}
              onCloseContactDetails={handleCloseContactDetails}
              onOpenContactResponseDialog={handleOpenContactResponseDialog}
              onContactPDFDownload={handleContactPDFDownload}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviews 
              reviews={reviews}
              onViewReview={handleViewReview}
              onPublishReview={handlePublishReview}
            />
          </TabsContent>
          
          <TabsContent value="content">
            <AdminContent 
              contentItems={contentItems}
              onAddContent={handleAddContent}
              onEditContent={handleEditContent}
              onConfirmDeleteContent={handleConfirmDeleteContent}
            />
          </TabsContent>
          
          <TabsContent value="stats">
            <AdminStats stats={stats} />
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
      
      {/* Dialogue de réponse au message de contact */}
      <Dialog open={contactResponseDialogOpen} onOpenChange={setContactResponseDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Répondre au message</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              value={contactResponseText} 
              onChange={(e) => setContactResponseText(e.target.value)} 
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactResponseDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendContactResponse}>
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
              {activeRequest && <ResponsePDFTemplate request={activeRequest} response={activeRequest?.response || ''} />}
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
      
      {/* Gestionnaire des modèles de réponse */}
      <ResponseTemplateManager
        isOpen={templateManagerOpen}
        onClose={() => setTemplateManagerOpen(false)}
      />
    </main>
  );
};

export default AdminDashboard;
