import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectLinkedInStats, selectLinkedInStatusStats } from '@/toolkit/linkedInData/reducer';
import { selectFacebookStats } from '@/toolkit/facebookData/reducer';
import { selectInstagramStats, selectInstagramStatsStatus } from '@/toolkit/instagramData/reducer';
import { selectXStats, selectXStatsStatus } from '@/toolkit/xData/reducer';
import { selectIntegrations } from '@/toolkit/Integrations/reducer';
import { fetchLinkedInStats } from '@/toolkit/linkedInData/reducer';
import { fetchFacebookStats } from '@/toolkit/facebookData/reducer';
import { fetchInstagramStats } from '@/toolkit/instagramData/reducer';
import { fetchXStats } from '@/toolkit/xData/reducer';
import { DashboardDateRange } from '@/components/DashboardDateFilter';
import { AppDispatch } from '@/toolkit';
import { getFlatMetricValue } from '@/lib/stats-utils';

export const usePlatformStats = (dateRange?: DashboardDateRange) => {
  const dispatch = useDispatch<AppDispatch>();
  const linkedInStats = useSelector(selectLinkedInStats);
  const facebookStats = useSelector(selectFacebookStats);
  const instagramStats = useSelector(selectInstagramStats);
  const xStats = useSelector(selectXStats);
  const integrations = useSelector(selectIntegrations);
  
  // Loading states
  const linkedInLoading = useSelector(selectLinkedInStatusStats);
  const instagramLoading = useSelector(selectInstagramStatsStatus);
  const xLoading = useSelector(selectXStatsStatus);

  // Fetch platform data when date range changes
  useEffect(() => {
    if (!dateRange || !integrations || integrations.length === 0) {
      return;
    }

    const fetchPlatformData = async () => {
      const connectedIntegrations = integrations.filter((integration: any) => 
        integration.status === 'CONNECTED' && 
        (integration.type === 'LINKEDIN' || integration.type === 'FACEBOOK' || integration.type === 'INSTAGRAM' || integration.type === 'X')
      );

      const promises = connectedIntegrations.map(async (integration: any) => {
        try {
          const since = dateRange.current.startDate.toISOString().split('T')[0];
          const until = dateRange.current.endDate.toISOString().split('T')[0];
          
          if (integration.type === 'LINKEDIN') {
            const defaultLinkedInOrgId = '90362182'; // This should come from your database
            await dispatch(fetchLinkedInStats({
              organizationId: defaultLinkedInOrgId,
              platform: 'linkedin',
              since,
              until,
              datePreset: ''
            }));
          } else if (integration.type === 'FACEBOOK') {
            const defaultPageId = 'me'; // This should come from your database
            await dispatch(fetchFacebookStats({
              pageId: defaultPageId,
              platform: integration.type.toLowerCase(),
              since,
              until,
              datePreset: ''
            }));
          } else if (integration.type === 'INSTAGRAM') {
            await dispatch(fetchInstagramStats({
              platform: 'instagram',
              since,
              until,
              datePreset: ''
            }));
          } else if (integration.type === 'X') {
            const username = integration.handle || 'GeorgeMsapenda'; // Default username
            await dispatch(fetchXStats({
              username,
              platform: integration.type.toLowerCase(),
              since,
              until,
              datePreset: ''
            }));
          }
        } catch (error) {
          console.error(`Error fetching ${integration.type} stats:`, error);
        }
      });

      await Promise.allSettled(promises);
    };

    fetchPlatformData();
  }, [dateRange, integrations, dispatch]);

  // Calculate total reach across all platforms
  const calculateTotalReach = () => {
    let totalReach = 0;
    
    // LinkedIn reach (unique impressions)
    const linkedInReach = getFlatMetricValue(linkedInStats, 'unique_impressions_count', 'uniqueImpressionsCount');
    if (linkedInReach) totalReach += Number(linkedInReach);
    
    // Facebook reach
    const facebookReach = getFlatMetricValue(facebookStats, 'page_reach', 'post_impressions');
    if (facebookReach) totalReach += Number(facebookReach);
    
    // Instagram reach
    const instagramReach = getFlatMetricValue(instagramStats, 'reach', 'impressions');
    if (instagramReach) totalReach += Number(instagramReach);
    
    // X reach (followers as proxy for potential reach)
    const xReach = getFlatMetricValue(xStats, 'followers', 'impressions');
    if (xReach) totalReach += Number(xReach);
    
    return totalReach;
  };

  // Calculate total engagement across all platforms
  const calculateTotalEngagement = () => {
    let totalEngagement = 0;
    
    // LinkedIn engagement (likes + comments + shares)
    if (linkedInStats) {
      const likes = Number(getFlatMetricValue(linkedInStats, 'like_count', 'likeCount') || 0);
      const comments = Number(getFlatMetricValue(linkedInStats, 'comment_count', 'commentCount') || 0);
      const shares = Number(getFlatMetricValue(linkedInStats, 'share_count', 'shareCount') || 0);
      totalEngagement += likes + comments + shares;
    }
    
    // Facebook engagement (post engagements)
    if (facebookStats) {
      const fbEngagement = Number(getFlatMetricValue(facebookStats, 'page_post_engagements') || 0);
      if (fbEngagement > 0) {
        totalEngagement += fbEngagement;
      } else {
        // Fallback to calculating from individual reactions (legacy)
        const reactions = (facebookStats.post_reactions_like_total || 0) +
                         (facebookStats.post_reactions_love_total || 0) +
                         (facebookStats.post_reactions_wow_total || 0) +
                         (facebookStats.post_reactions_haha_total || 0) +
                         (facebookStats.post_reactions_sorry_total || 0) +
                         (facebookStats.post_reactions_anger_total || 0) +
                         (facebookStats.comment || 0) +
                         (facebookStats.share || 0);
        totalEngagement += reactions;
      }
    }
    
    // Instagram engagement (total interactions)
    if (instagramStats) {
      const igEngagement = Number(getFlatMetricValue(instagramStats, 'total_interactions') || 0);
      if (igEngagement > 0) {
        totalEngagement += igEngagement;
      } else {
        // Fallback to likes + comments (legacy)
        const likes = Number(getFlatMetricValue(instagramStats, 'likes', 'likes') || 0);
        const comments = Number(getFlatMetricValue(instagramStats, 'comments', 'comments') || 0);
        totalEngagement += likes + comments;
      }
    }
    
    // X engagement (likes + retweets + replies)
    if (xStats) {
      const likes = Number(getFlatMetricValue(xStats, 'like_count', 'likes') || 0);
      const retweets = Number(xStats.retweets || 0);
      const replies = Number(xStats.replies || 0);
      totalEngagement += likes + retweets + replies;
    }
    
    return totalEngagement;
  };

  // Calculate percentage change based on previous period data
  const calculateReachPercentageChange = () => {
    if (!dateRange) return 0;
    
    const currentReach = calculateTotalReach();
    // For now, we'll simulate previous period data since we don't have historical data stored
    // In a real implementation, you'd fetch data for the previous period
    const previousReach = Math.floor(currentReach * 0.85); // Simulate 15% growth
    
    if (previousReach === 0) return 0;
    return Math.round(((currentReach - previousReach) / previousReach) * 100);
  };

  const calculateEngagementPercentageChange = () => {
    if (!dateRange) return 0;
    
    const currentEngagement = calculateTotalEngagement();
    // For now, we'll simulate previous period data since we don't have historical data stored
    // In a real implementation, you'd fetch data for the previous period
    const previousEngagement = Math.floor(currentEngagement * 0.77); // Simulate 23% growth
    
    if (previousEngagement === 0) return 0;
    return Math.round(((currentEngagement - previousEngagement) / previousEngagement) * 100);
  };

  const totalReach = calculateTotalReach();
  const totalEngagement = calculateTotalEngagement();
  const reachPercentageChange = calculateReachPercentageChange();
  const engagementPercentageChange = calculateEngagementPercentageChange();

  // Calculate previous period values for display
  const previousReach = Math.floor(totalReach * 0.85); // Simulate previous period
  const previousEngagement = Math.floor(totalEngagement * 0.77); // Simulate previous period

  // Debug logging to see actual data (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 usePlatformStats Debug:', {
      dateRange: dateRange ? {
        current: {
          start: dateRange.current.startDate.toISOString().split('T')[0],
          end: dateRange.current.endDate.toISOString().split('T')[0]
        }
      } : 'No date range',
      platformStats: {
        linkedIn: linkedInStats ? {
          reach: getFlatMetricValue(linkedInStats, 'unique_impressions_count', 'uniqueImpressionsCount'),
          likes: getFlatMetricValue(linkedInStats, 'like_count', 'likeCount'),
          comments: getFlatMetricValue(linkedInStats, 'comment_count', 'commentCount'),
        } : null,
        facebook: facebookStats ? {
          reach: getFlatMetricValue(facebookStats, 'page_reach', 'post_impressions'),
          engagement: getFlatMetricValue(facebookStats, 'page_post_engagements'),
        } : null,
        instagram: instagramStats ? {
          reach: getFlatMetricValue(instagramStats, 'reach', 'impressions'),
          engagement: getFlatMetricValue(instagramStats, 'total_interactions'),
        } : null,
        x: xStats ? {
          followers: getFlatMetricValue(xStats, 'followers'),
          likes: getFlatMetricValue(xStats, 'like_count', 'likes'),
        } : null
      },
      calculatedTotals: {
        totalReach,
        totalEngagement,
        previousReach,
        previousEngagement,
        reachPercentageChange,
        engagementPercentageChange
      }
    });
  }

  // Check if any platform is loading
  const isLoading = linkedInLoading === 'loading' || instagramLoading === 'loading' || xLoading === 'loading';

  return {
    totalReach,
    totalEngagement,
    previousReach,
    previousEngagement,
    reachPercentageChange,
    engagementPercentageChange,
    isLoading,
    platformStats: {
      linkedIn: linkedInStats,
      facebook: facebookStats,
      instagram: instagramStats,
      x: xStats
    }
  };
};
