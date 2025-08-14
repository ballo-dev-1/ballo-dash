import { useState, useEffect } from 'react';
import { Company } from '@/types';
import { companyService } from '@/services/companyService';

interface UseCompanyDataReturn {
  company: Company | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useCompanyData = (): UseCompanyDataReturn => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const companyData = await companyService.getCompany();
      setCompany(companyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const companyData = await companyService.refreshCompany();
      setCompany(companyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh company data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  return { company, loading, error, refresh };
};
