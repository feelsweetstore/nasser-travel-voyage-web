
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
   * Process a reservation or quote request
   * @param reservationData - The reservation or quote data
   * @returns The created reservation/quote ID
   */
  static async createReservation(reservationData: any): Promise<string> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Store the reservation in localStorage (in a real app this would go to a database)
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const newReservation = {
      id: `res-${Date.now()}`,
      ...reservationData,
      createdAt: reservationData.createdAt || new Date().toISOString(),
      status: reservationData.status || 'nouveau'
    };
    
    reservations.push(newReservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    return newReservation.id;
  }

  /**
   * Get all reservations and quotes
   * @returns Array of reservation and quote objects
   */
  static async getReservations(): Promise<any[]> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem('reservations') || '[]');
  }
  
  /**
   * Get reservations by status
   * @param status - The status to filter by
   * @returns Array of filtered reservation objects
   */
  static async getReservationsByStatus(status: string): Promise<any[]> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    return reservations.filter((res: any) => res.status === status);
  }
  
  /**
   * Get reservations by type
   * @param type - The type to filter by (reservation or quote)
   * @returns Array of filtered reservation objects
   */
  static async getReservationsByType(type: string): Promise<any[]> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    return reservations.filter((res: any) => res.type === type);
  }
  
  /**
   * Update a reservation or quote status
   * @param id - The reservation ID
   * @param status - The new status
   */
  static async updateStatus(id: string, status: string): Promise<void> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const updatedReservations = reservations.map((res: any) => 
      res.id === id ? { ...res, status } : res
    );
    
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
  }
}

export default OnlineReservationService;
