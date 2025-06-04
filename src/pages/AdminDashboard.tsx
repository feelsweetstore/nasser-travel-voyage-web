
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, MessageSquare, FileText, BarChart2, Mail } from 'lucide-react';

// Import des nouveaux composants
import AdminSettings from '../components/admin/AdminSettings';
import AdminRequests from '../components/admin/AdminRequests';
import AdminContacts from '../components/admin/AdminContacts';
import AdminReviews from '../components/admin/AdminReviews';
import AdminContent from '../components/admin/AdminContent';
import AdminStats from '../components/admin/AdminStats';
import AdminDialogs from '../components/admin/AdminDialogs';
import { useAdminDashboardState } from '../components/admin/AdminDashboardState';
import { useAdminHandlers } from '../components/admin/AdminDashboardHandlers';

const AdminDashboard = () => {
  const state = useAdminDashboardState();
  const handlers = useAdminHandlers();

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
              onlineReservation={state.onlineReservation}
              clientAreaEnabled={state.clientAreaEnabled}
              testimonialsEnabled={state.testimonialsEnabled}
              isLoading={state.isLoading}
              onReservationToggle={() => handlers.handleReservationToggle(
                state.onlineReservation,
                state.setOnlineReservation,
                state.setIsLoading
              )}
              onClientAreaToggle={() => handlers.handleClientAreaToggle(
                state.clientAreaEnabled,
                state.setClientAreaEnabled
              )}
              onTestimonialsToggle={() => handlers.handleTestimonialsToggle(
                state.testimonialsEnabled,
                state.setTestimonialsEnabled
              )}
            />
          </TabsContent>

          <TabsContent value="requests">
            <AdminRequests 
              requests={state.requests}
              activeRequest={state.activeRequest}
              onViewRequest={state.handleViewRequest}
              onCloseDetails={state.handleCloseDetails}
              onOpenResponseDialog={() => handlers.handleOpenResponseDialog(
                state.activeRequest,
                state.setResponseText,
                state.setResponseDialogOpen
              )}
              onGeneratePDF={() => handlers.generatePDF(
                state.activeRequest,
                state.setPdfPreviewOpen
              )}
              onDirectPDFDownload={() => handlers.handleDirectPDFDownload(state.activeRequest)}
              onOpenTemplateManager={() => state.setTemplateManagerOpen(true)}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <AdminContacts 
              contactMessages={state.contactMessages}
              activeContactMessage={state.activeContactMessage}
              onViewContactMessage={state.handleViewContactMessage}
              onCloseContactDetails={state.handleCloseContactDetails}
              onOpenContactResponseDialog={() => handlers.handleOpenContactResponseDialog(
                state.activeContactMessage,
                state.setContactResponseText,
                state.setContactResponseDialogOpen
              )}
              onContactPDFDownload={() => handlers.handleContactPDFDownload(state.activeContactMessage)}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviews 
              reviews={state.reviews}
              onViewReview={state.handleViewReview}
              onPublishReview={(id: number, shouldPublish: boolean) => handlers.handlePublishReview(
                id,
                shouldPublish,
                state.reviews,
                state.setReviews,
                state.activeReview,
                state.setActiveReview
              )}
            />
          </TabsContent>
          
          <TabsContent value="content">
            <AdminContent 
              contentItems={state.contentItems}
              onAddContent={state.handleAddContent}
              onEditContent={state.handleEditContent}
              onConfirmDeleteContent={state.handleConfirmDeleteContent}
            />
          </TabsContent>
          
          <TabsContent value="stats">
            <AdminStats stats={state.stats} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* All dialogs */}
      <AdminDialogs
        responseDialogOpen={state.responseDialogOpen}
        setResponseDialogOpen={state.setResponseDialogOpen}
        responseText={state.responseText}
        setResponseText={state.setResponseText}
        onSendResponse={() => handlers.handleSendResponse(
          state.activeRequest,
          state.responseText,
          state.requests,
          state.setRequests,
          state.setActiveRequest,
          state.setResponseDialogOpen
        )}
        contactResponseDialogOpen={state.contactResponseDialogOpen}
        setContactResponseDialogOpen={state.setContactResponseDialogOpen}
        contactResponseText={state.contactResponseText}
        setContactResponseText={state.setContactResponseText}
        onSendContactResponse={() => handlers.handleSendContactResponse(
          state.activeContactMessage,
          state.contactResponseText,
          state.contactMessages,
          state.setContactMessages,
          state.setActiveContactMessage,
          state.setContactResponseDialogOpen
        )}
        pdfPreviewOpen={state.pdfPreviewOpen}
        setPdfPreviewOpen={state.setPdfPreviewOpen}
        activeRequest={state.activeRequest}
        onDownloadPDF={() => handlers.handleDownloadPDF(
          state.activeRequest,
          state.setPdfPreviewOpen
        )}
        reviewDialogOpen={state.reviewDialogOpen}
        setReviewDialogOpen={state.setReviewDialogOpen}
        activeReview={state.activeReview}
        onPublishReview={(id: number, shouldPublish: boolean) => handlers.handlePublishReview(
          id,
          shouldPublish,
          state.reviews,
          state.setReviews,
          state.activeReview,
          state.setActiveReview
        )}
        renderStars={state.renderStars}
        contentDialogOpen={state.contentDialogOpen}
        setContentDialogOpen={state.setContentDialogOpen}
        activeContentItem={state.activeContentItem}
        onSaveContent={(contentItem: any) => handlers.handleSaveContent(
          contentItem,
          state.contentItems,
          state.setContentItems
        )}
        deleteContentDialogOpen={state.deleteContentDialogOpen}
        setDeleteContentDialogOpen={state.setDeleteContentDialogOpen}
        onDeleteContent={() => handlers.handleDeleteContent(
          state.contentToDelete,
          state.contentItems,
          state.setContentItems,
          state.setDeleteContentDialogOpen,
          state.setContentToDelete
        )}
        templateManagerOpen={state.templateManagerOpen}
        setTemplateManagerOpen={state.setTemplateManagerOpen}
      />
    </main>
  );
};

export default AdminDashboard;
