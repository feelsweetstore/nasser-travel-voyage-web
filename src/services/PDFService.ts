
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
      
      // If no specific pages are found, fall back to converting the whole element
      if (pages.length === 0) {
        await this.convertSingleElementToPDF(element, pdf, filename);
        return;
      }
      
      console.log(`Nombre de pages trouvées: ${pages.length}`);
      
      // Convert each page separately for better control
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        console.log(`Traitement de la page ${i + 1}`);
        
        // Clone the page to manipulate it without affecting the DOM
        const pageClone = page.cloneNode(true) as HTMLElement;
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(pageClone);
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);
        
        try {
          // Apply specific styles to ensure content fits properly
          pageClone.style.width = '210mm';
          pageClone.style.height = 'auto';
          pageClone.style.padding = '10mm';
          pageClone.style.boxSizing = 'border-box';
          pageClone.style.backgroundColor = 'white';
          
          // Créer un canvas pour la page courante avec une meilleure résolution
          console.log(`Création du canvas pour la page ${i + 1}`);
          const canvas = await html2canvas(pageClone, {
            scale: 2, // Meilleure qualité
            useCORS: true,
            logging: false,
            windowWidth: 1100, // Largeur fixe pour la cohérence
            allowTaint: true,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
              // Style supplémentaire pour s'assurer que tout le contenu est rendu
              const clonedElement = clonedDoc.querySelector(`#${pageClone.id}`) as HTMLElement || pageClone;
              if (clonedElement) {
                clonedElement.style.height = 'auto';
                clonedElement.style.overflow = 'visible';
                
                // Améliorer l'affichage du texte
                const textElements = clonedElement.querySelectorAll('p, span, div');
                textElements.forEach((el: HTMLElement) => {
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
          
          // Calculate appropriate dimensions to fit the content
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = Math.min(
            (canvas.height * pdfWidth) / canvas.width,
            pdf.internal.pageSize.getHeight() - 5 // Ensure it fits on page with small margin
          );
          
          console.log(`Ajout de l'image au PDF pour la page ${i + 1}, hauteur: ${canvas.height}, ratio: ${pdfHeight}`);
          
          // Add the page image to the PDF
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          // Check if we need to add extra pages for long content (for page 2+ where response might be long)
          if (i > 0 && canvas.height > 1600) { // Si la hauteur est importante (longue réponse)
            const contentRatio = canvas.height / canvas.width;
            const totalPages = Math.ceil(contentRatio * 1.2); // Estimation du nombre de pages
            
            console.log(`Contenu long détecté pour la page ${i + 1}, ratio: ${contentRatio}, pages estimées: ${totalPages}`);
            
            if (totalPages > 1) {
              // Créer des pages supplémentaires au besoin
              const pageHeight = pdf.internal.pageSize.getHeight();
              let remainingHeight = (canvas.height * pdfWidth) / canvas.width - pageHeight;
              let offsetY = pageHeight;
              
              console.log(`Ajout de pages supplémentaires, hauteur restante: ${remainingHeight}`);
              
              while (remainingHeight > 0) {
                pdf.addPage();
                console.log(`Ajout d'une page supplémentaire, offset: ${offsetY}`);
                pdf.addImage(
                  imgData, 
                  'PNG', 
                  0, 
                  -offsetY, // Position négative pour "déplacer" l'image vers le haut
                  pdfWidth, 
                  (canvas.height * pdfWidth) / canvas.width
                );
                
                remainingHeight -= pageHeight;
                offsetY += pageHeight;
              }
            }
          }
        } catch (error) {
          console.error(`Erreur lors du traitement de la page ${i + 1}:`, error);
        } finally {
          // Clean up - remove temporary elements
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
        }
      }
      
      console.log(`PDF généré avec succès. Lancement du téléchargement: ${filename}.pdf`);
      // Force le téléchargement du PDF
      pdf.save(`${filename}.pdf`);
      
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
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Check if content is larger than one page
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      if (pdfHeight <= pageHeight) {
        // Content fits on one page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        // Content needs multiple pages - optimized approach
        let heightLeft = pdfHeight;
        let position = 0;
        let page = 1;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft > 0) {
          position = -pageHeight * page;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
          page++;
        }
      }
      
      console.log(`PDF d'élément unique généré. Lancement du téléchargement: ${filename}.pdf`);
      // Force le téléchargement du PDF avec un nom spécifique
      pdf.save(`${filename}.pdf`);
      
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
    }, 300);
  }
}

export default PDFService;
