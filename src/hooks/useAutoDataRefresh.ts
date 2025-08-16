// src/hooks/useAutoDataRefresh.ts
import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/toolkit';
import { fetchLinkedInStats } from '@/toolkit/linkedInData/reducer';
import { fetchMetaStats } from '@/toolkit/metaData/reducer';
import { useSelector } from 'react-redux';
import { selectIntegrations } from '@/toolkit/Integrations/reducer';

export const useAutoDataRefresh = () => {
  const dispatch = useDispatch<AppDispatch>();
  const integrations = useSelector(selectIntegrations);

  const refreshDataForIntegration = useCallback(async (integration: any) => {
    try {
      console.log(`🔄 useAutoDataRefresh: Refreshing data for ${integration.type} integration...`);
      
      if (integration.type === 'LINKEDIN') {
        // For now, we'll use a default organization ID since we don't have social profiles set up yet
        // TODO: Get this from social profiles when they're properly configured
        const defaultLinkedInOrgId = '90362182'; // This should come from your database
        
        await dispatch(fetchLinkedInStats({
          organizationId: defaultLinkedInOrgId,
          platform: 'linkedin',
          since: '',
          until: '',
          datePreset: 'last_30_days'
        })).unwrap();
        
        console.log('✅ useAutoDataRefresh: LinkedIn data refreshed successfully');
      } else if (integration.type === 'FACEBOOK' || integration.type === 'INSTAGRAM') {
        // For now, we'll use a default page ID since we don't have social profiles set up yet
        // TODO: Get this from social profiles when they're properly configured
        const defaultPageId = 'me'; // This should come from your database
        
        await dispatch(fetchMetaStats({
          pageId: defaultPageId,
          platform: integration.type.toLowerCase(),
          since: '',
          until: '',
          datePreset: 'last_30_days'
        })).unwrap();
        
        console.log(`✅ useAutoDataRefresh: ${integration.type} data refreshed successfully`);
      } else {
        console.log(`ℹ️ useAutoDataRefresh: Auto-refresh not implemented for platform: ${integration.type}`);
      }
    } catch (error) {
      console.warn(`⚠️ useAutoDataRefresh: Refresh failed for ${integration.type}:`, error);
    }
  }, [dispatch]);

  const refreshAllConnectedIntegrations = useCallback(async () => {
    if (!integrations || integrations.length === 0) {
      console.log('ℹ️ useAutoDataRefresh: No integrations available');
      return;
    }

    // Find all CONNECTED integrations
    const connectedIntegrations = integrations.filter((integration: any) => 
      integration.status === 'CONNECTED' && 
      (integration.type === 'LINKEDIN' || integration.type === 'FACEBOOK' || integration.type === 'INSTAGRAM')
    );

    if (connectedIntegrations.length === 0) {
      console.log('ℹ️ useAutoDataRefresh: No CONNECTED integrations found');
      return;
    }

    console.log(`🚀 useAutoDataRefresh: Refreshing data for ${connectedIntegrations.length} CONNECTED integrations...`);
    
    // Refresh data for all CONNECTED integrations in parallel
    const refreshPromises = connectedIntegrations.map(refreshDataForIntegration);
    const results = await Promise.allSettled(refreshPromises);
    
    // Log results
    results.forEach((result, index) => {
      const integration = connectedIntegrations[index];
      if (result.status === 'fulfilled') {
        console.log(`✅ useAutoDataRefresh: Refresh completed for ${integration.type}`);
      } else {
        console.warn(`⚠️ useAutoDataRefresh: Refresh failed for ${integration.type}:`, result.reason);
      }
    });
    
    console.log('🎯 useAutoDataRefresh: Refresh for all CONNECTED integrations completed');
  }, [integrations, refreshDataForIntegration]);

  // Auto-refresh when component mounts and integrations are available
  useEffect(() => {
    if (integrations && integrations.length > 0) {
      console.log('🔄 useAutoDataRefresh: Component mounted, checking for CONNECTED integrations...');
      refreshAllConnectedIntegrations();
    }
  }, [integrations, refreshAllConnectedIntegrations]);

  return {
    refreshDataForIntegration,
    refreshAllConnectedIntegrations,
    integrations
  };
};
