import { companyService } from "./companyService";

interface Integration {
  id: string;
  companyId: string;
  type: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SocialProfile {
  id: string;
  companyId: string;
  platform: string;
  profileId: string;
  handle: string;
  connectedAt: string;
}

class IntegrationsService {
  private static instance: IntegrationsService;
  private integrations: Integration[] = [];
  private socialProfiles: SocialProfile[] = [];
  private isLoading: boolean = false;
  private lastFetch: Record<string, number> = {};
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private constructor() {}

  public static getInstance(): IntegrationsService {
    if (!IntegrationsService.instance) {
      IntegrationsService.instance = new IntegrationsService();
    }
    return IntegrationsService.instance;
  }

  public async getIntegrations(): Promise<Integration[]> {
    const cacheKey = 'integrations';
    
    if (this.integrations.length > 0 && this.isDataFresh(cacheKey)) {
      console.log('🔍 IntegrationsService: Returning cached integrations');
      return this.integrations;
    }

    if (this.isLoading) {
      console.log('🔍 IntegrationsService: Request already in progress, waiting...');
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.integrations;
    }

    try {
      console.log('🔍 IntegrationsService: Fetching integrations...');
      this.isLoading = true;
      
      // Get company first, then integrations
      const company = await companyService.getCompany();
      if (!company) {
        throw new Error('Company not found');
      }
      
      const response = await fetch(`/api/integrations?companyId=${company.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch integrations: ${response.status}`);
      }

      const data = await response.json();
      this.integrations = data || [];
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('🔍 IntegrationsService: Integrations stored in cache');
      return this.integrations;
    } catch (error) {
      console.error('❌ IntegrationsService: Error fetching integrations:', error);
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  public async getSocialProfiles(): Promise<SocialProfile[]> {
    const cacheKey = 'socialProfiles';
    
    if (this.socialProfiles.length > 0 && this.isDataFresh(cacheKey)) {
      console.log('🔍 IntegrationsService: Returning cached social profiles');
      return this.socialProfiles;
    }

    try {
      console.log('🔍 IntegrationsService: Fetching social profiles...');
      
      const response = await fetch('/api/social-profiles/routes');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch social profiles: ${response.status}`);
      }

      const data = await response.json();
      this.socialProfiles = data || [];
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('🔍 IntegrationsService: Social profiles stored in cache');
      return this.socialProfiles;
    } catch (error) {
      console.error('❌ IntegrationsService: Error fetching social profiles:', error);
      return [];
    }
  }

  public async getIntegrationByType(type: string): Promise<Integration | null> {
    const integrations = await this.getIntegrations();
    return integrations.find(integration => integration.type === type) || null;
  }

  public async getSocialProfileByPlatform(platform: string): Promise<SocialProfile | null> {
    const profiles = await this.getSocialProfiles();
    return profiles.find(profile => profile.platform === platform) || null;
  }

  public async refreshIntegrations(): Promise<Integration[]> {
    this.clearCache();
    return this.getIntegrations();
  }

  public async refreshSocialProfiles(): Promise<SocialProfile[]> {
    this.clearCache();
    return this.getSocialProfiles();
  }

  private isDataFresh(cacheKey: string): boolean {
    const lastFetch = this.lastFetch[cacheKey];
    return lastFetch && (Date.now() - lastFetch < this.CACHE_DURATION);
  }

  public clearCache(): void {
    this.integrations = [];
    this.socialProfiles = [];
    this.lastFetch = {};
  }

  public clearIntegrationCache(): void {
    this.integrations = [];
    delete this.lastFetch['integrations'];
  }

  public clearSocialProfilesCache(): void {
    this.socialProfiles = [];
    delete this.lastFetch['socialProfiles'];
  }
}

export const integrationsService = IntegrationsService.getInstance();
