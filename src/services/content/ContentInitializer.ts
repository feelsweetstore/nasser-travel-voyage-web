
import { ContentStorage } from './ContentStorage';

/**
 * Service d'initialisation du contenu par défaut
 */
export class ContentInitializer {
  /**
   * Initialise le contenu par défaut si nécessaire
   */
  static initialize(): void {
    if (!ContentStorage.hasStoredContent()) {
      const defaultContent = [
        // Remplacer le hero_title et hero_subtitle par un texte de type "text" pour la catégorie "hero"
        { id: 1, title: "Texte d'accueil", page: "Accueil", content: "Bienvenue chez NASSER TRAVEL HORIZON\n\nVotre partenaire de confiance pour tous vos voyages au départ du Tchad et partout dans le monde.", type: "text", category: "hero" },
        { id: 3, title: "À propos", page: "À propos", content: "NASSER TRAVEL HORIZON est une agence de voyage basée à N'Djamena, Tchad. Nous proposons des services de réservation de billets d'avion, d'hôtels et d'organisation de voyages sur mesure depuis plus de 5 ans.", type: "text", category: "about" },
        { id: 4, title: "Services", page: "Services", content: "Nous offrons une gamme complète de services pour répondre à tous vos besoins de voyage : réservation de billets, organisation de séjours, assistance visa, transferts aéroport et bien plus encore.", type: "text", category: "services" },
        { id: 5, title: "Logo principal", page: "Global", content: "/placeholder.svg", type: "logo", category: "header" },
        { id: 6, title: "Image de fond accueil", page: "Accueil", content: "/placeholder.svg", type: "background", category: "hero" },
        { id: 7, title: "Heures d'ouverture", page: "Global", content: "Lundi - Vendredi: 8h - 18h\nSamedi: 9h - 15h\nDimanche: Fermé", type: "hours", category: "footer" },
        { id: 8, title: "Coordonnées", page: "Global", content: "Adresse: Avenue Charles de Gaulle, N'Djamena, Tchad\nTéléphone: +235 66 38 69 37, +235 99 00 00 00\nEmail: contact@nassertravelhorizon.com, info@nassertravelhorizon.com", type: "contact", category: "footer" },
        { id: 9, title: "Mentions légales", page: "Mentions légales", content: "NASSER TRAVEL HORIZON - SARL au capital de 5 000 000 FCFA\nSiège social : Avenue Charles de Gaulle, N'Djamena, Tchad\nRCS N'Djamena : 123456789\nDirecteur de la publication : M. Nasser\nHébergeur : OVH - 2 rue Kellermann - 59100 Roubaix - France", type: "legal", category: "legal" },
        { id: 10, title: "Politique de confidentialité", page: "Politique de confidentialité", content: "Chez NASSER TRAVEL HORIZON, nous nous engageons à protéger et à respecter votre vie privée. Cette politique définit la base sur laquelle les données personnelles que nous collectons auprès de vous, ou que vous nous fournissez, seront traitées par nous.", type: "privacy", category: "legal" },
        { id: 11, title: "CGV", page: "CGV", content: "Les présentes conditions générales de vente régissent les relations contractuelles entre la société NASSER TRAVEL HORIZON et ses clients, dans le cadre de son activité d'agence de voyage.", type: "terms", category: "legal" },
        
        // Nouveau contenu pour Accompagnement Visa
        { id: 12, title: "Titre principal", page: "Accompagnement Visa", content: "Accompagnement Visa", type: "text", category: "hero" },
        { id: 13, title: "Sous-titre", page: "Accompagnement Visa", content: "Facilitez vos démarches administratives avec notre service d'accompagnement visa personnalisé", type: "text", category: "hero" },
        { id: 14, title: "Description des services", page: "Accompagnement Visa", content: "NASSER TRAVEL HORIZON vous accompagne dans toutes vos démarches de visa. Notre équipe d'experts vous guide à chaque étape pour maximiser vos chances d'obtention.", type: "text", category: "services" },
        { id: 15, title: "Types de visa", page: "Accompagnement Visa", content: "Visa Touristique|Pour vos voyages de loisirs et découvertes|5-15 jours\nVisa d'Affaires|Pour vos déplacements professionnels|7-21 jours\nVisa Transit|Pour les escales et correspondances|3-7 jours\nVisa Étudiant|Pour poursuivre vos études à l'étranger|15-30 jours", type: "text", category: "services" },
        { id: 16, title: "Pays supportés", page: "Accompagnement Visa", content: "France, Canada, États-Unis, Royaume-Uni, Allemagne, Italie, Espagne, Belgique, Pays-Bas, Suisse, Australie, Dubaï, Arabie Saoudite, Turquie, Maroc, Sénégal, Côte d'Ivoire", type: "text", category: "services" },
        
        // Nouveau contenu pour Conseils Voyage  
        { id: 17, title: "Titre principal", page: "Conseils Voyage", content: "Conseils Voyage", type: "text", category: "hero" },
        { id: 18, title: "Sous-titre", page: "Conseils Voyage", content: "Profitez de notre expertise pour préparer au mieux votre voyage", type: "text", category: "hero" },
        { id: 19, title: "Description", page: "Conseils Voyage", content: "Bénéficiez de conseils personnalisés de nos experts pour organiser votre voyage dans les meilleures conditions.", type: "text", category: "services" },
        { id: 20, title: "Conseils avant départ", page: "Conseils Voyage", content: "Vérification des documents|Passeport, visa, permis de conduire international\nVaccinations|Conseils santé selon la destination\nAssurance voyage|Protection complète pendant votre séjour\nBagages|Conseils d'emballage et restrictions", type: "text", category: "services" },
        { id: 21, title: "Conseils destination", page: "Conseils Voyage", content: "Culture locale|Traditions et coutumes à respecter\nMonnaie|Taux de change et moyens de paiement\nClimat|Météo et vêtements recommandés\nTransports|Options de déplacement sur place", type: "text", category: "services" },
      ];
      ContentStorage.saveContent(defaultContent);
    }
  }
}
