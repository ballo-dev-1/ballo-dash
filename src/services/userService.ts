import { User } from "@/types";

class UserService {
  private static instance: UserService;
  private userData: User | null = null;
  private isLoading: boolean = false;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getUser(): Promise<User | null> {
    // Return cached data if it's still valid
    if (this.userData && this.isDataFresh()) {
      console.log('🔍 UserService: Returning cached user data');
      return this.userData;
    }

    // Prevent multiple simultaneous requests
    if (this.isLoading) {
      console.log('🔍 UserService: Request already in progress, waiting...');
      // Wait for the current request to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.userData;
    }

    try {
      console.log('🔍 UserService: Fetching user data from API...');
      this.isLoading = true;
      const response = await fetch('/api/user');
      
      console.log('🔍 UserService: API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 UserService: API response data:', data);
      
      this.userData = data.user;
      this.lastFetch = Date.now();
      
      console.log('🔍 UserService: User data stored in cache');
      return this.userData;
    } catch (error) {
      console.error('❌ UserService: Error fetching user data:', error);
      // Don't throw - just return null to prevent app crashes
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  public async refreshUser(): Promise<User | null> {
    // Clear cache and fetch fresh data
    this.userData = null;
    this.lastFetch = 0;
    return this.getUser();
  }

  public getCachedUser(): User | null {
    return this.isDataFresh() ? this.userData : null;
  }

  private isDataFresh(): boolean {
    return Date.now() - this.lastFetch < this.CACHE_DURATION;
  }

  public clearCache(): void {
    this.userData = null;
    this.lastFetch = 0;
  }
}

export const userService = UserService.getInstance();
