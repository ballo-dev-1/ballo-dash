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
import { setCompany } from "@/toolkit/Company/reducer";
import { setSelectedUser } from "@/toolkit/User/reducer";
import { AppDispatch } from "@/toolkit";


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

  console.log('🔍 AppContext: Component is mounting...');
  console.log('🔍 AppContext: Dispatch function:', !!dispatch);

  useEffect(() => {
    console.log('🔍 AppContext: useEffect triggered');
    console.log('🔍 AppContext: This is a test - if you see this, useEffect is working');
    
    if (!dispatch) {
      console.error('❌ AppContext: Dispatch is not available');
      return;
    }
    
    const fetchData = async () => {
      console.log('🔍 AppContext: fetchData function started');
      try {
        console.log('🚀 AppContext: Starting initial data fetch...');
        
        // Use the centralized services
        const [companyData, userData] = await Promise.all([
          companyService.getCompany(),
          userService.getUser(),
        ]);

        console.log('🔍 AppContext: Services returned:', { companyData: !!companyData, userData: !!userData });

        // Only set company if we got valid data
        if (companyData) {
          setCompanyLocal(companyData);
          // Also update Redux store
          dispatch(setCompany(companyData));
          console.log('✅ AppContext: Company data loaded, triggering social media data fetch...');
          
          // 🆕 Fetch LinkedIn and Facebook data if integrations exist
          try {
            console.log('🔍 AppContext: Fetching integrations...');
            const integrations = await integrationsService.getIntegrations();
            console.log('🔍 AppContext: Integrations fetched:', integrations?.length || 0);
            
            // Add detailed logging for integrations
            console.log('🔍 AppContext: All integrations details:', integrations?.map((integration: any) => ({
              type: integration.type,
              status: integration.status,
              hasAccessToken: !!integration.accessToken
            })));
            
            // Find LinkedIn integration
            const linkedinIntegration = integrations.find((integration: any) => 
              integration.type === 'LINKEDIN' && integration.status === 'CONNECTED'
            );
            
            console.log('🔍 AppContext: LinkedIn integration search result:', linkedinIntegration ? {
              type: linkedinIntegration.type,
              status: linkedinIntegration.status,
              hasAccessToken: !!linkedinIntegration.accessToken
            } : 'Not found');
            
            if (linkedinIntegration) {
              console.log('🔗 AppContext: LinkedIn integration found, fetching metrics...');
              try {
                // For now, we'll use a default organization ID since we don't have social profiles set up yet
                // TODO: Get this from social profiles when they're properly configured
                const defaultLinkedInOrgId = '90362182'; // This should come from your database
                
                // Dispatch Redux action to fetch LinkedIn stats
                await dispatch(fetchLinkedInStats({
                  organizationId: defaultLinkedInOrgId,
                  platform: 'linkedin',
                  since: '',
                  until: '',
                  datePreset: 'last_30_days'
                })).unwrap();
                
                console.log('✅ AppContext: LinkedIn data fetched successfully via Redux');
              } catch (error) {
                console.warn('⚠️ AppContext: LinkedIn data fetch failed:', error);
              }
            } else {
              console.log('ℹ️ AppContext: No active LinkedIn integration found');
              console.log('🔍 AppContext: Looking for integrations with type "LINKEDIN" and status "CONNECTED"');
              console.log('🔍 AppContext: Available LinkedIn integrations:', integrations?.filter((i: any) => i.type === 'LINKEDIN').map((i: any) => ({
                type: i.type,
                status: i.status,
                hasAccessToken: !!i.accessToken
              })));
            }
            
            // Find Facebook integration
            const facebookIntegration = integrations.find((integration: any) => 
              integration.type === 'FACEBOOK' && integration.status === 'CONNECTED'
            );
            
            console.log('🔍 AppContext: Facebook integration search result:', facebookIntegration ? {
              type: facebookIntegration.type,
              status: facebookIntegration.status,
              hasAccessToken: !!facebookIntegration.accessToken
            } : 'Not found');
            
            if (facebookIntegration) {
              console.log('📘 AppContext: Facebook integration found, fetching page info...');
              try {
                // For now, we'll use a default page ID since we don't have social profiles set up yet
                // TODO: Get this from social profiles when they're properly configured
                const defaultFacebookPageId = 'me'; // This should come from your database
                
                // Dispatch Redux action to fetch Facebook stats
                await dispatch(fetchMetaStats({
                  pageId: defaultFacebookPageId,
                  platform: 'facebook',
                  since: '',
                  until: '',
                  datePreset: 'last_30_days'
                })).unwrap();
                
                console.log('✅ AppContext: Facebook data fetched successfully via Redux');
              } catch (error) {
                console.warn('⚠️ AppContext: Facebook data fetch failed:', error);
              }
            } else {
              console.log('ℹ️ AppContext: No active Facebook integration found');
              console.log('🔍 AppContext: Looking for integrations with type "FACEBOOK" and status "CONNECTED"');
              console.log('🔍 AppContext: Available Facebook integrations:', integrations?.filter((i: any) => i.type === 'FACEBOOK').map((i: any) => ({
                type: i.type,
                status: i.status,
                hasAccessToken: !!i.accessToken
              })));
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

  console.log('🔍 AppContext: About to render children, company:', !!company, 'user:', !!user);

  return (
    <AppContext.Provider value={{ company, user, setCompany: setCompanyLocal, setUser: setUserLocal }}>
      {children}
    </AppContext.Provider>
  );
};
