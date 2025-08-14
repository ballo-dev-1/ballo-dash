import { Company } from "@/types";
import { tokenCache } from "@/lib/tokenCache";

class CompanyService {
  private static instance: CompanyService;
  private companyData: Company | null = null;
  private isLoading: boolean = false;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): CompanyService {
    if (!CompanyService.instance) {
      CompanyService.instance = new CompanyService();
    }
    return CompanyService.instance;
  }

  public async getCompany(): Promise<Company | null> {
    // Return cached data if it's still valid
    if (this.companyData && this.isDataFresh()) {
      console.log('🔍 CompanyService: Returning cached company data');
      return this.companyData;
    }

    // Prevent multiple simultaneous requests
    if (this.isLoading) {
      console.log('🔍 CompanyService: Request already in progress, waiting...');
      // Wait for the current request to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.companyData;
    }

    try {
      console.log('🔍 CompanyService: Fetching company data from API...');
      this.isLoading = true;
      const response = await fetch('/api/company');
      
      console.log('🔍 CompanyService: API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch company data: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 CompanyService: API response data:', data);
      
      this.companyData = data.company;
      this.lastFetch = Date.now();
      
      console.log('🔍 CompanyService: Company data stored in cache');
      return this.companyData;
    } catch (error) {
      console.error('❌ CompanyService: Error fetching company data:', error);
      // Don't throw - just return null to prevent app crashes
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  public async refreshCompany(): Promise<Company | null> {
    // Clear cache and fetch fresh data
    this.companyData = null;
    this.lastFetch = 0;
    return this.getCompany();
  }

  public getCachedCompany(): Company | null {
    return this.isDataFresh() ? this.companyData : null;
  }

  private isDataFresh(): boolean {
    return Date.now() - this.lastFetch < this.CACHE_DURATION;
  }

  public clearCache(): void {
    // Store company ID before clearing
    const companyId = this.companyData?.id;
    
    this.companyData = null;
    this.lastFetch = 0;
    
    // Also clear any cached tokens for this company
    if (companyId) {
      tokenCache.clearCompanyTokens(companyId);
    }
  }
}

export const companyService = CompanyService.getInstance();
