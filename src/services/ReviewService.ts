
/**
 * Service de gestion des avis clients
 */
class ReviewService {
  private static STORAGE_KEY = 'clientReviews';
  
  /**
   * Récupère tous les avis clients
   * @returns Liste des avis clients
   */
  static getReviews(): any[] {
    const storedReviews = localStorage.getItem(this.STORAGE_KEY);
    if (!storedReviews) return [];
    return JSON.parse(storedReviews);
  }
  
  /**
   * Récupère uniquement les avis publiés
   * @returns Liste des avis publiés
   */
  static getPublishedReviews(): any[] {
    const reviews = this.getReviews();
    return reviews.filter(review => review.published);
  }
  
  /**
   * Ajoute un nouvel avis
   * @param review - L'avis à ajouter
   * @returns L'avis ajouté avec un ID
   */
  static addReview(review: any): any {
    const reviews = this.getReviews();
    const newReview = {
      ...review,
      id: reviews.length ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      published: false // Par défaut, les avis ne sont pas publiés
    };
    
    const updatedReviews = [...reviews, newReview];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReviews));
    return newReview;
  }
  
  /**
   * Met à jour le statut de publication d'un avis
   * @param id - ID de l'avis
   * @param published - Statut de publication
   * @returns Liste mise à jour des avis
   */
  static updateReviewStatus(id: number, published: boolean): any[] {
    const reviews = this.getReviews();
    const updatedReviews = reviews.map(review => 
      review.id === id ? { ...review, published } : review
    );
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReviews));
    return updatedReviews;
  }
  
  /**
   * Supprime un avis
   * @param id - ID de l'avis à supprimer
   * @returns Liste mise à jour des avis
   */
  static deleteReview(id: number): any[] {
    const reviews = this.getReviews();
    const updatedReviews = reviews.filter(review => review.id !== id);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReviews));
    return updatedReviews;
  }
}

export default ReviewService;
