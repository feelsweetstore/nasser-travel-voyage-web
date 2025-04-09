
/**
 * Service for managing online reservation functionality
 */
class OnlineReservationService {
  private static STORAGE_KEY = 'onlineReservationEnabled';

  /**
   * Get the current status of online reservation
   * @returns boolean - true if enabled, false if disabled
   */
  static async getStatus(): Promise<boolean> {
    // Simulate an API call with a small delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  /**
   * Update the status of online reservation
   * @param enabled - Whether online reservation should be enabled
   */
  static async updateStatus(enabled: boolean): Promise<void> {
    // Simulate an API call with a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem(this.STORAGE_KEY, enabled.toString());
  }

  /**
   * Process a reservation
   * @param reservationData - The reservation data
   * @returns The created reservation ID
   */
  static async createReservation(reservationData: any): Promise<string> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Store the reservation in localStorage (in a real app this would go to a database)
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const newReservation = {
      id: `res-${Date.now()}`,
      ...reservationData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    reservations.push(newReservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    return newReservation.id;
  }

  /**
   * Get all reservations
   * @returns Array of reservation objects
   */
  static async getReservations(): Promise<any[]> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem('reservations') || '[]');
  }
}

export default OnlineReservationService;
