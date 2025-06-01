
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
      scale: 2,
      useCORS: true,
      logging: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: element.offsetWidth,
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
   * Ajoute une image au PDF avec gestion des pages multiples
   */
  static addImageToPDF(pdf: jsPDF, canvas: HTMLCanvasElement, isFirstPage: boolean = true): void {
    if (!isFirstPage) {
      pdf.addPage();
    }

    const imgData = canvas.toDataURL('image/png');
    if (!imgData || imgData === 'data:,') {
      console.error(`Canvas vide détecté`);
      return;
    }

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const { height: pdfHeight } = PDFUtils.calculatePDFDimensions(
      canvas, 
      pdfWidth, 
      pdf.internal.pageSize.getHeight()
    );

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    // Gestion du contenu long nécessitant plusieurs pages
    this.handleLongContent(pdf, canvas, imgData, pdfWidth);
  }

  /**
   * Gère le contenu long en créant des pages supplémentaires
   */
  private static handleLongContent(pdf: jsPDF, canvas: HTMLCanvasElement, imgData: string, pdfWidth: number): void {
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
        windowWidth: 900
      });
      
      const imgData = canvas.toDataURL('image/png');
      if (!imgData || imgData === 'data:,') {
        throw new Error("Failed to generate PDF content - empty canvas");
      }
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const canvasRatio = canvas.height / canvas.width;
      const imgHeight = canvasRatio * pageWidth;
      
      this.addMultiPageImage(pdf, imgData, pageWidth, pageHeight, imgHeight);
      
    } finally {
      document.body.removeChild(tempWrapper);
      cleanup();
    }
  }

  /**
   * Ajoute une image sur plusieurs pages si nécessaire
   */
  private static addMultiPageImage(pdf: jsPDF, imgData: string, pageWidth: number, pageHeight: number, imgHeight: number): void {
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }
  }
}
