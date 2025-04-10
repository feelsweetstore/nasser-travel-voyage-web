
import jsPDF from 'jspdf';
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
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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
      pdf.text(splitText, 20, 60);
    } else if (typeof content === 'object') {
      let yPos = 60;
      
      // Information client
      pdf.setFontSize(12);
      pdf.setTextColor(0, 72, 186);
      pdf.text('Informations client:', 20, yPos);
      yPos += 8;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Nom: ${content.fullName}`, 20, yPos);
      yPos += 6;
      pdf.text(`Email: ${content.email}`, 20, yPos);
      yPos += 6;
      pdf.text(`Téléphone: ${content.whatsapp || content.phone || 'Non spécifié'}`, 20, yPos);
      yPos += 10;
      
      // Détails du voyage
      pdf.setFontSize(12);
      pdf.setTextColor(0, 72, 186);
      pdf.text('Détails du voyage:', 20, yPos);
      yPos += 8;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Destination: ${content.destination}`, 20, yPos);
      yPos += 6;
      
      const departureDate = content.departureDate ? new Date(content.departureDate).toLocaleDateString() : 'Non spécifiée';
      pdf.text(`Date de départ: ${departureDate}`, 20, yPos);
      yPos += 6;
      
      const returnDate = content.returnDate ? new Date(content.returnDate).toLocaleDateString() : 'Non spécifiée';
      pdf.text(`Date de retour: ${returnDate}`, 20, yPos);
      yPos += 6;
      
      pdf.text(`Nombre de passagers: ${content.passengers}`, 20, yPos);
      yPos += 6;
      
      const travelClass = 
        content.travelClass === 'economy' ? 'Économique' :
        content.travelClass === 'premium' ? 'Premium Economy' :
        content.travelClass === 'business' ? 'Business' :
        content.travelClass === 'first' ? 'Première classe' :
        content.travelClass;
      
      pdf.text(`Classe: ${travelClass}`, 20, yPos);
      yPos += 15;
      
      // Réponse
      if (content.response) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 72, 186);
        pdf.text('Notre réponse:', 20, yPos);
        yPos += 8;
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const splitResponse = pdf.splitTextToSize(content.response, 170);
        pdf.text(splitResponse, 20, yPos);
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
      pdf.text('NASSER TRAVEL HORIZON | Tél: +235 66 00 00 00 | Email: contact@nassertravel.com', 105, footerY - 5, { align: 'center' });
      
      // Numéro de page
      pdf.text(`Page ${i} sur ${pageCount}`, 105, footerY, { align: 'center' });
    }
    
    pdf.save(`${filename}.pdf`);
  }
}

export default PDFService;
