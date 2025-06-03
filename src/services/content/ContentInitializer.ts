
/**
 * Service d'initialisation du contenu par défaut
 */
export class ContentInitializer {
  /**
   * Initialise le contenu par défaut si aucun contenu n'existe
   */
  static initialize(): void {
    const existingContent = localStorage.getItem('siteContent');
    
    if (!existingContent) {
      const defaultContent = [
        // Contenu de la page d'accueil
        {
          id: 1,
          title: "Titre principal",
          content: "Découvrez le monde avec NASSER TRAVEL HORIZON",
          page: "Accueil",
          type: "text",
          category: "hero"
        },
        {
          id: 2,
          title: "Sous-titre principal", 
          content: "Votre partenaire de confiance pour tous vos voyages d'affaires et de loisirs",
          page: "Accueil",
          type: "text",
          category: "hero"
        },
        // Heures d'ouverture
        {
          id: 3,
          title: "Heures d'ouverture - Semaine",
          content: "Lundi - Vendredi: 8h00 - 18h00",
          page: "Global",
          type: "hours",
          category: "weekdays"
        },
        {
          id: 4,
          title: "Heures d'ouverture - Samedi",
          content: "Samedi: 9h00 - 16h00",
          page: "Global", 
          type: "hours",
          category: "saturday"
        },
        {
          id: 5,
          title: "Heures d'ouverture - Dimanche",
          content: "Dimanche: Fermé",
          page: "Global",
          type: "hours", 
          category: "sunday"
        },
        // Contenu page Accompagnement Visa
        {
          id: 6,
          title: "Titre page Accompagnement Visa",
          content: "Accompagnement Visa",
          page: "AccompagnementVisa",
          type: "text",
          category: "title"
        },
        {
          id: 7,
          title: "Sous-titre page Accompagnement Visa",
          content: "Facilitez vos démarches administratives avec notre service d'accompagnement visa personnalisé",
          page: "AccompagnementVisa",
          type: "text",
          category: "subtitle"
        },
        {
          id: 8,
          title: "Description service visa",
          content: "Notre équipe d'experts vous accompagne dans toutes vos démarches de demande de visa. Nous mettons notre expérience à votre service pour maximiser vos chances d'obtention.",
          page: "AccompagnementVisa",
          type: "text",
          category: "description"
        },
        // Contenu page Conseils Voyage
        {
          id: 9,
          title: "Titre page Conseils Voyage",
          content: "Conseils Voyage",
          page: "ConseilsVoyage",
          type: "text",
          category: "title"
        },
        {
          id: 10,
          title: "Sous-titre page Conseils Voyage", 
          content: "Découvrez nos conseils d'experts pour organiser et profiter pleinement de votre voyage",
          page: "ConseilsVoyage",
          type: "text",
          category: "subtitle"
        },
        {
          id: 11,
          title: "Description conseils voyage",
          content: "Nos conseillers expérimentés partagent avec vous leurs meilleurs conseils pour voyager en toute sérénité. De la préparation au retour, nous vous accompagnons.",
          page: "ConseilsVoyage",
          type: "text",
          category: "description"
        }
      ];
      
      localStorage.setItem('siteContent', JSON.stringify(defaultContent));
    }
  }
}
