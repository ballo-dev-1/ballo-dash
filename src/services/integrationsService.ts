import { companyService } from "./companyService";

interface Integration {
  id: string;
  companyId: string;
  type: string;
  status: string;
  handle?: string;
  appId?: string;
  appSecret?: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
  accountId?: string;
  metadata?: any;
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
  private readonly CACHE_DURATION = process.env.NODE_ENV === 'development' 
    ? 30 * 1000  // 30 seconds for development
    : 5 * 60 * 1000; // 5 minutes for production

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
      console.log('IntegrationsService: Returning cached integrations');
      return this.integrations;
    }

    if (this.isLoading) {
      console.log('IntegrationsService: Request already in progress, waiting...');
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.integrations;
    }

    try {
      console.log('IntegrationsService: Fetching integrations...');
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
      
      console.log('IntegrationsService: Integrations stored in cache');
      return this.integrations;
    } catch (error) {
      console.error('❌ IntegrationsService: Error fetching integrations:', error);
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  public async getIntegrationsForModal(): Promise<Integration[]> {
    // This method bypasses cache and gets fresh data with access tokens
    try {
      console.log('IntegrationsService: Fetching integrations for modal (bypassing cache)...');
      
      const response = await fetch('/api/integrations/modal-data');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch integrations for modal: ${response.status}`);
      }

      const data = await response.json();
      console.log('IntegrationsService: Modal integrations fetched:', data.length);
      
      return data || [];
    } catch (error) {
      console.error('❌ IntegrationsService: Error fetching integrations for modal:', error);
      return [];
    }
  }

  public async getSocialProfiles(): Promise<SocialProfile[]> {
    const cacheKey = 'socialProfiles';
    
    if (this.socialProfiles.length > 0 && this.isDataFresh(cacheKey)) {
      console.log('IntegrationsService: Returning cached social profiles');
      return this.socialProfiles;
    }

    try {
      console.log('IntegrationsService: Fetching social profiles...');
      
      const response = await fetch('/api/social-profiles/routes');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch social profiles: ${response.status}`);
      }

      const data = await response.json();
      this.socialProfiles = data || [];
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('IntegrationsService: Social profiles stored in cache');
      return this.socialProfiles;
    } catch (error) {
      console.error('❌ IntegrationsService: Error fetching social profiles:', error);
      return [];
    }
  }

  public async createIntegration(integrationData: {
    type: string;
    status: string;
    handle?: string;
    appId?: string;
    appSecret?: string;
    accessToken: string;
    refreshToken?: string | null;
    expiresAt?: string | null;
    accountId?: string;
    metadata?: any;
    companyId: string;
  }): Promise<Integration> {
    try {
      console.log('IntegrationsService: Creating new integration:', integrationData);
      
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(integrationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create integration: ${response.status} - ${errorText}`);
      }

      const newIntegration = await response.json();
      
      // Add to local cache
      this.integrations.push(newIntegration);
      
      // Clear cache to force refresh on next get
      delete this.lastFetch['integrations'];
      
      console.log('✅ IntegrationsService: Integration created successfully');
      return newIntegration;
    } catch (error) {
      console.error('❌ IntegrationsService: Error creating integration:', error);
      throw error;
    }
  }

  public async updateIntegration(integrationId: string, updateData: {
    accessToken?: string;
    refreshToken?: string | null;
    status?: string;
    handle?: string;
    appId?: string;
    appSecret?: string;
    expiresAt?: string | null;
    accountId?: string;
  }): Promise<Integration> {
    try {
      console.log('IntegrationsService: Updating integration:', integrationId);
      console.log('IntegrationsService: Update data:', updateData);
      
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update integration: ${response.status} - ${errorText}`);
      }

      const updatedIntegration = await response.json();
      
      // Update local cache
      this.integrations = this.integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, ...updatedIntegration }
          : integration
      );
      
      // Clear cache to force refresh on next get
      delete this.lastFetch['integrations'];
      
      console.log('✅ IntegrationsService: Integration updated successfully');
      return updatedIntegration;
    } catch (error) {
      console.error('❌ IntegrationsService: Error updating integration:', error);
      throw error;
    }
  }

  public async updateIntegrationForModal(integrationId: string, updateData: {
    accessToken?: string;
    refreshToken?: string | null;
    status?: string;
    handle?: string;
    appId?: string;
    appSecret?: string;
    expiresAt?: string | null;
    accountId?: string;
  }): Promise<Integration> {
    try {
      console.log('IntegrationsService: Updating integration for modal:', integrationId);
      console.log('IntegrationsService: Update data:', updateData);
      
      const response = await fetch(`/api/integrations/modal-update?id=${integrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update integration for modal: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      console.log('✅ IntegrationsService: Integration updated successfully for modal');
      return result;
    } catch (error) {
      console.error('❌ IntegrationsService: Error updating integration for modal:', error);
      throw error;
    }
  }

  public async deleteIntegration(integrationId: string): Promise<void> {
    try {
      console.log('IntegrationsService: Deleting integration:', integrationId);
      
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete integration: ${response.status} - ${errorText}`);
      }
      
      // Remove from local cache
      this.integrations = this.integrations.filter(integration => integration.id !== integrationId);
      
      // Clear cache to force refresh on next get
      delete this.lastFetch['integrations'];
      
      console.log('✅ IntegrationsService: Integration deleted successfully');
    } catch (error) {
      console.error('❌ IntegrationsService: Error deleting integration:', error);
      throw error;
    }
  }

  public async refreshFacebookTokenInfo(integrationId: string): Promise<any> {
    try {
      console.log('IntegrationsService: Refreshing Facebook token info for integration:', integrationId);
      
      const response = await fetch('/api/integrations/facebook-token-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ integrationId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to refresh Facebook token info: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      // Clear cache to force refresh on next get
      delete this.lastFetch['integrations'];
      
      console.log('✅ IntegrationsService: Facebook token info refreshed successfully');
      return result;
    } catch (error) {
      console.error('❌ IntegrationsService: Error refreshing Facebook token info:', error);
      throw error;
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
    if (!lastFetch) return false;
    return (Date.now() - lastFetch) < this.CACHE_DURATION;
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
