// contexts/AppContext.tsx
import React, { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { Company, User } from "@/types";
import { companyService } from "@/services/companyService";
import { userService } from "@/services/userService";
import { integrationsService } from "@/services/integrationsService";
import { linkedinService } from "@/services/linkedinService";
import { facebookService } from "@/services/facebookService";
import { fetchLinkedInStats, fetchLinkedInPosts } from "@/toolkit/linkedInData/reducer";
import { fetchFacebookStats, fetchFacebookPosts } from "@/toolkit/facebookData/reducer";
import { fetchXStats, fetchXPosts } from "@/toolkit/xData/reducer";
import { fetchInstagramStats, fetchInstagramPosts } from "@/toolkit/instagramData/reducer";
import { setCompany } from "@/toolkit/Company/reducer";
import { setSelectedUser } from "@/toolkit/User/reducer";
import { AppDispatch } from "@/toolkit";
import toast from "react-hot-toast";


interface AppContextType {
  company: Company | null;
  user: User | null;
  setCompany: (company: Company | null) => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [company, setCompanyLocal] = useState<Company | null>(null);
  const [user, setUserLocal] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {

    if (!dispatch) {
      console.error('❌ AppContext: Dispatch is not available');
      return;
    }
    
    const fetchData = async () => {
      try {
        
        // Use the centralized services
        const [companyData, userData] = await Promise.all([
          companyService.getCompany(),
          userService.getUser(),
        ]);

        // Only set company if we got valid data
        if (companyData) {
          setCompanyLocal(companyData);
          // Also update Redux store
          dispatch(setCompany(companyData));
          
          // 🆕 Fetch LinkedIn and Facebook data if integrations exist
          try {
            const integrations = await integrationsService.getIntegrations();
            

            
            // Auto-fetch data for all CONNECTED integrations
            const autoFetchDataForIntegration = async (integration: any) => {
              try {
                
                console.log(`🔍 Processing integration: ${integration.type} (status: ${integration.status})`);
                
                if (integration.type === 'LINKEDIN') {
                  // For now, we'll use a default organization ID since we don't have social profiles set up yet
                  // TODO: Get this from social profiles when they're properly configured
                  const defaultLinkedInOrgId = '90362182'; // This should come from your database
                  
                  try {
                    // Fetch LinkedIn stats
                    await dispatch(fetchLinkedInStats({
                      organizationId: defaultLinkedInOrgId,
                      platform: 'linkedin',
                      since: '',
                      until: '',
                      datePreset: 'last_30_days'
                    })).unwrap();
                    
                    // Fetch LinkedIn posts
                    await dispatch(fetchLinkedInPosts({
                      organizationId: defaultLinkedInOrgId
                    })).unwrap();
                    
                    toast.success('LinkedIn data and posts loaded successfully');
                  } catch (error: any) {
                    // Provide more specific error messages based on the error
                    if (error.message?.includes('access token not found')) {
                      toast.error(`LinkedIn integration not set up. Please configure your LinkedIn integration first.`);
                    } else if (error.message?.includes('Unauthorized')) {
                      toast.error(`LinkedIn integration token expired. Please refresh your LinkedIn integration.`);
                    } else {
                      toast.error(`Failed to load LinkedIn data: ${error.message || 'Unknown error'}`);
                    }
                  }
                } else if (integration.type === 'FACEBOOK') {
                  // For now, we'll use a default page ID since we don't have social profiles set up yet
                  // TODO: Get this from social profiles when they're properly configured
                  const defaultPageId = 'me'; // This should come from your database
                  
                  try {
                    // Fetch Facebook stats
                    await dispatch(fetchFacebookStats({
                      pageId: defaultPageId,
                      platform: 'facebook',
                      since: '',
                      until: '',
                      datePreset: 'last_30_days'
                    })).unwrap();
                    
                    // Fetch Facebook posts
                    await dispatch(fetchFacebookPosts({
                      pageId: defaultPageId,
                      platform: 'facebook',
                      since: '',
                      until: '',
                      datePreset: 'last_30_days'
                    })).unwrap();
                    
                    toast.success('Facebook data and posts loaded successfully');
                  } catch (error: any) {
                    console.error(`❌ Facebook error:`, error);
                    if (error.message?.includes('access token not found')) {
                      toast.error(`Facebook integration not set up. Please configure your Facebook integration first.`);
                    } else if (error.message?.includes('Unauthorized')) {
                      toast.error(`Facebook integration token expired. Please refresh your Facebook integration.`);
                    } else {
                      toast.error(`Failed to load Facebook data: ${error.message || 'Unknown error'}`);
                    }
                  }
                } else if (integration.type === 'INSTAGRAM') {
                  console.log(`📸 Processing Instagram integration for: ${integration.type}, accountId: ${integration.accountId}`);
                  try {
                    // First fetch Instagram stats to get the username
                    const statsResult = await dispatch(fetchInstagramStats({
                      platform: 'instagram',
                      since: '',
                      until: '',
                      datePreset: 'last_30_days'
                    })).unwrap();
                    
                    // Then fetch Instagram posts using the accountId from integration and username from stats
                    await dispatch(fetchInstagramPosts({
                      accountId: integration.accountId || 'me', // Use accountId from integration table
                      username: statsResult.userInfo?.username // Use username from stats
                    })).unwrap();
                    
                    toast.success('Instagram data and posts loaded successfully');
                  } catch (error: any) {
                    console.error(`❌ Instagram error:`, error);
                    if (error.message?.includes('access token not found')) {
                      toast.error(`Instagram integration not set up. Please configure your Instagram integration first.`);
                    } else if (error.message?.includes('Unauthorized')) {
                      toast.error(`Instagram integration token expired. Please refresh your Instagram integration.`);
                    } else {
                      toast.error(`Failed to load Instagram data: ${error.message || 'Unknown error'}`);
                    }
                  }
                } else if (integration.type === 'X') {
                  // For X, we'll use the handle from the integration if available, or a default
                  // TODO: Get this from social profiles when they're properly configured
                  const username = integration.handle || 'GeorgeMsapenda'; // Default username, should come from integration handle
                  
                  try {
                    // First fetch X stats to get the accountId
                    const statsResult = await dispatch(fetchXStats({
                      username,
                      platform: integration.type.toLowerCase(),
                      since: '',
                      until: '',
                      datePreset: 'last_30_days'
                    })).unwrap();
                    
                    // Then fetch X posts using the accountId from stats
                    if (statsResult.userId) {
                      await dispatch(fetchXPosts({
                        accountId: statsResult.userId,
                        username: username
                      })).unwrap();
                    }
                    
                    toast.success(`${integration.type} data and posts loaded successfully`);
                  } catch (error: any) {
                    
                    // Provide more specific error messages based on the error
                    if (error.message?.includes('access token not found')) {
                      toast.error(`X integration not set up. Please configure your X integration first.`);
                    } else if (error.message?.includes('Unauthorized')) {
                      toast.error(`X integration token expired. Please refresh your X integration.`);
                    } else {
                      toast.error(`Failed to load ${integration.type} data: ${error.message || 'Unknown error'}`);
                    }
                    
                    // Continue with other integrations even if X fails
                  }
                } else {
                  console.log(`ℹ️ AppContext: Auto-fetch not implemented for platform: ${integration.type}`);
                }
              } catch (error) {
                console.warn(`⚠️ AppContext: Auto-fetch failed for ${integration.type}:`, error);
              }
            };

            // Find all CONNECTED integrations and auto-fetch their data
            const connectedIntegrations = integrations.filter((integration: any) => 
              integration.status === 'CONNECTED' && 
              (integration.type === 'LINKEDIN' || integration.type === 'FACEBOOK' || integration.type === 'INSTAGRAM' || integration.type === 'X')
            );

            console.log(`🔍 Found ${connectedIntegrations.length} connected integrations:`, connectedIntegrations.map(i => ({ type: i.type, status: i.status })));

            // Auto-fetch data for all CONNECTED integrations in parallel
            if (connectedIntegrations.length > 0) {
              // Use Promise.allSettled to handle multiple integrations without failing if one fails
              const autoFetchPromises = connectedIntegrations.map(autoFetchDataForIntegration);
              await Promise.allSettled(autoFetchPromises);
            }
            
          } catch (error) {
            // Error fetching integrations
          }
          
        } else {
          // Company data is null, this might indicate an API issue
        }
        
        // Only set user if we got valid data
        if (userData) {
          setUserLocal(userData);
          // Also update Redux store
          dispatch(setSelectedUser(userData));
        } else {
          // User data is null, this might indicate an API issue
        }
        
      } catch (error) {
        // Error fetching initial data
      }
    };

    fetchData();
  }, [dispatch]);



  return (
    <AppContext.Provider value={{ company, user, setCompany: setCompanyLocal, setUser: setUserLocal }}>
      {children}
    </AppContext.Provider>
  );
};
