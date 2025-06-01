
/**
 * Service de gestion des événements de contenu
 */
export class ContentEventManager {
  /**
   * Notifie les changements de contenu
   */
  static notifyContentChange(type: string, content?: any, id?: number): void {
    window.dispatchEvent(new CustomEvent('contentUpdated', {
      detail: { type, content, id }
    }));
  }
}
