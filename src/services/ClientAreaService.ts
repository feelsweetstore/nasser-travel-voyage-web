
/**
 * Service for managing client area functionality
 */
class ClientAreaService {
  private static STORAGE_KEY = 'clientAreaEnabled';
  private static AUTH_KEY = 'clientAuth';
  private static PROFILE_KEY = 'clientProfile';

  /**
   * Get the current status of client area
   * @returns boolean - true if enabled, false if disabled
   */
  static async getStatus(): Promise<boolean> {
    // Simulate an API call with a small delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  /**
   * Update the status of client area
   * @param enabled - Whether client area should be enabled
   */
  static async updateStatus(enabled: boolean): Promise<void> {
    // Simulate an API call with a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem(this.STORAGE_KEY, enabled.toString());
  }

  /**
   * Check if a user is logged in
   * @returns boolean - true if logged in, false otherwise
   */
  static isLoggedIn(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  /**
   * Log in a user
   * @param email - User email
   * @param password - User password
   * @returns boolean - true if login successful, false otherwise
   */
  static async login(email: string, password: string): Promise<boolean> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo credentials for testing
    if (email === 'demo@example.com' && password === 'password123') {
      localStorage.setItem(this.AUTH_KEY, 'true');
      return true;
    }
    
    return false;
  }

  /**
   * Log out the current user
   */
  static logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  /**
   * Get user profile data
   * @returns User profile object
   */
  static async getUserProfile(): Promise<any> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if there's a saved profile in localStorage
    const savedProfile = localStorage.getItem(this.PROFILE_KEY);
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    
    // Return default demo data if no saved profile
    const defaultProfile = {
      email: 'demo@example.com',
      name: 'Client Démo',
      phone: '+235 66 00 00 00',
      address: '',
      city: '',
      country: 'Tchad'
    };
    
    // Save the default profile
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  /**
   * Update user profile data
   * @param profileData - Updated profile data
   */
  static async updateUserProfile(profileData: any): Promise<void> {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Save the updated profile to localStorage
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profileData));
  }
}

export default ClientAreaService;
