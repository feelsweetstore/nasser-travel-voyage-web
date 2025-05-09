
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
   * @param autoDownload - Télécharger automatiquement le PDF (défaut: true)
   * @returns Promise avec le jsPDF document
   */
  static async generatePDF(elementId: string, filename: string, autoDownload = true): Promise<jsPDF> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }
    
    // Create a PDF with A4 format
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Get all pages from the template
    const pages = element.querySelectorAll('.page');
    
    // If no specific pages are found, fall back to converting the whole element
    if (pages.length === 0) {
      await this.convertSingleElementToPDF(element, pdf);
    } else {
      // Convert each page separately for better control
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        // Add a new page for all pages after the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        // Convert and add the page to the PDF
        await this.addPageToPDF(page, pdf);
      }
    }
    
    // Téléchargement automatique si demandé
    if (autoDownload) {
      pdf.save(`${filename}.pdf`);
    }
    
    return pdf;
  }
  
  /**
   * Ajoute une page au PDF
   */
  private static async addPageToPDF(element: HTMLElement, pdf: jsPDF): Promise<void> {
    try {
      // Créer un canvas avec une meilleure qualité
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));
      
      // Si le contenu est plus grand que la page, ajouter des pages supplémentaires
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = pdfHeight - pageHeight;
        let position = -pageHeight;
        
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
          position -= pageHeight;
        }
      }
    } catch (error) {
      console.error('Error adding page to PDF:', error);
    }
  }
  
  /**
   * Helper method to convert a single element to PDF (used as fallback)
   */
  private static async convertSingleElementToPDF(element: HTMLElement, pdf: jsPDF): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff"
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
        // Content needs multiple pages
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
    } catch (error) {
      console.error('Error converting element to PDF:', error);
    }
  }

  /**
   * Génère un PDF à partir d'un contenu texte avec demande sur page 1 et réponse sur page 2
   * @param content - Contenu à inclure dans le PDF
   * @param title - Titre du document
   * @param filename - Nom du fichier PDF
   */
  static generateResponsePDF(content: any, title: string, filename: string): void {
    this.generatePDF('pdfTemplate', filename, true);
  }
}

export default PDFService;
