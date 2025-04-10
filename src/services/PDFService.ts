
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

    const canvas = await html2canvas(element, {
      scale: 2, // Meilleure qualité
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    // Vérifier si le contenu est plus grand qu'une page
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    if (pdfHeight <= pageHeight) {
      // Si le contenu tient sur une page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    } else {
      // Si le contenu dépasse une page, le découper sur plusieurs pages
      let heightLeft = pdfHeight;
      let position = 0;
      let page = 1;
      
      // Ajouter la première page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      // Ajouter des pages supplémentaires si nécessaire
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
   * Génère un PDF à partir d'un contenu texte
   * @param content - Contenu à inclure dans le PDF
   * @param title - Titre du document
   * @param filename - Nom du fichier PDF
   */
  static generateResponsePDF(content: any, title: string, filename: string): void {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Ajouter un logo et un en-tête
    pdf.setFontSize(18);
    pdf.setTextColor(0, 72, 186); // Bleu NASSER
    pdf.text('NASSER TRAVEL HORIZON', 105, 20, { align: 'center' });
    
    // Titre du document
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, 105, 35, { align: 'center' });
    
    // Ligne de séparation
    pdf.setDrawColor(0, 72, 186);
    pdf.line(20, 40, 190, 40);
    
    // Date du document
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Contenu principal
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    // Traiter le contenu selon son type
    if (typeof content === 'string') {
      // Diviser le texte en lignes pour qu'il s'adapte à la page
      const splitText = pdf.splitTextToSize(content, 170);
      
      // Calculer si le contenu va dépasser la page
      const textHeight = splitText.length * 5; // Estimation approximative de la hauteur du texte
      const availableHeight = pdf.internal.pageSize.getHeight() - 70; // Espace disponible après l'en-tête
      
      if (textHeight > availableHeight) {
        // Utiliser addPage et setPage pour gérer le contenu sur plusieurs pages
        let currentY = 60;
        const maxY = pdf.internal.pageSize.getHeight() - 20;
        
        for (let i = 0; i < splitText.length; i++) {
          if (currentY > maxY) {
            pdf.addPage();
            currentY = 20; // Reset Y position on new page
          }
          
          pdf.text(splitText[i], 20, currentY);
          currentY += 5; // Line height
        }
      } else {
        // Si le contenu tient sur une page
        pdf.text(splitText, 20, 60);
      }
    } else if (typeof content === 'object') {
      let yPos = 60;
      const maxY = pdf.internal.pageSize.getHeight() - 20;
      let currentPage = 1;
      
      // Information client
      pdf.setFontSize(12);
      pdf.setTextColor(0, 72, 186);
      pdf.text('Informations client:', 20, yPos);
      yPos += 8;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      
      // Vérifier si on doit passer à une nouvelle page
      const addContent = (text: string, y: number): number => {
        if (y > maxY) {
          pdf.addPage();
          currentPage++;
          return 20; // Reset Y position
        }
        
        pdf.text(text, 20, y);
        return y + 6;
      };
      
      yPos = addContent(`Nom: ${content.fullName}`, yPos);
      yPos = addContent(`Email: ${content.email}`, yPos);
      yPos = addContent(`Téléphone: ${content.whatsapp || content.phone || 'Non spécifié'}`, yPos);
      yPos += 4;
      
      // Détails du voyage
      pdf.setFontSize(12);
      pdf.setTextColor(0, 72, 186);
      yPos = addContent('Détails du voyage:', yPos);
      yPos += 2;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      yPos = addContent(`Destination: ${content.destination}`, yPos);
      
      const departureDate = content.departureDate ? new Date(content.departureDate).toLocaleDateString() : 'Non spécifiée';
      yPos = addContent(`Date de départ: ${departureDate}`, yPos);
      
      const returnDate = content.returnDate ? new Date(content.returnDate).toLocaleDateString() : 'Non spécifiée';
      yPos = addContent(`Date de retour: ${returnDate}`, yPos);
      
      yPos = addContent(`Nombre de passagers: ${content.passengers}`, yPos);
      
      const travelClass = 
        content.travelClass === 'economy' ? 'Économique' :
        content.travelClass === 'premium' ? 'Premium Economy' :
        content.travelClass === 'business' ? 'Business' :
        content.travelClass === 'first' ? 'Première classe' :
        content.travelClass;
      
      yPos = addContent(`Classe: ${travelClass}`, yPos);
      
      // Afficher le budget si disponible
      if (content.budget) {
        yPos = addContent(`Budget estimé: ${content.budget} FCFA`, yPos);
      }
      
      yPos += 4;
      
      // Réponse
      if (content.response) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 72, 186);
        yPos = addContent('Notre réponse:', yPos);
        yPos += 2;
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const splitResponse = pdf.splitTextToSize(content.response, 170);
        
        for (let i = 0; i < splitResponse.length; i++) {
          yPos = addContent(splitResponse[i], yPos);
        }
      }
    }
    
    // Pied de page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      
      // Coordonnées Y du pied de page (bas de page)
      const footerY = pdf.internal.pageSize.getHeight() - 10;
      
      // Informations de contact
      pdf.text('NASSER TRAVEL HORIZON | Tél: +235 66 38 69 37 | Email: contact@nassertravelhorizon.com', 105, footerY - 5, { align: 'center' });
      
      // Numéro de page
      pdf.text(`Page ${i} sur ${pageCount}`, 105, footerY, { align: 'center' });
    }
    
    pdf.save(`${filename}.pdf`);
  }
}

export default PDFService;
