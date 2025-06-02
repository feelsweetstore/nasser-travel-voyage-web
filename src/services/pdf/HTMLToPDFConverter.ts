
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PDFUtils } from './PDFUtils';

/**
 * Convertisseur HTML vers PDF
 */
export class HTMLToPDFConverter {
  /**
   * Convertit un élément HTML en canvas
   */
  static async convertToCanvas(element: HTMLElement, options: any = {}): Promise<HTMLCanvasElement> {
    const defaultOptions = {
      scale: 1.5,
      useCORS: true,
      logging: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: element.offsetWidth,
      height: element.offsetHeight,
      onclone: (clonedDoc: Document) => {
        console.log("Document cloné pour html2canvas");
        const textElements = clonedDoc.querySelectorAll('p, span, div');
        textElements.forEach((el: Element) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.visibility = 'visible';
          htmlEl.style.display = 'block';
          htmlEl.style.wordBreak = 'break-word';
          htmlEl.style.lineHeight = '1.4';
        });
      }
    };

    return await html2canvas(element, { ...defaultOptions, ...options });
  }

  /**
   * Ajoute une image au PDF sans génération de pages supplémentaires
   */
  static addSinglePageToPDF(pdf: jsPDF, canvas: HTMLCanvasElement, isFirstPage: boolean = true): void {
    if (!isFirstPage) {
      pdf.addPage();
    }

    const imgData = canvas.toDataURL('image/png');
    if (!imgData || imgData === 'data:,') {
      console.error(`Canvas vide détecté`);
      return;
    }

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculer les dimensions pour s'adapter à la page sans débordement
    const canvasRatio = canvas.height / canvas.width;
    let imgWidth = pdfWidth;
    let imgHeight = imgWidth * canvasRatio;
    
    // Si l'image est trop haute, l'ajuster pour tenir dans la page
    if (imgHeight > pdfHeight) {
      imgHeight = pdfHeight;
      imgWidth = imgHeight / canvasRatio;
    }

    // Centrer l'image sur la page
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
  }

  /**
   * Ajoute une image au PDF avec gestion des pages multiples (méthode héritée)
   */
  static addImageToPDF(pdf: jsPDF, canvas: HTMLCanvasElement, isFirstPage: boolean = true): void {
    // Utiliser la nouvelle méthode pour éviter les pages multiples
    this.addSinglePageToPDF(pdf, canvas, isFirstPage);
  }

  /**
   * Convertit un élément unique en PDF (méthode de fallback)
   */
  static async convertSingleElementToPDF(element: HTMLElement, pdf: jsPDF): Promise<void> {
    const { cleanup } = PDFUtils.prepareElementForCapture(element);
    
    const tempWrapper = PDFUtils.createTempContainer();
    const elementClone = element.cloneNode(true) as HTMLElement;
    tempWrapper.appendChild(elementClone);
    document.body.appendChild(tempWrapper);
    
    try {
      await PDFUtils.waitForRender(300);
      
      const canvas = await this.convertToCanvas(elementClone, {
        windowWidth: 900,
        height: elementClone.offsetHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      if (!imgData || imgData === 'data:,') {
        throw new Error("Failed to generate PDF content - empty canvas");
      }
      
      this.addSinglePageToPDF(pdf, canvas, true);
      
    } finally {
      document.body.removeChild(tempWrapper);
      cleanup();
    }
  }
}
