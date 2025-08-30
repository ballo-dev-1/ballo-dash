// contexts/AppContext.tsx
import React, { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { Company, User } from "@/types";
import { companyService } from "@/services/companyService";
import { userService } from "@/services/userService";
import { integrationsService } from "@/services/integrationsService";
import { linkedinService } from "@/services/linkedinService";
import { metaService } from "@/services/metaService";
import { fetchLinkedInStats } from "@/toolkit/linkedInData/reducer";
import { fetchMetaStats } from "@/toolkit/metaData/reducer";
import { fetchXStats } from "@/toolkit/xData/reducer";
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
  console.log("🚀 AppProvider: Component is starting to render");
  
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

        console.log('AppContext: Services returned:', { companyData: !!companyData, userData: !!userData });

        // Only set company if we got valid data
        if (companyData) {
          setCompanyLocal(companyData);
          // Also update Redux store
          dispatch(setCompany(companyData));
          console.log('✅ AppContext: Company data loaded, triggering social media data fetch...');
          
          // 🆕 Fetch LinkedIn and Facebook data if integrations exist
          try {
            console.log('AppContext: Fetching integrations...');
            const integrations = await integrationsService.getIntegrations();
            console.log('AppContext: Integrations fetched:', integrations?.length || 0);
            

            
            // Add detailed logging for integrations
            console.log('AppContext: All integrations details:', integrations?.map((integration: any) => ({
              type: integration.type,
              status: integration.status,
              hasAccessToken: !!integration.accessToken
            })));
            
            // Auto-fetch data for all CONNECTED integrations
            const autoFetchDataForIntegration = async (integration: any) => {
              try {
                console.log(`AppContext: Auto-fetching data for ${integration.type} integration...`);
                
                if (integration.type === 'LINKEDIN') {
                  // For now, we'll use a default organization ID since we don't have social profiles set up yet
                  // TODO: Get this from social profiles when they're properly configured
                  const defaultLinkedInOrgId = '90362182'; // This should come from your database
                  
                  try {
                    await dispatch(fetchLinkedInStats({
                      organizationId: defaultLinkedInOrgId,
                      platform: 'linkedin',
                      since: '',
                      until: '',
                      datePreset: 'last_30_days'
                    })).unwrap();
                    
                    console.log('✅ AppContext: LinkedIn data auto-fetched successfully');
                    toast.success('✅ LinkedIn data loaded successfully');
                  } catch (error: any) {
                    console.warn(`⚠️ AppContext: LinkedIn API call failed:`, error);
                    
                    // Provide more specific error messages based on the error
                    if (error.message?.includes('access token not found')) {
                      toast.error(`LinkedIn integration not set up. Please configure your LinkedIn integration first.`);
                    } else if (error.message?.includes('Unauthorized')) {
                      toast.error(`LinkedIn integration token expired. Please refresh your LinkedIn integration.`);
                    } else {
                      toast.error(`Failed to load LinkedIn data: ${error.message || 'Unknown error'}`);
                    }
                  }
                } else if (integration.type === 'FACEBOOK' || integration.type === 'INSTAGRAM') {
                  // For now, we'll use a default page ID since we don't have social profiles set up yet
                  // TODO: Get this from social profiles when they're properly configured
                  const defaultPageId = 'me'; // This should come from your database
                  
                  try {
                    await dispatch(fetchMetaStats({
                      pageId: defaultPageId,
                      platform: integration.type.toLowerCase(),
                      since: '',
                      until: '',
                      datePreset: 'last_30_days'
                    })).unwrap();
                    
                    console.log(`✅ AppContext: ${integration.type} data auto-fetched successfully`);
                    toast.success(`✅ ${integration.type} data loaded successfully`);
                  } catch (error: any) {
                    console.warn(`⚠️ AppContext: ${integration.type} API call failed:`, error);
                    
                    // Provide more specific error messages based on the error
                    if (error.message?.includes('access token not found')) {
                      toast.error(`${integration.type} integration not set up. Please configure your ${integration.type} integration first.`);
                    } else if (error.message?.includes('Unauthorized')) {
                      toast.error(`${integration.type} integration token expired. Please refresh your ${integration.type} integration.`);
                    } else {
                      toast.error(`Failed to load ${integration.type} data: ${error.message || 'Unknown error'}`);
                    }
                  }
                } else if (integration.type === 'X') {
                  // For X, we'll use the handle from the integration if available, or a default
                  // TODO: Get this from social profiles when they're properly configured
                  const username = integration.handle || 'GeorgeMsapenda'; // Default username, should come from integration handle
                  
                  try {
                    await dispatch(fetchXStats({
                      username,
                      platform: integration.type.toLowerCase(),
                      since: '',
                      until: '',
                      datePreset: 'last_30_days'
                    })).unwrap();
                    
                    console.log(`✅ AppContext: ${integration.type} data auto-fetched successfully`);
                    toast.success(`✅ ${integration.type} data loaded successfully`);
                  } catch (error: any) {
                    console.warn(`⚠️ AppContext: X API call failed for ${username}:`, error);
                    
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

            console.log('AppContext: Found CONNECTED integrations:', connectedIntegrations.map(i => ({
              type: i.type,
              status: i.status,
              hasAccessToken: !!i.accessToken
            })));

            // Auto-fetch data for all CONNECTED integrations in parallel
            if (connectedIntegrations.length > 0) {
              console.log('🚀 AppContext: Starting auto-fetch for all CONNECTED integrations...');
              
              // Use Promise.allSettled to handle multiple integrations without failing if one fails
              const autoFetchPromises = connectedIntegrations.map(autoFetchDataForIntegration);
              const results = await Promise.allSettled(autoFetchPromises);
              
              // Log results
              results.forEach((result, index) => {
                const integration = connectedIntegrations[index];
                if (result.status === 'fulfilled') {
                  console.log(`✅ AppContext: Auto-fetch completed for ${integration.type}`);
                } else {
                  console.warn(`⚠️ AppContext: Auto-fetch failed for ${integration.type}:`, result.reason);
                }
              });
              
              console.log('🎯 AppContext: Auto-fetch for all CONNECTED integrations completed');
            } else {
              console.log('ℹ️ AppContext: No CONNECTED integrations found for auto-fetch');
            }
            
          } catch (error) {
            console.warn('⚠️ AppContext: Error fetching integrations:', error);
          }
          
        } else {
          console.warn('⚠️ Company data is null, this might indicate an API issue');
        }
        
        // Only set user if we got valid data
        if (userData) {
          setUserLocal(userData);
          // Also update Redux store
          dispatch(setSelectedUser(userData));
          console.log('✅ AppContext: User data loaded');
        } else {
          console.warn('⚠️ User data is null, this might indicate an API issue');
        }
        
        console.log('🎉 AppContext: Initial data fetch completed');
      } catch (error) {
        console.error('❌ AppContext: Error fetching initial data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  console.log('AppContext: About to render children, company:', !!company, 'user:', !!user);

  return (
    <AppContext.Provider value={{ company, user, setCompany: setCompanyLocal, setUser: setUserLocal }}>
      {children}
    </AppContext.Provider>
  );
};
