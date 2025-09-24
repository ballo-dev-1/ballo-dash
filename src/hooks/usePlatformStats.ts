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
    if (linkedInStats?.uniqueImpressionsCount) {
      totalReach += linkedInStats.uniqueImpressionsCount;
    }
    
    // Facebook reach (post impressions)
    if (facebookStats?.post_impressions) {
      totalReach += facebookStats.post_impressions;
    }
    
    // Instagram reach (impressions)
    if (instagramStats?.impressions) {
      totalReach += instagramStats.impressions;
    }
    
    // X reach (impressions)
    if (xStats?.impressions) {
      totalReach += xStats.impressions;
    }
    
    return totalReach;
  };

  // Calculate total engagement across all platforms
  const calculateTotalEngagement = () => {
    let totalEngagement = 0;
    
    // LinkedIn engagement (likes + comments + shares)
    if (linkedInStats) {
      const linkedInEngagement = (linkedInStats.likeCount || 0) + 
                                (linkedInStats.commentCount || 0) + 
                                (linkedInStats.shareCount || 0);
      totalEngagement += linkedInEngagement;
    }
    
    // Facebook engagement (likes + comments + shares)
    if (facebookStats) {
      const facebookEngagement = (facebookStats.post_reactions_like_total || 0) +
                                (facebookStats.post_reactions_love_total || 0) +
                                (facebookStats.post_reactions_wow_total || 0) +
                                (facebookStats.post_reactions_haha_total || 0) +
                                (facebookStats.post_reactions_sorry_total || 0) +
                                (facebookStats.post_reactions_anger_total || 0) +
                                (facebookStats.comment || 0) +
                                (facebookStats.share || 0);
      totalEngagement += facebookEngagement;
    }
    
    // Instagram engagement (likes + comments)
    if (instagramStats) {
      const instagramEngagement = (instagramStats.likes || 0) + 
                                 (instagramStats.comments || 0);
      totalEngagement += instagramEngagement;
    }
    
    // X engagement (likes + retweets + replies)
    if (xStats) {
      const xEngagement = (xStats.likes || 0) + 
                          (xStats.retweets || 0) + 
                          (xStats.replies || 0);
      totalEngagement += xEngagement;
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

  // Debug logging to see actual data
  console.log('🔍 usePlatformStats Debug:', {
    dateRange: dateRange ? {
      current: {
        start: dateRange.current.startDate.toISOString().split('T')[0],
        end: dateRange.current.endDate.toISOString().split('T')[0]
      }
    } : 'No date range',
    platformStats: {
      linkedIn: {
        uniqueImpressionsCount: linkedInStats?.uniqueImpressionsCount,
        likeCount: linkedInStats?.likeCount,
        commentCount: linkedInStats?.commentCount,
        shareCount: linkedInStats?.shareCount
      },
      facebook: {
        post_impressions: facebookStats?.post_impressions,
        post_reactions_like_total: facebookStats?.post_reactions_like_total,
        comment: facebookStats?.comment,
        share: facebookStats?.share
      },
      instagram: {
        impressions: instagramStats?.impressions,
        likes: instagramStats?.likes,
        comments: instagramStats?.comments
      },
      x: {
        impressions: xStats?.impressions,
        likes: xStats?.likes,
        retweets: xStats?.retweets,
        replies: xStats?.replies
      }
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
