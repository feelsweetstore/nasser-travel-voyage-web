
import { jsPDF } from 'jspdf';
import { HTMLToPDFConverter } from './HTMLToPDFConverter';
import { PDFUtils } from './PDFUtils';

/**
 * Générateur de PDF
 */
export class PDFGenerator {
  /**
   * Génère un PDF à partir d'un élément HTML
   */
  static async generateFromElement(elementId: string, filename: string): Promise<void> {
    console.log(`Début de la génération du PDF pour l'élément #${elementId} avec le nom ${filename}`);
    
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      throw new Error(`Element with ID ${elementId} not found`);
    }
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pages = element.querySelectorAll('.page');
      const { cleanup } = PDFUtils.prepareElementForCapture(element);
      
      try {
        if (pages.length === 0) {
          console.log("Aucune page trouvée, utilisation de la méthode de conversion d'élément unique");
          await HTMLToPDFConverter.convertSingleElementToPDF(element, pdf);
        } else {
          console.log(`Nombre de pages trouvées: ${pages.length}`);
          await this.processExactPages(pages, pdf);
        }
        
        PDFUtils.forceDownload(pdf, filename);
      } finally {
        cleanup();
      }
      
    } catch (error) {
      console.error("Erreur critique dans generateFromElement:", error);
      throw error;
    }
  }

  /**
   * Traite exactement les pages définies sans génération de pages supplémentaires
   */
  private static async processExactPages(pages: NodeListOf<Element>, pdf: jsPDF): Promise<void> {
    await PDFUtils.waitForRender(500);
    
    // Limiter à 2 pages maximum pour éviter les doublons
    const maxPages = Math.min(pages.length, 2);
    
    for (let i = 0; i < maxPages; i++) {
      const page = pages[i] as HTMLElement;
      console.log(`Traitement de la page ${i + 1}, dimensions: ${page.offsetWidth}x${page.offsetHeight}`);
      
      const tempContainer = PDFUtils.createTempContainer();
      const pageClone = page.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(pageClone);
      document.body.appendChild(tempContainer);
      
      try {
        PDFUtils.configurePageClone(pageClone);
        await PDFUtils.waitForRender(100);
        
        console.log(`Création du canvas pour la page ${i + 1}`);
        const canvas = await HTMLToPDFConverter.convertToCanvas(pageClone, {
          windowWidth: pageClone.offsetWidth,
          height: pageClone.offsetHeight,
          scale: 1.5
        });
        
        // Ajouter la page au PDF sans génération de pages supplémentaires
        HTMLToPDFConverter.addSinglePageToPDF(pdf, canvas, i === 0);
        
      } finally {
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    }
  }

  /**
   * Génère un PDF de réponse avec template spécifique
   */
  static generateResponsePDF(request: any, title: string, filename: string): void {
    console.log("Génération du PDF de réponse:", title, filename);
    
    if (!document.getElementById('pdfTemplate')) {
      console.error("PDF template not found in the DOM");
      return;
    }
    
    setTimeout(() => {
      console.log("Lancement de la génération après timeout");
      this.generateFromElement('pdfTemplate', filename)
        .then(() => console.log("Génération PDF terminée avec succès"))
        .catch(error => console.error("Erreur lors de la génération du PDF:", error));
    }, 500);
  }
}
