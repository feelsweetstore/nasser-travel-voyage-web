
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, Send } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ResponsePDFTemplate from '../pdf/ResponsePDFTemplate';
import ContentForm from './ContentForm';
import ResponseTemplateManager from './ResponseTemplateManager';

interface AdminDialogsProps {
  // Response dialog
  responseDialogOpen: boolean;
  setResponseDialogOpen: (open: boolean) => void;
  responseText: string;
  setResponseText: (text: string) => void;
  onSendResponse: () => void;
  
  // Contact response dialog
  contactResponseDialogOpen: boolean;
  setContactResponseDialogOpen: (open: boolean) => void;
  contactResponseText: string;
  setContactResponseText: (text: string) => void;
  onSendContactResponse: () => void;
  
  // PDF preview dialog
  pdfPreviewOpen: boolean;
  setPdfPreviewOpen: (open: boolean) => void;
  activeRequest: any;
  onDownloadPDF: () => void;
  
  // Review dialog
  reviewDialogOpen: boolean;
  setReviewDialogOpen: (open: boolean) => void;
  activeReview: any;
  onPublishReview: (id: number, shouldPublish: boolean) => void;
  renderStars: (rating: number) => React.ReactNode;
  
  // Content dialogs
  contentDialogOpen: boolean;
  setContentDialogOpen: (open: boolean) => void;
  activeContentItem: any;
  onSaveContent: (contentItem: any) => void;
  deleteContentDialogOpen: boolean;
  setDeleteContentDialogOpen: (open: boolean) => void;
  onDeleteContent: () => void;
  
  // Template manager
  templateManagerOpen: boolean;
  setTemplateManagerOpen: (open: boolean) => void;
}

const AdminDialogs: React.FC<AdminDialogsProps> = ({
  responseDialogOpen,
  setResponseDialogOpen,
  responseText,
  setResponseText,
  onSendResponse,
  contactResponseDialogOpen,
  setContactResponseDialogOpen,
  contactResponseText,
  setContactResponseText,
  onSendContactResponse,
  pdfPreviewOpen,
  setPdfPreviewOpen,
  activeRequest,
  onDownloadPDF,
  reviewDialogOpen,
  setReviewDialogOpen,
  activeReview,
  onPublishReview,
  renderStars,
  contentDialogOpen,
  setContentDialogOpen,
  activeContentItem,
  onSaveContent,
  deleteContentDialogOpen,
  setDeleteContentDialogOpen,
  onDeleteContent,
  templateManagerOpen,
  setTemplateManagerOpen
}) => {
  return (
    <>
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
            <Button onClick={onSendResponse}>
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
            <Button onClick={onSendContactResponse}>
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
            <div id="pdfTemplate" className="border p-8 rounded-md bg-white">
              {activeRequest && <ResponsePDFTemplate request={activeRequest} response={activeRequest?.response || ''} />}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfPreviewOpen(false)}>
              Fermer
            </Button>
            <Button onClick={onDownloadPDF}>
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
                  onClick={() => onPublishReview(activeReview.id, !activeReview.published)}
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
        onSave={onSaveContent}
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
            <AlertDialogAction onClick={onDeleteContent} className="bg-red-600 hover:bg-red-700">
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
    </>
  );
};

export default AdminDialogs;
