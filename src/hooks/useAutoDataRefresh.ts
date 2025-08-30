// src/hooks/useAutoDataRefresh.ts
import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/toolkit';
import { fetchLinkedInStats } from '@/toolkit/linkedInData/reducer';
import { fetchMetaStats } from '@/toolkit/metaData/reducer';
import { fetchXStats } from '@/toolkit/xData/reducer';
import { useSelector } from 'react-redux';
import { selectIntegrations } from '@/toolkit/Integrations/reducer';
import { useIntegrations } from './useIntegrations';

export const useAutoDataRefresh = () => {
  const dispatch = useDispatch<AppDispatch>();
  const integrations = useSelector(selectIntegrations);
  const { isInitialized } = useIntegrations();
  const hasRefreshed = useRef(false); // Prevent multiple refreshes
  const refreshCount = useRef(0); // Track refresh attempts
  
    const refreshDataForIntegration = useCallback(async (integration: any) => {
    try {
      refreshCount.current++;
      
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
        
      } else if (integration.type === 'X') {
        // For X, we'll use the handle from the integration if available, or a default
        const username = integration.handle || 'GeorgeMsapenda'; // Default username, should come from integration handle
        
        try {
          await dispatch(fetchXStats({
            username,
            platform: integration.type.toLowerCase(),
            since: '',
            until: '',
            datePreset: 'last_30_days'
          })).unwrap();
          
        } catch (error) {
          // Continue with other integrations even if X fails
        }
      }
    } catch (error) {
      // Failed to refresh data
    }
  }, [dispatch]);

  const refreshAllConnectedIntegrations = useCallback(async () => {
    if (!integrations || integrations.length === 0) {
      return;
    }

    // Find all CONNECTED integrations
    const connectedIntegrations = integrations.filter((integration: any) => 
      integration.status === 'CONNECTED' && 
      (integration.type === 'LINKEDIN' || integration.type === 'FACEBOOK' || integration.type === 'INSTAGRAM' || integration.type === 'X')
    );

    if (connectedIntegrations.length === 0) {
      return;
    }
    
    // Refresh data for all CONNECTED integrations in parallel
    const refreshPromises = connectedIntegrations.map(refreshDataForIntegration);
    await Promise.allSettled(refreshPromises);
  }, [integrations, refreshDataForIntegration]);

  // Auto-refresh when component mounts and integrations are available AND initialized
  useEffect(() => {
    // Prevent multiple refreshes
    if (hasRefreshed.current) {
      return;
    }

    // Wait for integrations to be properly initialized and available
    if (integrations && integrations.length > 0 && isInitialized) {
      hasRefreshed.current = true;
      refreshAllConnectedIntegrations();
    }
  }, [integrations, isInitialized, refreshAllConnectedIntegrations]);

  // Reset refresh flag when integrations change significantly
  useEffect(() => {
    hasRefreshed.current = false;
  }, [integrations?.length]);

  return {
    refreshDataForIntegration,
    refreshAllConnectedIntegrations,
    integrations
  };
};
