
/**
 * Utilitaires pour la génération de PDF
 */
export class PDFUtils {
  /**
   * Prépare un élément HTML pour la capture
   */
  static prepareElementForCapture(element: HTMLElement): { cleanup: () => void } {
    const originalDisplay = element.style.display;
    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.position = 'absolute';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '-1000';
    
    return {
      cleanup: () => {
        element.style.display = originalDisplay;
        element.style.position = '';
        element.style.left = '';
        element.style.top = '';
        element.style.zIndex = '';
      }
    };
  }

  /**
   * Crée un conteneur temporaire pour une page
   */
  static createTempContainer(): HTMLElement {
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '0';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.visibility = 'visible';
    tempContainer.style.zIndex = '-999';
    tempContainer.style.backgroundColor = 'white';
    
    return tempContainer;
  }

  /**
   * Configure les styles d'un clone de page
   */
  static configurePageClone(pageClone: HTMLElement): void {
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
  }

  /**
   * Force le téléchargement d'un PDF
   */
  static forceDownload(pdf: any, filename: string): void {
    try {
      const pdfOutput = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfOutput);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = `${filename}.pdf`;
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (err) {
      console.error("Erreur lors de la création du lien de téléchargement:", err);
      pdf.save(`${filename}.pdf`);
    }
  }

  /**
   * Calcule les dimensions optimales pour le PDF
   */
  static calculatePDFDimensions(canvas: HTMLCanvasElement, pdfWidth: number, maxHeight: number): { width: number; height: number } {
    const height = Math.min(
      (canvas.height * pdfWidth) / canvas.width,
      maxHeight - 5
    );
    
    return { width: pdfWidth, height };
  }

  /**
   * Attend que le rendu soit terminé
   */
  static async waitForRender(delay: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
