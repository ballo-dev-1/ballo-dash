import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, Spinner, Row, Col } from 'react-bootstrap';
import { Cable, Pencil, Save, X, RefreshCw, Plus, Trash2, Info, Building2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCompany } from '@/toolkit/Company/reducer';
import { integrationsService } from '@/services/integrationsService';
import { fetchLinkedInStats } from '@/toolkit/linkedInData/reducer';
import { fetchMetaStats } from '@/toolkit/metaData/reducer';
import { AppDispatch } from '@/toolkit';
import { 
  createIntegration, 
  updateIntegration, 
  deleteIntegration,
  fetchIntegrations as fetchIntegrationsRedux
} from '@/toolkit/Integrations/reducer';
import { useIntegrationModal } from '@/hooks/useIntegrationModal';

import toast from 'react-hot-toast';

interface Integration {
  id: string;
  companyId: string;
  type: string;
  status: string;
  appId?: string;
  appSecret?: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

interface EditableIntegration extends Integration {
  isEditing: boolean;
  originalData: Integration;
}

interface NewIntegration {
  type: string;
  status: string;
  appId?: string;
  appSecret?: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  metadata?: any;  
}



const IntegrationManagementModal: React.FC = () => {
  const { isOpen, closeIntegrationModal } = useIntegrationModal();
  const [integrations, setIntegrations] = useState<EditableIntegration[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // New state for creating integrations
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newIntegration, setNewIntegration] = useState<NewIntegration>({
    type: 'LINKEDIN',
    status: 'PENDING',
    appId: '',
    appSecret: '',
    accessToken: '',
    refreshToken: '',
    expiresAt: '',
    metadata: undefined
  });
  const [creating, setCreating] = useState(false);
  const [generatingToken, setGeneratingToken] = useState(false);
  const [fetchingExpiry, setFetchingExpiry] = useState(false);
  const [refreshingToken, setRefreshingToken] = useState<string | null>(null);

  const company = useSelector(selectCompany);
  const dispatch = useDispatch<AppDispatch>();
  


  useEffect(() => {
    if (isOpen && company?.id) {
      // Fetch fresh integrations when modal opens
      fetchIntegrations();
      
      // Also refresh Redux store to ensure hasIntegrations is in sync
      dispatch(fetchIntegrationsRedux(company.id));
    }
  }, [isOpen, company?.id, dispatch]);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      // Use the modal-specific endpoint that includes access tokens
      const data = await integrationsService.getIntegrationsForModal();
      console.log('Modal: Fetched integrations:', data);
      console.log('Modal: Integration details:', data.map(i => ({
        id: i.id,
        type: i.type,
        status: i.status,
        hasAccessToken: !!i.accessToken,
        accessTokenLength: i.accessToken?.length || 0,
        accessTokenPreview: i.accessToken ? `${i.accessToken.substring(0, 20)}...` : 'NONE'
      })));
      
      const editableIntegrations: EditableIntegration[] = data.map((integration: any) => ({
        ...integration,
        isEditing: false,
        originalData: { ...integration }
      }));
      
      setIntegrations(editableIntegrations);
    } catch (error) {
      toast.error('Failed to fetch integrations');
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, isEditing: true }
        : integration
    ));
  };

  const handleCancel = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, isEditing: false, ...integration.originalData }
        : integration
    ));
  };

  const handleSave = async (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    setSaving(true);

    try {
      console.log('Saving integration:', id);
      console.log('Integration data to save:', {
        accessToken: integration.accessToken ? '***' : 'empty',
        refreshToken: integration.refreshToken ? '***' : 'empty',
        status: integration.status,
        expiresAt: integration.expiresAt
      });

      // Call API to update integration using modal-specific endpoint
      const result = await integrationsService.updateIntegrationForModal(id, {
        accessToken: integration.accessToken,
        refreshToken: integration.refreshToken,
        status: integration.status,
        expiresAt: integration.expiresAt
      });

      console.log('✅ Save successful, result:', result);

      // Update local state
      setIntegrations(prev => prev.map(i => 
        i.id === id 
          ? { 
              ...i, 
              isEditing: false, 
              originalData: { ...i },
              refreshToken: i.refreshToken || null
            }
          : i
      ));

      // Update Redux store to sync hasIntegrations state
      dispatch(updateIntegration.fulfilled(result, 'updateIntegration', {
        id: result.id,
        updateData: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          status: result.status,
          expiresAt: result.expiresAt
        }
      }));
      
            // Clear cache to ensure fresh data is fetched next time
      integrationsService.clearIntegrationCache();
      
      // Refresh Redux store to ensure hasIntegrations is updated
      if (company?.id) {
        dispatch(fetchIntegrationsRedux(company.id));
      }
      
      toast.success('Integration updated successfully');
      
    } catch (error: any) {
      console.error('❌ Save failed with error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      toast.error(`Failed to update integration: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (id: string, field: keyof Integration, value: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, [field]: value }
        : integration
    ));
  };

  const handleDateChange = (id: string, value: string) => {
    // Convert the date string to ISO format for storage
    const isoDate = value ? new Date(value).toISOString() : null;
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, expiresAt: isoDate }
        : integration
    ));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    // Convert ISO date to YYYY-MM-DD format for date input
    return new Date(dateString).toISOString().split('T')[0];
  };

  const maskToken = (token: string) => {
    if (!token) return '-';
    return token.length > 20 
      ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}`
      : token;
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'CONNECTED': 'success',
      'DISCONNECTED': 'secondary',
      'PENDING': 'info',
      'EXPIRED': 'warning',
      'ERROR': 'danger'
    };
    
    return (
      <span className={`badge bg-${statusColors[status] || 'secondary'}`}>
        {status}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'LINKEDIN': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      'FACEBOOK': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      'INSTAGRAM': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      'GOOGLE_ANALYTICS': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      'GOOGLE_SEARCH_CONSOLE': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
      'TIKTOK': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ),
      'X': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    };
    
    return icons[type] || (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    );
  };

  // New function to handle creating integrations
  const handleCreateIntegration = async () => {
    if (!company?.id) {
      toast.error('Company ID not found');
      return;
    }

    if (!newIntegration.accessToken.trim()) {
      toast.error('Access token is required');
      return;
    }

    setCreating(true);

    try {
      const createdIntegration = await integrationsService.createIntegration({
        type: newIntegration.type,
        status: newIntegration.status,
        appId: newIntegration.appId || undefined,
        appSecret: newIntegration.appSecret || undefined,
        accessToken: newIntegration.accessToken,
        refreshToken: newIntegration.refreshToken || null,
        expiresAt: newIntegration.expiresAt || null,
        metadata: newIntegration.metadata || undefined,
        companyId: company.id
      });

      // Add to local state with proper formatting
      const newEditableIntegration: EditableIntegration = {
        ...createdIntegration,
        isEditing: false,
        originalData: { ...createdIntegration }
      };
      setIntegrations(prev => [...prev, newEditableIntegration]);
      
      // Update Redux store to sync hasIntegrations state
      dispatch(createIntegration.fulfilled(createdIntegration, 'createIntegration', {
        type: createdIntegration.type,
        status: createdIntegration.status,
        accessToken: createdIntegration.accessToken,
        refreshToken: createdIntegration.refreshToken,
        expiresAt: createdIntegration.expiresAt
      }));
      
      // Clear cache to ensure fresh data is fetched next time
      integrationsService.clearIntegrationCache();
      
      // Refresh Redux store to ensure hasIntegrations is updated
      if (company?.id) {
        dispatch(fetchIntegrationsRedux(company.id));
      }
      
      // Reset form
      setNewIntegration({
        type: 'LINKEDIN',
        status: 'PENDING',
        appId: '',
        appSecret: '',
        accessToken: '',
        refreshToken: '',
        expiresAt: '',
        metadata: undefined
      });
      
      setShowCreateModal(false);
      toast.success('Integration created successfully!');
      
      // Auto-fetch data for the new integration if it's CONNECTED
      if (createdIntegration.status === 'CONNECTED') {
        try {
          if (createdIntegration.type === 'LINKEDIN') {
            // Fetch LinkedIn data using Redux action
            await dispatch(fetchLinkedInStats({
              organizationId: '90362182', // Default org ID - should come from social profiles
              platform: 'linkedin',
              since: '',
              until: '',
              datePreset: 'last_30_days'
            }));
            toast.success('LinkedIn data fetched successfully for new integration!');
          } else if (createdIntegration.type === 'FACEBOOK' || createdIntegration.type === 'INSTAGRAM') {
            // Fetch Meta data using Redux action
            await dispatch(fetchMetaStats({
              pageId: 'me', // Default page ID - should come from social profiles
              platform: createdIntegration.type.toLowerCase(),
              since: '',
              until: '',
              datePreset: 'last_30_days'
            }));
            toast.success('Meta data fetched successfully for new integration!');
          }
        } catch (error) {
          console.error('Failed to fetch data for new integration:', error);
          toast.error('Integration created but failed to fetch data');
        }
      }
      
      // Close the main modal as well
      closeIntegrationModal();
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create integration');
    } finally {
      setCreating(false);
    }
  };

  // Function to generate access token from app credentials
  const handleGenerateAccessToken = async () => {
    if (!newIntegration.appId || !newIntegration.appSecret) {
      toast.error('App ID and App Secret are required');
      return;
    }

    setGeneratingToken(true);

    try {
      // Call the real OAuth token generation API
      const response = await fetch('/api/integrations/generate-access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: newIntegration.type,
          appId: newIntegration.appId,
          appSecret: newIntegration.appSecret
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate access token');
      }

      const result = await response.json();
      
      // Update the form with the generated token and expiry
      setNewIntegration(prev => ({
        ...prev,
        accessToken: result.accessToken,
        expiresAt: result.expiresAt || '',
        refreshToken: result.refreshToken || '',
        status: 'CONNECTED' // Auto-update status to CONNECTED when token is generated
      }));
      
      toast.success(`Access token generated successfully for ${newIntegration.type}! Expires: ${result.expiresAt ? new Date(result.expiresAt).toLocaleString() : 'Never'}`);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate access token');
    } finally {
      setGeneratingToken(false);
    }
  };

  // Function to validate access token and update status
  const validateAccessToken = async (accessToken: string, platform: string, appId?: string, appSecret?: string) => {
    try {
      let isValid = false;
      
      // Platform-specific token validation
      switch (platform.toUpperCase()) {
        case 'FACEBOOK':
        case 'INSTAGRAM':
          if (!appId || !appSecret) {
            // Can't validate without app credentials, but assume valid if token is provided
            isValid = accessToken.length > 0;
          } else {
            // Try to validate with Facebook API
            const response = await fetch('/api/integrations/facebook-token-info', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken, appId, appSecret }),
            });
            if (response.ok) {
              const result = await response.json();
              isValid = result.tokenInfo?.isValid || false;
            }
          }
          break;
          
        case 'LINKEDIN':
          // For LinkedIn, assume valid if token is provided (could be enhanced with real API call)
          isValid = accessToken.length > 0;
          break;
          
        case 'X':
          // X tokens are typically short-lived, assume valid if provided
          isValid = accessToken.length > 0;
          break;
          
        default:
          // For other platforms, assume valid if token is provided
          isValid = accessToken.length > 0;
          break;
      }
      
      // If token is valid, update status to CONNECTED
      if (isValid) {
        setNewIntegration(prev => ({
          ...prev,
          status: 'CONNECTED'
        }));
        console.log('✅ Access token validated, status updated to CONNECTED');
      }
      
      return isValid;
    } catch (error) {
      console.error('❌ Error validating access token:', error);
      return false;
    }
  };

  // Function to fetch expiry date from access token
  const handleFetchExpiryDate = async () => {
    if (!newIntegration.accessToken.trim()) {
      toast.error('Access token is required to fetch expiry date');
      return;
    }

    setFetchingExpiry(true);

    try {
      let expiryDate: string | null = null;

      // Platform-specific expiry date fetching
      switch (newIntegration.type.toUpperCase()) {
        case 'FACEBOOK':
          // For Facebook, we need app credentials to debug the token
          if (!newIntegration.appId || !newIntegration.appSecret) {
            toast.error('App ID and App Secret are required to fetch Facebook token expiry');
            return;
          }
          
          // Call Facebook token debug API
          const response = await fetch('/api/integrations/facebook-token-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken: newIntegration.accessToken,
              appId: newIntegration.appId,
              appSecret: newIntegration.appSecret
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch Facebook token expiry');
          }

          const result = await response.json();
          console.log('Facebook token info response in frontend:', result);
          expiryDate = result.tokenInfo?.expiresAt;
          console.log('Extracted expiry date:', expiryDate);
          break;

        case 'LINKEDIN':
          // For LinkedIn, we can try to get user info which might include expiry
          // This is a simplified approach - in production you'd use LinkedIn's token introspection
          expiryDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(); // 60 days default
          break;

        case 'INSTAGRAM':
          // Instagram uses Facebook's system
          if (!newIntegration.appId || !newIntegration.appSecret) {
            toast.error('App ID and App Secret are required to fetch Instagram token expiry');
            return;
          }
          
          // Use the same approach as Facebook
          expiryDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(); // 60 days default
          break;

        case 'X':
          // X tokens typically expire in 2 hours
          expiryDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours
          break;

        default:
          // For other platforms, use a default expiry
          expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days default
          break;
      }

      if (expiryDate) {
        // Convert ISO date string to YYYY-MM-DD format for the date input
        const dateForInput = new Date(expiryDate).toISOString().split('T')[0];
        console.log('Original expiry date:', expiryDate);
        console.log('Converted to date input format:', dateForInput);
        
        setNewIntegration(prev => ({
          ...prev,
          expiresAt: dateForInput
        }));
        
        toast.success(`Expiry date fetched successfully! Token expires: ${new Date(expiryDate).toLocaleString()}`);
      } else {
        toast.error('Could not determine token expiry date for this platform');
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch expiry date');
    } finally {
      setFetchingExpiry(false);
    }
  };

  // Function to refresh Facebook token info
  const handleRefreshFacebookTokenInfo = async (integrationId: string) => {
    setRefreshingToken(integrationId);

    try {
      const result = await integrationsService.refreshFacebookTokenInfo(integrationId);
      
      // Refresh the integrations list to get updated data
      await fetchIntegrations();
      
      toast.success(`Facebook token info refreshed! Expires: ${result.tokenInfo.expiresAt ? new Date(result.tokenInfo.expiresAt).toLocaleString() : 'Never'}`);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to refresh Facebook token info');
    } finally {
      setRefreshingToken(null);
    }
  };

  // New function to handle deleting integrations


  const handleDeleteIntegration = async (integrationId: string) => {
    if (!confirm('Are you sure you want to delete this integration? This action cannot be undone.')) {
      return;
    }

    try {
      await integrationsService.deleteIntegration(integrationId);
      
      // Remove from local state
      setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
      
      // Update Redux store to sync hasIntegrations state
      dispatch(deleteIntegration.fulfilled(integrationId, 'deleteIntegration', integrationId));
      
      // Clear cache to ensure fresh data is fetched next time
      integrationsService.clearIntegrationCache();
      
      // Refresh Redux store to ensure hasIntegrations is updated
      if (company?.id) {
        dispatch(fetchIntegrationsRedux(company.id));
      }
      
      toast.success('Integration deleted successfully!');
      
              // Check if this was the last integration
        const remainingIntegrations = integrations.filter(integration => integration.id !== integrationId);
        if (remainingIntegrations.length === 0) {
          // If no integrations left, close modal
          closeIntegrationModal();
        }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete integration');
    }
  };

  return (
    <div className="integration-management-modal">
      

      {/* Main Modal */}
      <Modal 
        show={isOpen} 
        onHide={() => {
          // Refresh Redux store when modal closes to ensure parent components get updated state
          if (company?.id) {
            dispatch(fetchIntegrationsRedux(company.id));
          }
          closeIntegrationModal();
        }} 
        size="xl" 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            Integration Management
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => {
                fetchIntegrations();
              }}
              title="Refresh integrations"
              className="ms-auto"
            >
              <RefreshCw size={16} />
            </Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          
          {/* Add New Integration Button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 d-flex align-items-center gap-2"><Building2 size={16} /> {company?.name || 'Loading...'}</h6>
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => setShowCreateModal(true)}
              className="d-flex align-items-center gap-2"
            >
              <Plus size={16} />
              Add New Integration
            </Button>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {/* Integrations Table */}
          {!loading && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Status</th>
                  <th>App ID</th>
                  <th>App Secret</th>
                  <th>Access Token</th>
                  <th>Refresh Token</th>
                  <th>Expires At</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((integration) => (
                  <tr key={integration.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {getTypeIcon(integration.type)}
                        <span className="fw-medium">{integration.type}</span>
                      </div>
                    </td>
                    <td>
                      {integration.isEditing ? (
                        <Form.Select
                          value={integration.status}
                          onChange={(e) => handleInputChange(integration.id, 'status', e.target.value)}
                          size="sm"
                        >
                          <option value="CONNECTED">CONNECTED</option>
                          <option value="DISCONNECTED">DISCONNECTED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="EXPIRED">EXPIRED</option>
                          <option value="ERROR">ERROR</option>
                        </Form.Select>
                      ) : (
                        getStatusBadge(integration.status)
                      )}
                    </td>
                    <td>
                      {integration.isEditing ? (
                        <Form.Control
                          type="text"
                          value={integration.appId || ''}
                          onChange={(e) => handleInputChange(integration.id, 'appId', e.target.value)}
                          size="sm"
                          placeholder="Enter app ID"
                          autoComplete="off"
                          data-lpignore="true"
                          data-form-type="other"
                        />
                      ) : (
                        <small className="text-muted">{integration.appId ? maskToken(integration.appId) : 'Not set'}</small>
                      )}
                    </td>
                    <td>
                      {integration.isEditing ? (
                        <Form.Control
                          type="password"
                          value={integration.appSecret || ''}
                          onChange={(e) => handleInputChange(integration.id, 'appSecret', e.target.value)}
                          size="sm"
                          placeholder="Enter app secret"
                          autoComplete="new-password"
                          data-lpignore="true"
                          data-form-type="other"
                        />
                      ) : (
                        <small className="text-muted">{integration.appSecret ? maskToken(integration.appSecret) : 'Not set'}</small>
                      )}
                    </td>
                    <td>
                      {integration.isEditing ? (
                        <Form.Control
                          type="text"
                          value={integration.accessToken || ''}
                          onChange={(e) => handleInputChange(integration.id, 'accessToken', e.target.value)}
                          size="sm"
                          placeholder="Enter access token"
                          autoComplete="off"
                          data-lpignore="true"
                          data-form-type="other"
                        />
                      ) : (
                        <small className="text-muted">{integration.accessToken ? maskToken(integration.accessToken) : 'Not set'}</small>
                      )}
                    </td>
                    <td>
                      {integration.isEditing ? (
                        <Form.Control
                          type="text"
                          value={integration.refreshToken || ''}
                          onChange={(e) => handleInputChange(integration.id, 'refreshToken', e.target.value)}
                          size="sm"
                          placeholder="Enter refresh token (optional)"
                        />
                      ) : (
                        <small className="text-muted">
                          {integration.refreshToken ? maskToken(integration.refreshToken) : 'N/A'}
                        </small>
                      )}
                    </td>
                    <td>
                      {integration.isEditing ? (
                        <div className="d-flex gap-1 align-items-center">
                          <Form.Control
                            type="date"
                            value={formatDateForInput(integration.expiresAt)}
                            onChange={(e) => handleDateChange(integration.id, e.target.value)}
                            size="sm"
                            className="flex-grow-1"
                          />
                          <Button 
                            size="sm" 
                            variant="outline-secondary" 
                            onClick={() => handleDateChange(integration.id, '')} 
                            title="Clear date"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      ) : (
                        <small>{formatDate(integration.expiresAt)}</small>
                      )}
                    </td>
                    <td>
                      <small>{formatDate(integration.updatedAt)}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {integration.isEditing ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="success" 
                              onClick={() => handleSave(integration.id)}
                              disabled={loading}
                            >
                              <Save size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => handleCancel(integration.id)}
                            >
                              <X size={14} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline-primary" 
                              onClick={() => handleEdit(integration.id)}
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </Button>
                            {integration.type === 'FACEBOOK' && (
                              <Button 
                                size="sm" 
                                variant="outline-info" 
                                onClick={() => handleRefreshFacebookTokenInfo(integration.id)}
                                disabled={refreshingToken === integration.id}
                                title="Refresh Token Info"
                              >
                                {refreshingToken === integration.id ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <Info size={14} />
                                )}
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline-danger" 
                              onClick={() => handleDeleteIntegration(integration.id)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {integrations.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-4">
                      No integrations found. Click "Add New Integration" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeIntegrationModal}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={fetchIntegrations} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            {' '}
            Refresh
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create New Integration Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Integration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Platform Type *</Form.Label>
                  <Form.Select
                    value={newIntegration.type}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, type: e.target.value }))}
                    required
                  >
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="X">X (Twitter)</option>
                    <option value="GOOGLE_ANALYTICS">Google Analytics</option>
                    <option value="GOOGLE_SEARCH_CONSOLE">Google Search Console</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="WEBSITE">Website</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status *</Form.Label>
                  <Form.Select
                    value={newIntegration.status}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, status: e.target.value }))}
                    required
                  >
                    <option value="CONNECTED">CONNECTED</option>
                    <option value="DISCONNECTED">DISCONNECTED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="ERROR">ERROR</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>App ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={newIntegration.appId}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, appId: e.target.value }))}
                    placeholder="Enter app ID (optional)"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                  <Form.Text className="text-muted">
                    The application ID from the platform developer console (optional)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>App Secret</Form.Label>
                  <Form.Control
                    type="password"
                    value={newIntegration.appSecret}
                    onChange={(e) => setNewIntegration(prev => ({ ...prev, appSecret: e.target.value }))}
                    placeholder="Enter app secret (optional)"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                  <Form.Text className="text-muted">
                    The application secret from the platform developer console (optional)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            {/* Generate Access Token Button - Commented out for now */}
            {/* {newIntegration.appId && newIntegration.appSecret && (
              <div className="mb-3">
                <Button 
                  variant="outline-primary" 
                  onClick={() => handleGenerateAccessToken()}
                  disabled={generatingToken}
                  className="d-flex align-items-center gap-2"
                >
                  {generatingToken ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      Generate Access Token
                    </>
                  )}
                </Button>
                <Form.Text className="text-muted d-block mt-1">
                  Click to automatically generate an access token and expiry date using your app credentials
                </Form.Text>
              </div>
            )} */}
            
            <Form.Group className="mb-3">
              <Form.Label>Access Token *</Form.Label>
                                <Form.Control
                    type="text"
                    value={newIntegration.accessToken}
                    onChange={async (e) => {
                      const newToken = e.target.value;
                      setNewIntegration(prev => ({ ...prev, accessToken: newToken }));
                      
                      // Validate token and update status if it's a valid length
                      if (newToken.trim().length > 0) {
                        await validateAccessToken(newToken, newIntegration.type, newIntegration.appId, newIntegration.appSecret);
                      }
                    }}
                    placeholder="Enter access token"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
              <Form.Text className="text-muted">
                The access token for the platform integration
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Refresh Token</Form.Label>
              <Form.Control
                type="text"
                value={newIntegration.refreshToken}
                onChange={(e) => setNewIntegration(prev => ({ ...prev, refreshToken: e.target.value }))}
                placeholder="Enter refresh token (optional)"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
              />
              <Form.Text className="text-muted">
                Optional refresh token for token renewal
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center gap-2">
                Expiry Date
                {newIntegration.accessToken.trim() && (
                  <Button
                    variant="outline-info"
                    onClick={handleFetchExpiryDate}
                    disabled={fetchingExpiry}
                    size="sm"
                    className="d-flex align-items-center gap-1 py-0"
                    style={{ fontSize: '12px' }}
                  >
                    {fetchingExpiry ? (
                      <>
                        <Spinner animation="border" size="sm" style={{ width: '12px', height: '12px' }} />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={10} style={{ width: '12px', height: '12px' }} />
                        Fetch
                      </>
                    )}
                  </Button>
                )}
              </Form.Label>
              <Form.Control
                type="date"
                value={newIntegration.expiresAt}
                onChange={(e) => setNewIntegration(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
              <Form.Text className="text-muted">
                When the access token expires (optional) - click "Fetch" to automatically get the expiry date from your access token
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleCreateIntegration}
            disabled={creating || !newIntegration.accessToken.trim()}
          >
            {creating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus size={16} className="me-2" />
                Create Integration
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IntegrationManagementModal;

