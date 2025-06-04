
import { useToast } from "@/hooks/use-toast";
import OnlineReservationService from '../../services/OnlineReservationService';
import ReviewService from '../../services/ReviewService';
import ContentService from '../../services/ContentService';
import ContactService from '../../services/ContactService';
import ResponseTemplateService from '../../services/ResponseTemplateService';
import PDFService from '../../services/PDFService';

export const useAdminHandlers = () => {
  const { toast } = useToast();

  const handleReservationToggle = async (
    onlineReservation: boolean,
    setOnlineReservation: (value: boolean) => void,
    setIsLoading: (loading: boolean) => void
  ) => {
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

  const handleClientAreaToggle = (
    clientAreaEnabled: boolean,
    setClientAreaEnabled: (value: boolean) => void
  ) => {
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

  const handleTestimonialsToggle = (
    testimonialsEnabled: boolean,
    setTestimonialsEnabled: (value: boolean) => void
  ) => {
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

  const handlePublishReview = (
    id: number,
    shouldPublish: boolean,
    reviews: any[],
    setReviews: (reviews: any[]) => void,
    activeReview: any,
    setActiveReview: (review: any) => void
  ) => {
    try {
      const updatedReviews = ReviewService.updateReviewStatus(id, shouldPublish);
      setReviews(updatedReviews);
      
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

  const handleSaveContent = (
    contentItem: any,
    contentItems: any[],
    setContentItems: (items: any[]) => void
  ) => {
    try {
      let updatedContent;
      
      if (contentItem.id) {
        updatedContent = ContentService.updateContent(contentItem.id, contentItem);
        toast({
          title: "Contenu mis à jour",
          description: "Le contenu a été modifié avec succès.",
        });
      } else {
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

  const handleDeleteContent = (
    contentToDelete: number | null,
    contentItems: any[],
    setContentItems: (items: any[]) => void,
    setDeleteContentDialogOpen: (open: boolean) => void,
    setContentToDelete: (id: number | null) => void
  ) => {
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

  const handleSendResponse = async (
    activeRequest: any,
    responseText: string,
    requests: any[],
    setRequests: (requests: any[]) => void,
    setActiveRequest: (request: any) => void,
    setResponseDialogOpen: (open: boolean) => void
  ) => {
    if (!activeRequest || !responseText) return;

    try {
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

  const handleSendContactResponse = async (
    activeContactMessage: any,
    contactResponseText: string,
    contactMessages: any[],
    setContactMessages: (messages: any[]) => void,
    setActiveContactMessage: (message: any) => void,
    setContactResponseDialogOpen: (open: boolean) => void
  ) => {
    if (!activeContactMessage || !contactResponseText) return;

    try {
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
      
      ContactService.updateMessage(activeContactMessage.id, {
        response: contactResponseText,
        responseDate: new Date().toISOString(),
        status: "traité"
      });
      
      setContactMessages(updatedMessages);
      
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

  const handleOpenResponseDialog = (
    activeRequest: any,
    setResponseText: (text: string) => void,
    setResponseDialogOpen: (open: boolean) => void
  ) => {
    if (activeRequest) {
      const template = ResponseTemplateService.fillTemplate(
        activeRequest.type === 'quote' ? 'quote' : 'reservation',
        activeRequest
      );
      
      setResponseText(template);
      setResponseDialogOpen(true);
    }
  };

  const handleOpenContactResponseDialog = (
    activeContactMessage: any,
    setContactResponseText: (text: string) => void,
    setContactResponseDialogOpen: (open: boolean) => void
  ) => {
    if (activeContactMessage) {
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

  const generatePDF = (
    activeRequest: any,
    setPdfPreviewOpen: (open: boolean) => void
  ) => {
    if (!activeRequest) return;
    
    try {
      console.log("Ouverture de l'aperçu PDF pour:", activeRequest.fullName);
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

  const handleDirectPDFDownload = (activeRequest: any) => {
    if (!activeRequest) return;
    
    try {
      console.log("Téléchargement direct du PDF pour:", activeRequest.fullName);
      const filename = `${activeRequest.type === 'quote' ? 'Devis' : 'Reservation'}-${activeRequest.fullName.replace(/\s+/g, '_')}`;
      
      toast({
        title: "Préparation du PDF",
        description: "Le téléchargement va commencer dans un instant...",
      });
      
      PDFService.generateResponsePDF({
        ...activeRequest,
        response: activeRequest.response
      }, activeRequest.type === 'quote' ? 'Devis Personnalisé' : 'Confirmation de Réservation', filename);
      
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

  const handleDownloadPDF = (
    activeRequest: any,
    setPdfPreviewOpen: (open: boolean) => void
  ) => {
    if (!activeRequest) return;
    
    try {
      console.log("Téléchargement du PDF depuis l'aperçu pour:", activeRequest.fullName);
      const filename = `${activeRequest.type === 'quote' ? 'Devis' : 'Reservation'}-${activeRequest.fullName.replace(/\s+/g, '_')}`;
      
      toast({
        title: "Préparation du PDF",
        description: "Le téléchargement va commencer dans un instant...",
      });
      
      PDFService.generatePDF('pdfTemplate', filename);
      
      setTimeout(() => {
        toast({
          title: "PDF téléchargé",
          description: "Le document a été téléchargé avec succès.",
        });
        
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

  const handleContactPDFDownload = (activeContactMessage: any) => {
    if (!activeContactMessage) return;
    
    try {
      console.log("Téléchargement du PDF de contact pour:", activeContactMessage.name);
      const filename = `Contact-${activeContactMessage.name.replace(/\s+/g, '_')}-${activeContactMessage.id}`;
      
      toast({
        title: "Préparation du PDF",
        description: "Le téléchargement va commencer dans un instant...",
      });
      
      PDFService.generateContactPDF(activeContactMessage, filename);
      
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

  return {
    handleReservationToggle,
    handleClientAreaToggle,
    handleTestimonialsToggle,
    handlePublishReview,
    handleSaveContent,
    handleDeleteContent,
    handleSendResponse,
    handleSendContactResponse,
    handleOpenResponseDialog,
    handleOpenContactResponseDialog,
    generatePDF,
    handleDirectPDFDownload,
    handleDownloadPDF,
    handleContactPDFDownload
  };
};
