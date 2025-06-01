
/**
 * Service de gestion des modèles de réponse pour les demandes
 */
class ResponseTemplateService {
  private static TEMPLATES_KEY = 'responseTemplates';
  
  /**
   * Récupère les modèles de réponse par défaut
   */
  private static getDefaultTemplates() {
    return {
      quote: `Objet : Votre devis pour un voyage vers [DESTINATION] – NASSER TRAVEL HORIZON

Cher(e) [NOM_CLIENT],
Nous vous remercions pour votre demande de devis concernant votre voyage vers [DESTINATION], du [DATE_DEPART] au [DATE_RETOUR], en classe [CLASSE] pour [PASSAGERS] passager(s).

Voici notre proposition personnalisée :

✈️ Détails de l'offre (à remplir par l'agence)

Vol : [Compagnie aérienne]

Bagages : [Bagages inclus]

Temps de vol : [Durée estimée]

Escale(s) : [Oui / Non / Nombre]

💰 Prix total : 
📅 Offre valable jusqu'au : [Date limite]
🎯 Budget client estimé : [BUDGET]

Veuillez noter que les tarifs de vols sont flexibles et peuvent changer a tout moment.
Cependant, merci de bien vouloir nous confirmer votre accord afin de finaliser la réservation et garantir la disponibilité au tarif indiqué.
 
Si vous souhaitez modifier certaines informations (dates, classe, destination, etc.), n'hésitez pas à nous le faire savoir.

Cordialement,
L'équipe NASSER TRAVEL HORIZON
📞 Tél : +235 66 38 69 37
📧 Email : contact@nassertravelhorizon.com
📍 N'Djamena, Tchad`,
      
      reservation: `Objet : Votre réservation de billet pour [DESTINATION] – NASSER TRAVEL HORIZON

Cher(e) [NOM_CLIENT],
Nous avons bien reçu votre demande de réservation de billet à destination de [DESTINATION], pour un départ prévu le [DATE_DEPART] et un retour le [DATE_RETOUR], en classe [CLASSE] pour [PASSAGERS] passager(s).

Voici les détails de votre réservation en cours de traitement :

✈️ Détails du vol proposé (à compléter par l'agence)

Compagnie aérienne : [Nom de la compagnie]

Heure de départ : [Heure]

Heure d'arrivée : [Heure]

Escale(s) : [Oui / Non / Détails]

Bagages inclus : [Poids / type]

Numéro de vol : [XXXX]

💰 Tarif total : [Montant en FCFA]
📅 Validité de la réservation : [Date limite de confirmation]

Afin de finaliser votre réservation, merci de bien vouloir :
✅ Confirmer votre accord par retour de message via notre e-mail.
✅ Nous faire parvenir une copie de votre passeport (si ce n'est pas encore fait).
✅ Procéder au paiement dans le délai mentionné ci-dessus

Si vous avez des questions ou souhaitez ajuster certains détails de votre voyage, notre équipe reste à votre entière disposition.

Cordialement,
L'équipe NASSER TRAVEL HORIZON
📞 Tél : +235 66 38 69 37
📧 Email : contact@nassertravelhorizon.com
📍 N'Djamena, Tchad`
    };
  }
  
  /**
   * Récupère les modèles de réponse
   */
  static getTemplates() {
    const stored = localStorage.getItem(this.TEMPLATES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultTemplates();
  }
  
  /**
   * Met à jour un modèle de réponse
   */
  static updateTemplate(type: 'quote' | 'reservation', content: string) {
    const templates = this.getTemplates();
    templates[type] = content;
    localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
  }
  
  /**
   * Récupère un modèle spécifique
   */
  static getTemplate(type: 'quote' | 'reservation'): string {
    const templates = this.getTemplates();
    return templates[type] || '';
  }
  
  /**
   * Remplace les variables dans un modèle avec les données de la demande
   */
  static fillTemplate(type: 'quote' | 'reservation', requestData: any): string {
    let template = this.getTemplate(type);
    
    // Remplacer les variables
    template = template.replace(/\[DESTINATION\]/g, requestData.destination || '[Destination]');
    template = template.replace(/\[NOM_CLIENT\]/g, requestData.fullName || '[Nom du client]');
    template = template.replace(/\[DATE_DEPART\]/g, requestData.departureDate ? new Date(requestData.departureDate).toLocaleDateString() : '[Date de départ]');
    template = template.replace(/\[DATE_RETOUR\]/g, requestData.returnDate ? new Date(requestData.returnDate).toLocaleDateString() : '[Date de retour]');
    template = template.replace(/\[PASSAGERS\]/g, requestData.passengers || '1');
    template = template.replace(/\[CLASSE\]/g, this.getTravelClassInFrench(requestData.travelClass));
    template = template.replace(/\[BUDGET\]/g, requestData.budget ? `${requestData.budget} FCFA` : '[Budget non spécifié]');
    
    return template;
  }
  
  /**
   * Convertit la classe de voyage en français
   */
  private static getTravelClassInFrench(travelClass: string): string {
    switch (travelClass) {
      case 'economy': return 'Économique';
      case 'premium': return 'Premium Economy';
      case 'business': return 'Business';
      case 'first': return 'Première classe';
      default: return travelClass || 'Non spécifiée';
    }
  }
}

export default ResponseTemplateService;
