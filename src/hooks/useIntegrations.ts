import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCompany } from '@/toolkit/Company/reducer';
import { 
  selectIntegrations, 
  selectHasIntegrations, 
  selectIntegrationsLoading, 
  selectIntegrationsError,
  fetchIntegrations 
} from '@/toolkit/Integrations/reducer';

interface UseIntegrationsReturn {
  integrations: any[];
  hasIntegrations: boolean;
  loading: boolean;
  error: string | null;
  refreshIntegrations: () => Promise<void>;
}

export const useIntegrations = (): UseIntegrationsReturn => {
  const dispatch = useDispatch();
  const company = useSelector(selectCompany);
  
  // Get state from Redux store
  const integrations = useSelector(selectIntegrations);
  const hasIntegrations = useSelector(selectHasIntegrations);
  const loading = useSelector(selectIntegrationsLoading);
  const error = useSelector(selectIntegrationsError);
  
  // Debug logging
  console.log('🔍 useIntegrations hook state:', {
    companyId: company?.id,
    integrationsCount: integrations?.length || 0,
    hasIntegrations,
    loading,
    error
  });

  const refreshIntegrations = () => {
    if (company?.id) {
      dispatch(fetchIntegrations(company.id));
    }
  };

  useEffect(() => {
    console.log('🔄 useIntegrations: useEffect triggered, company?.id:', company?.id);
    if (company?.id) {
      console.log('🚀 useIntegrations: Dispatching fetchIntegrations for company:', company.id);
      dispatch(fetchIntegrations(company.id));
    }
  }, [company?.id, dispatch]);

  return {
    integrations,
    hasIntegrations,
    loading,
    error,
    refreshIntegrations
  };
};
