
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
   * Génère un PDF à partir d'un contenu texte avec demande sur page 1 et réponse sur page 2
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
    
    // PAGE 1 - DEMANDE CLIENT
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
    
    // Contenu principal - PAGE 1 : DEMANDE
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    
    // Information client
    pdf.setFontSize(12);
    pdf.setTextColor(0, 72, 186);
    pdf.text('Informations client:', 20, 60);
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Nom: ${content.fullName || 'Non spécifié'}`, 20, 68);
    pdf.text(`Email: ${content.email || 'Non spécifié'}`, 20, 74);
    pdf.text(`Téléphone: ${content.whatsapp || content.phone || 'Non spécifié'}`, 20, 80);
    
    // Détails du voyage
    pdf.setFontSize(12);
    pdf.setTextColor(0, 72, 186);
    pdf.text('Détails de la demande:', 20, 90);
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Destination: ${content.destination || 'Non spécifiée'}`, 20, 98);
    
    const departureDate = content.departureDate ? new Date(content.departureDate).toLocaleDateString() : 'Non spécifiée';
    pdf.text(`Date de départ: ${departureDate}`, 20, 104);
    
    const returnDate = content.returnDate ? new Date(content.returnDate).toLocaleDateString() : 'Non spécifiée';
    pdf.text(`Date de retour: ${returnDate}`, 20, 110);
    
    pdf.text(`Nombre de passagers: ${content.passengers || '1'}`, 20, 116);
    
    const travelClass = 
      content.travelClass === 'economy' ? 'Économique' :
      content.travelClass === 'premium' ? 'Premium Economy' :
      content.travelClass === 'business' ? 'Business' :
      content.travelClass === 'first' ? 'Première classe' :
      content.travelClass || 'Non spécifiée';
    
    pdf.text(`Classe: ${travelClass}`, 20, 122);
    
    // Afficher le budget si disponible
    if (content.budget) {
      pdf.text(`Budget estimé: ${content.budget} FCFA`, 20, 128);
    }
    
    // Message du client si disponible
    if (content.message) {
      pdf.setFontSize(12);
      pdf.setTextColor(0, 72, 186);
      pdf.text('Message du client:', 20, 138);
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      
      // Gérer les messages longs
      const splitMessage = pdf.splitTextToSize(content.message, 170);
      pdf.text(splitMessage, 20, 146);
    }
    
    // Pied de page
    const footerY = pdf.internal.pageSize.getHeight() - 10;
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('NASSER TRAVEL HORIZON | Tél: +235 66 38 69 37 | Email: contact@nassertravelhorizon.com', 105, footerY - 5, { align: 'center' });
    pdf.text(`Page 1 sur 2`, 105, footerY, { align: 'center' });
    
    // PAGE 2 - RÉPONSE AGENCE
    pdf.addPage();
    
    // En-tête page 2
    pdf.setFontSize(18);
    pdf.setTextColor(0, 72, 186); // Bleu NASSER
    pdf.text('NASSER TRAVEL HORIZON', 105, 20, { align: 'center' });
    
    // Titre de la réponse
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Réponse - ${title}`, 105, 35, { align: 'center' });
    
    // Ligne de séparation
    pdf.setDrawColor(0, 72, 186);
    pdf.line(20, 40, 190, 40);
    
    // Date de la réponse
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const responseDate = content.responseDate ? new Date(content.responseDate).toLocaleDateString() : new Date().toLocaleDateString();
    pdf.text(`Date de réponse: ${responseDate}`, 20, 50);
    
    // Contenu de la réponse
    pdf.setFontSize(12);
    pdf.setTextColor(0, 72, 186);
    pdf.text('Notre réponse:', 20, 60);
    
    if (content.response) {
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      
      // Diviser la réponse en lignes pour qu'elle s'adapte à la page
      const splitResponse = pdf.splitTextToSize(content.response, 170);
      
      // Calculer si le contenu va dépasser la page
      const textHeight = splitResponse.length * 5; // Estimation approximative de la hauteur du texte
      const availableHeight = pdf.internal.pageSize.getHeight() - 80; // Espace disponible après l'en-tête
      
      if (textHeight > availableHeight) {
        // Utiliser addPage pour gérer le contenu sur plusieurs pages
        let currentY = 70;
        const maxY = pdf.internal.pageSize.getHeight() - 20;
        
        for (let i = 0; i < splitResponse.length; i++) {
          if (currentY > maxY) {
            pdf.addPage();
            const pageCount = pdf.getNumberOfPages();
            
            // Ajouter l'en-tête et le pied de page à la nouvelle page
            pdf.setFontSize(18);
            pdf.setTextColor(0, 72, 186);
            pdf.text('NASSER TRAVEL HORIZON', 105, 20, { align: 'center' });
            
            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Réponse - ${title} (suite)`, 105, 35, { align: 'center' });
            
            pdf.setDrawColor(0, 72, 186);
            pdf.line(20, 40, 190, 40);
            
            // Pied de page sur la nouvelle page
            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text('NASSER TRAVEL HORIZON | Tél: +235 66 38 69 37 | Email: contact@nassertravelhorizon.com', 105, footerY - 5, { align: 'center' });
            pdf.text(`Page ${pageCount} sur ${pageCount}`, 105, footerY, { align: 'center' });
            
            currentY = 50; // Reset Y position on new page
          }
          
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          pdf.text(splitResponse[i], 20, currentY);
          currentY += 5; // Line height
        }
      } else {
        // Si le contenu tient sur une page
        pdf.text(splitResponse, 20, 70);
      }
    } else {
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Aucune réponse fournie", 20, 70);
    }
    
    // Pied de page de la deuxième page
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('NASSER TRAVEL HORIZON | Tél: +235 66 38 69 37 | Email: contact@nassertravelhorizon.com', 105, footerY - 5, { align: 'center' });
    pdf.text(`Page 2 sur 2`, 105, footerY, { align: 'center' });
    
    pdf.save(`${filename}.pdf`);
  }
}

export default PDFService;
