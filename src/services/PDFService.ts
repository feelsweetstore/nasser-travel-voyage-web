
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Service pour la génération de PDF
 */
class PDFService {
  /**
   * Génère un PDF à partir d'un contenu HTML
   * @param elementId - ID de l'élément HTML à convertir en PDF
   * @param filename - Nom du fichier PDF
   */
  static async generatePDF(elementId: string, filename: string): Promise<void> {
    console.log(`Début de la génération du PDF pour l'élément #${elementId} avec le nom ${filename}`);
    
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      throw new Error(`Element with ID ${elementId} not found`);
    }
    
    try {
      // Create a PDF with A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true // Compression pour un téléchargement plus rapide
      });

      // Get all pages from the template
      const pages = element.querySelectorAll('.page');
      
      // Forcer l'affichage complet de l'élément pour la capture
      const originalDisplay = element.style.display;
      element.style.display = 'block';
      element.style.visibility = 'visible';
      element.style.position = 'absolute';
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '-1000';
      document.body.appendChild(element.cloneNode(true));
      
      console.log(`Élément préparé pour la capture, dimensions: ${element.offsetWidth}x${element.offsetHeight}`);
      
      // If no specific pages are found, fall back to converting the whole element
      if (pages.length === 0) {
        console.log("Aucune page trouvée, utilisation de la méthode de conversion d'élément unique");
        await this.convertSingleElementToPDF(element, pdf, filename);
        // Restore original styles
        element.style.display = originalDisplay;
        return;
      }
      
      console.log(`Nombre de pages trouvées: ${pages.length}`);
      
      // Wait a bit for any async rendering to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert each page separately for better control
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`Traitement de la page ${i + 1}, dimensions: ${page.offsetWidth}x${page.offsetHeight}`);
        
        // Create a temporary container in the document for each page
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '0';
        tempContainer.style.top = '0';
        tempContainer.style.width = '210mm';
        tempContainer.style.visibility = 'visible';
        tempContainer.style.zIndex = '-999';
        tempContainer.style.backgroundColor = 'white';
        
        // Clone the page and append it to the temp container
        const pageClone = page.cloneNode(true) as HTMLElement;
        tempContainer.appendChild(pageClone);
        document.body.appendChild(tempContainer);
        
        try {
          // Make sure the clone is properly sized and visible
          pageClone.style.width = '210mm';
          pageClone.style.height = 'auto';
          pageClone.style.minHeight = '297mm';
          pageClone.style.padding = '10mm';
          pageClone.style.boxSizing = 'border-box';
          pageClone.style.backgroundColor = 'white';
          pageClone.style.border = 'none';
          pageClone.style.margin = '0';
          pageClone.style.position = 'relative';
          pageClone.style.display = 'block';
          pageClone.style.visibility = 'visible';
          
          // Give time for styles to apply
          await new Promise(resolve => setTimeout(resolve, 100));
          
          console.log(`Création du canvas pour la page ${i + 1}`);
          const canvas = await html2canvas(pageClone, {
            scale: 2, // Meilleure qualité
            useCORS: true,
            logging: true, // Enable logging for debugging
            windowWidth: pageClone.offsetWidth,
            allowTaint: true,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
              console.log("Document cloné pour html2canvas");
              const clonedElement = clonedDoc.querySelector(`.page-${i + 1}`) as HTMLElement || pageClone;
              if (clonedElement) {
                clonedElement.style.height = 'auto';
                clonedElement.style.overflow = 'visible';
                
                // Améliorer l'affichage du texte
                const textElements = clonedElement.querySelectorAll('p, span, div');
                textElements.forEach((el: HTMLElement) => {
                  el.style.visibility = 'visible';
                  el.style.display = 'block';
                  el.style.wordBreak = 'break-word';
                  el.style.lineHeight = '1.4';
                });
              }
            }
          });
          
          // Add a new page for all pages after the first one
          if (i > 0) {
            pdf.addPage();
          }
          
          // Get image data and add to PDF
          const imgData = canvas.toDataURL('image/png');
          if (!imgData || imgData === 'data:,') {
            console.error(`Canvas vide pour la page ${i + 1}`);
            continue;
          }
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = Math.min(
            (canvas.height * pdfWidth) / canvas.width,
            pdf.internal.pageSize.getHeight() - 5 // Ensure it fits on page with small margin
          );
          
          console.log(`Ajout de l'image au PDF pour la page ${i + 1}, dimensions: ${pdfWidth}x${pdfHeight}`);
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          
          // Check for long content and add additional pages if needed
          if (canvas.height > 1600) {
            const contentRatio = canvas.height / canvas.width;
            const totalPages = Math.ceil(contentRatio * 1.2);
            
            if (totalPages > 1) {
              const pageHeight = pdf.internal.pageSize.getHeight();
              let remainingHeight = (canvas.height * pdfWidth) / canvas.width - pageHeight;
              let offsetY = pageHeight;
              
              while (remainingHeight > 0) {
                pdf.addPage();
                pdf.addImage(
                  imgData, 'PNG', 0, -offsetY, pdfWidth, 
                  (canvas.height * pdfWidth) / canvas.width, 
                  undefined, 'FAST'
                );
                
                remainingHeight -= pageHeight;
                offsetY += pageHeight;
              }
            }
          }
        } finally {
          // Clean up the temporary elements
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
        }
      }
      
      // Restore original element styles
      element.style.display = originalDisplay;
      element.style.position = '';
      element.style.left = '';
      element.style.top = '';
      element.style.zIndex = '';
      
      // Get the callback to notify when PDF is ready
      const onPDFReady = (pdf: jsPDF) => {
        console.log(`PDF prêt ! Lancement du téléchargement: ${filename}.pdf`);
        // Force le téléchargement du PDF - utilisation d'une approche plus directe
        try {
          const pdfOutput = pdf.output('blob');
          const blobUrl = URL.createObjectURL(pdfOutput);
          
          // Créer un lien temporaire pour le téléchargement
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = `${filename}.pdf`;
          
          // Ajouter au document, cliquer, puis supprimer
          document.body.appendChild(downloadLink);
          downloadLink.click();
          
          // Nettoyage après un court délai
          setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        } catch (err) {
          console.error("Erreur lors de la création du lien de téléchargement:", err);
          // Fallback au téléchargement via pdf.save()
          pdf.save(`${filename}.pdf`);
        }
      };
      
      // Appeler le callback avec le PDF généré
      onPDFReady(pdf);
      
      return Promise.resolve();
      
    } catch (error) {
      console.error("Erreur critique dans generatePDF:", error);
      throw error;
    }
  }
  
  /**
   * Helper method to convert a single element to PDF (used as fallback)
   */
  private static async convertSingleElementToPDF(element: HTMLElement, pdf: jsPDF, filename: string): Promise<void> {
    try {
      console.log("Utilisation de la méthode de conversion d'élément unique");
      
      // Force the element to be visible during capture
      const originalStyles = {
        position: element.style.position,
        visibility: element.style.visibility,
        display: element.style.display
      };
      
      element.style.position = 'relative';
      element.style.visibility = 'visible';
      element.style.display = 'block';
      
      // Create temporary container for better rendering control
      const tempWrapper = document.createElement('div');
      tempWrapper.style.position = 'absolute';
      tempWrapper.style.top = '0';
      tempWrapper.style.left = '0';
      tempWrapper.style.zIndex = '-1000';
      tempWrapper.style.width = '210mm'; // A4 width
      tempWrapper.style.backgroundColor = 'white';
      
      const elementClone = element.cloneNode(true) as HTMLElement;
      tempWrapper.appendChild(elementClone);
      document.body.appendChild(tempWrapper);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for rendering
        
        const canvas = await html2canvas(elementClone, {
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          windowWidth: 900
        });
        
        const imgData = canvas.toDataURL('image/png');
        if (!imgData || imgData === 'data:,') {
          console.error("Canvas vide dans convertSingleElementToPDF");
          throw new Error("Failed to generate PDF content - empty canvas");
        }
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const canvasRatio = canvas.height / canvas.width;
        const imgHeight = canvasRatio * pageWidth;
        
        // Check if content fits on one page
        if (imgHeight <= pageHeight) {
          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
        } else {
          // Content needs multiple pages
          let heightLeft = imgHeight;
          let position = 0;
          
          // Add first page
          pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
          heightLeft -= pageHeight;
          
          // Add additional pages for overflow
          while (heightLeft > 0) {
            position -= pageHeight; // Move to next portion of the image
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        }
        
        // Force download
        pdf.save(`${filename}.pdf`);
      } finally {
        // Clean up
        document.body.removeChild(tempWrapper);
        element.style.position = originalStyles.position;
        element.style.visibility = originalStyles.visibility;
        element.style.display = originalStyles.display;
      }
    } catch (error) {
      console.error("Erreur dans convertSingleElementToPDF:", error);
      throw error;
    }
  }

  /**
   * Génère un PDF à partir d'un contenu texte avec demande sur page 1 et réponse sur page 2
   * @param request - Données de la demande
   * @param title - Titre du document
   * @param filename - Nom du fichier PDF
   */
  static generateResponsePDF(request: any, title: string, filename: string): void {
    console.log("Génération du PDF de réponse:", title, filename);
    
    // Vérifie que l'élément existe avant de lancer la génération
    if (!document.getElementById('pdfTemplate')) {
      console.error("PDF template not found in the DOM");
      return;
    }
    
    // Nous utilisons un timeout pour s'assurer que le DOM est bien mis à jour
    setTimeout(() => {
      console.log("Lancement de la génération après timeout");
      this.generatePDF('pdfTemplate', filename)
        .then(() => console.log("Génération PDF terminée avec succès"))
        .catch(error => console.error("Erreur lors de la génération du PDF:", error));
    }, 500); // Délai légèrement plus long pour être sûr
  }
}

export default PDFService;
