
import { PDFGenerator } from './pdf/PDFGenerator';

/**
 * Service pour la génération de PDF - Interface principale
 */
class PDFService {
  /**
   * Génère un PDF à partir d'un contenu HTML
   * @param elementId - ID de l'élément HTML à convertir en PDF
   * @param filename - Nom du fichier PDF
   */
  static async generatePDF(elementId: string, filename: string): Promise<void> {
    return PDFGenerator.generateFromElement(elementId, filename);
  }

  /**
   * Génère un PDF à partir d'un contenu texte avec demande sur page 1 et réponse sur page 2
   * @param request - Données de la demande
   * @param title - Titre du document
   * @param filename - Nom du fichier PDF
   */
  static generateResponsePDF(request: any, title: string, filename: string): void {
    return PDFGenerator.generateResponsePDF(request, title, filename);
  }

  /**
   * Génère un PDF pour un message de contact
   * @param contactMessage - Données du message de contact
   * @param filename - Nom du fichier PDF
   */
  static generateContactPDF(contactMessage: any, filename: string): void {
    return PDFGenerator.generateContactPDF(contactMessage, filename);
  }
}

export default PDFService;
