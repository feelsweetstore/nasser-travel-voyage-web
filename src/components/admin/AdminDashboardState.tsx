
import { useState, useEffect } from 'react';
import OnlineReservationService from '../../services/OnlineReservationService';
import ReviewService from '../../services/ReviewService';
import ContentService from '../../services/ContentService';
import ContactService from '../../services/ContactService';

export const useAdminDashboardState = () => {
  const [onlineReservation, setOnlineReservation] = useState(false);
  const [clientAreaEnabled, setClientAreaEnabled] = useState(false);
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  
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
    const loadSettings = async () => {
      try {
        const onlineReservationStatus = await OnlineReservationService.getStatus();
        setOnlineReservation(onlineReservationStatus);
        
        const clientAreaStatus = localStorage.getItem('clientAreaEnabled') === 'true';
        const testimonialsStatus = localStorage.getItem('testimonialsEnabled') !== 'false';
        
        setClientAreaEnabled(clientAreaStatus);
        setTestimonialsEnabled(testimonialsStatus);
        
        const reservations = await OnlineReservationService.getReservations();
        setRequests(reservations);
        
        const clientReviews = ReviewService.getReviews();
        setReviews(clientReviews);
        
        const siteContent = ContentService.getContent();
        setContentItems(siteContent);
        
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

  // Event handlers
  const handleViewRequest = (request: any) => {
    setActiveRequest(request);
  };

  const handleCloseDetails = () => {
    setActiveRequest(null);
  };

  const handleViewReview = (review: any) => {
    setActiveReview(review);
    setReviewDialogOpen(true);
  };

  const handleAddContent = () => {
    setActiveContentItem(null);
    setContentDialogOpen(true);
  };

  const handleEditContent = (contentItem: any) => {
    setActiveContentItem(contentItem);
    setContentDialogOpen(true);
  };

  const handleConfirmDeleteContent = (id: number) => {
    setContentToDelete(id);
    setDeleteContentDialogOpen(true);
  };

  const handleViewContactMessage = (message: any) => {
    setActiveContactMessage(message);
  };

  const handleCloseContactDetails = () => {
    setActiveContactMessage(null);
  };

  // Fonction qui génère un rang d'étoiles pour l'affichage des avis
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span key={index} className={index < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
    ));
  };

  return {
    // State
    onlineReservation,
    setOnlineReservation,
    clientAreaEnabled,
    setClientAreaEnabled,
    testimonialsEnabled,
    setTestimonialsEnabled,
    isLoading,
    setIsLoading,
    requests,
    setRequests,
    activeRequest,
    setActiveRequest,
    responseDialogOpen,
    setResponseDialogOpen,
    responseText,
    setResponseText,
    pdfPreviewOpen,
    setPdfPreviewOpen,
    reviewDialogOpen,
    setReviewDialogOpen,
    activeReview,
    setActiveReview,
    reviews,
    setReviews,
    contentItems,
    setContentItems,
    contentDialogOpen,
    setContentDialogOpen,
    activeContentItem,
    setActiveContentItem,
    deleteContentDialogOpen,
    setDeleteContentDialogOpen,
    contentToDelete,
    setContentToDelete,
    contactMessages,
    setContactMessages,
    activeContactMessage,
    setActiveContactMessage,
    contactResponseDialogOpen,
    setContactResponseDialogOpen,
    contactResponseText,
    setContactResponseText,
    templateManagerOpen,
    setTemplateManagerOpen,
    stats,
    
    // Handlers
    handleViewRequest,
    handleCloseDetails,
    handleViewReview,
    handleAddContent,
    handleEditContent,
    handleConfirmDeleteContent,
    handleViewContactMessage,
    handleCloseContactDetails,
    renderStars
  };
};
