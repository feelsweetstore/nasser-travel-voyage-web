
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
      await this.convertSingleElementToPDF(element, pdf, filename);
      return;
    }
    
    // Convert each page separately for better control
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      // Create a canvas for the current page
      const canvas = await html2canvas(page, {
        scale: 2, // Better quality
        useCORS: true,
        logging: false
      });
      
      // Add a new page for all pages after the first one
      if (i > 0) {
        pdf.addPage();
      }
      
      // Convert and add the page to the PDF
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    
    pdf.save(`${filename}.pdf`);
  }
  
  /**
   * Helper method to convert a single element to PDF (used as fallback)
   */
  private static async convertSingleElementToPDF(element: HTMLElement, pdf: jsPDF, filename: string): Promise<void> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
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
    
    pdf.save(`${filename}.pdf`);
  }

  /**
   * Génère un PDF à partir d'un contenu texte avec demande sur page 1 et réponse sur page 2
   * @param content - Contenu à inclure dans le PDF
   * @param title - Titre du document
   * @param filename - Nom du fichier PDF
   */
  static generateResponsePDF(content: any, title: string, filename: string): void {
    // This method is now deprecated in favor of the HTML template approach
    // We'll redirect to generatePDF with the DOM template instead
    this.generatePDF('pdfTemplate', filename);
  }
}

export default PDFService;
