import { useState, useEffect } from 'react';
import { facebookService } from '@/services/facebookService';

interface UseFacebookDataReturn {
  pageInfo: any | null;
  posts: any[] | null;
  metrics: Record<string, any>;
  stats: any | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getMetrics: (metrics: string[]) => Promise<void>;
}

export const useFacebookData = (pageId: string, platform: string = 'facebook'): UseFacebookDataReturn => {
  const [pageInfo, setPageInfo] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[] | null>(null);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPageInfo = async () => {
    try {
      setError(null);
      const info = await facebookService.getPageInfo(pageId, platform);
      setPageInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch page info');
    }
  };

  const fetchPosts = async () => {
    try {
      setError(null);
      const postsData = await facebookService.getPosts(pageId, platform);
      setPosts(postsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);
      const statsData = await facebookService.getStats(pageId, platform);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  };

  const getMetrics = async (metricsList: string[]) => {
    try {
      setError(null);
      const metricsData = await facebookService.getMultipleMetrics(pageId, metricsList, platform);
      setMetrics(prev => ({ ...prev, ...metricsData }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPageInfo(),
        fetchPosts(),
        fetchStats(),
        getMetrics(['pageImpressions', 'pageEngagedUsers', 'pagePostEngagements'])
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      refresh();
    }
  }, [pageId, platform]);

  return { 
    pageInfo, 
    posts, 
    metrics, 
    stats, 
    loading, 
    error, 
    refresh, 
    getMetrics 
  };
};
