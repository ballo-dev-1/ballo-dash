import { useState, useEffect } from 'react';
import { linkedinService } from '@/services/linkedinService';

interface UseLinkedInDataReturn {
  organizationInfo: any | null;
  metrics: Record<string, any>;
  posts: any[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getMetrics: (metrics: string[]) => Promise<void>;
}

export const useLinkedInData = (organizationId: string): UseLinkedInDataReturn => {
  const [organizationInfo, setOrganizationInfo] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [posts, setPosts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationInfo = async () => {
    try {
      setError(null);
      const info = await linkedinService.getOrganizationInfo(organizationId);
      setOrganizationInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organization info');
    }
  };

  const fetchPosts = async () => {
    try {
      setError(null);
      const postsData = await linkedinService.getPosts(organizationId);
      setPosts(postsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    }
  };

  const getMetrics = async (metricsList: string[]) => {
    try {
      setError(null);
      const metricsData = await linkedinService.getMultipleMetrics(organizationId, metricsList);
      setMetrics(prev => ({ ...prev, ...metricsData }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOrganizationInfo(),
        fetchPosts(),
        getMetrics(['followers', 'engagement', 'impressions'])
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      refresh();
    }
  }, [organizationId]);

  return { 
    organizationInfo, 
    metrics, 
    posts, 
    loading, 
    error, 
    refresh, 
    getMetrics 
  };
};
