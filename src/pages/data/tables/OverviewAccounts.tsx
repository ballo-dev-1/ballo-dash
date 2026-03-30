import { useEffect, useState, useRef } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import AccountsDateFilter, { AccountsDateRange } from "@/components/AccountsDateFilter";
import facebookIcon from "@/assets/images/socials/facebook.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import xIcon from "../../../assets/images/socials/X_icon.png";
import { 
  selectProgressiveFacebookStats,
  selectProgressiveFacebookStatus,
  selectProgressiveFacebookError,
  selectFacebookStats,
  fetchFacebookStatsProgressive,
  resetProgressiveFacebookStats
} from "@/toolkit/facebookData/reducer";
import { 
  selectProgressiveLinkedInStats,
  selectLinkedInPosts,
  fetchLinkedInStatsProgressive,
  resetProgressiveLinkedInStats
} from "@/toolkit/linkedInData/reducer";
import { 
  selectInstagramStats
} from "@/toolkit/instagramData/reducer";
import { 
  selectProgressiveXStats,
  selectXPosts,
  fetchXStats
} from "@/toolkit/xData/reducer";
import DataTransformationService, { PlatformOverview } from "@/services/dataTransformationService";

interface OverviewAccountsProps {
  facebook: any;
  linkedInData?: any;
  xData?: any;
  instagramDataProp?: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const transformFacebookData = (facebook: any): PlatformOverview | null => {
  console.log("🔄 transformFacebookData called with:", facebook);
  const result = DataTransformationService.getInstance().transformFacebookData(facebook);
  console.log("✅ transformFacebookData result:", result);
  return result;
};

const transformProgressiveFacebookData = (progressiveData: any): PlatformOverview | null => {
  console.log("🔄 transformProgressiveFacebookData called with:", progressiveData);
  const result = DataTransformationService.getInstance().transformProgressiveFacebookData(progressiveData);
  console.log("✅ transformProgressiveFacebookData result:", result);
  return result;
};

const transformLinkedInData = (linkedInData: any): PlatformOverview | null => {
  return DataTransformationService.getInstance().transformLinkedInData(linkedInData);
};

const transformProgressiveLinkedInData = (progressiveData: any): PlatformOverview | null => {
  return DataTransformationService.getInstance().transformProgressiveLinkedInData(progressiveData);
};

const transformXData = (xData: any): PlatformOverview | null => {
  return DataTransformationService.getInstance().transformXData(xData);
};

const transformProgressiveXData = (progressiveData: any): PlatformOverview | null => {
  return DataTransformationService.getInstance().transformProgressiveXData(progressiveData);
};

const transformInstagramData = (instagramData: any): PlatformOverview | null => {
  // Check if data is already in PlatformOverview format (has been transformed)
  if (instagramData && instagramData.platform && instagramData.pageName && typeof instagramData.platform === 'string') {
    // Data is already transformed, return as-is
    return instagramData as PlatformOverview;
  }
  
  // Data is in raw format, transform it
  return DataTransformationService.getInstance().transformInstagramData(instagramData);
};

const getLastPostDate = (postsData: any): string => {
  if (!postsData || !postsData.posts || !Array.isArray(postsData.posts) || postsData.posts.length === 0) {
    return "-";
  }
  
  // Sort posts by created_time and get the most recent one
  const sortedPosts = [...postsData.posts].sort((a: any, b: any) => {
    const dateA = new Date(a.created_time || a.created_at || 0);
    const dateB = new Date(b.created_time || b.created_at || 0);
    return dateB.getTime() - dateA.getTime();
  });
  
  const lastPost = sortedPosts[0];
  if (!lastPost) return "-";
  
  const postDate = new Date(lastPost.created_time || lastPost.created_at);
  if (isNaN(postDate.getTime())) return "-";
  
  // Format with date and time like Facebook and Instagram
  return postDate.toLocaleString();
};

const OverviewAccounts: React.FC<OverviewAccountsProps> = ({
  facebook,
  linkedInData,
  xData,
  instagramDataProp,
  isExpanded,
  onToggleExpand,
}) => {
  const dispatch = useDispatch();
  
  // Date range state
  const [dateRange, setDateRange] = useState<AccountsDateRange | undefined>(undefined);
  const previousDateRangeRef = useRef<AccountsDateRange | undefined>(undefined);

  // Get data from Redux
  const progressiveData = useSelector(selectProgressiveFacebookStats);
  const progressiveStatus = useSelector(selectProgressiveFacebookStatus);
  const progressiveError = useSelector(selectProgressiveFacebookError);
  
  // Get regular Facebook data from Redux
  const facebookStats = useSelector(selectFacebookStats);
  
  const progressiveLinkedInData = useSelector(selectProgressiveLinkedInStats);
  const progressiveXData = useSelector(selectProgressiveXStats);
  const instagramStats = useSelector(selectInstagramStats);
  const linkedinPosts = useSelector(selectLinkedInPosts);
  const xPosts = useSelector(selectXPosts);

  // Extract integration IDs
  const facebookIntegrationId = facebook?.pageInfo?.id || facebook?.pageId;
  const linkedInIntegrationId = linkedInData?.organizationId || linkedInData?.organization_id;
  const xIntegrationId = xData?.username || xData?.userInfo?.username;

  // Fetch new data when date range changes
  useEffect(() => {
    // Only proceed if dateRange exists and is different from the previous one
    if (dateRange && 
        (!previousDateRangeRef.current || 
         previousDateRangeRef.current.startDate.getTime() !== dateRange.startDate.getTime() ||
         previousDateRangeRef.current.endDate.getTime() !== dateRange.endDate.getTime())) {
      
      // Update the ref to track the current date range
      previousDateRangeRef.current = dateRange;
      
      // Convert date range to API parameters
      const since = dateRange.startDate.toISOString().split('T')[0];
      const until = dateRange.endDate.toISOString().split('T')[0];
      
      // Calculate difference in days to determine datePreset
      const diffTime = dateRange.endDate.getTime() - dateRange.startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Determine datePreset based on Facebook's official date_preset values
      // Reference: https://developers.facebook.com/docs/graph-api/reference/v23.0/insights
      const getDatePreset = (): string => {
        const today = new Date();
        const isToday = dateRange.startDate.toDateString() === today.toDateString();
        
        // Check if it's a single day (today or yesterday)
        if (diffDays === 0 || diffDays === 1) {
          if (isToday) return 'today';
          
          // Check if it's yesterday
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          if (dateRange.startDate.toDateString() === yesterday.toDateString()) {
            return 'yesterday';
          }
        }
        
        // Map to Facebook's official date presets
        if (diffDays <= 3) return 'last_3d';
        if (diffDays <= 7) return 'last_7d';
        if (diffDays <= 14) return 'last_14d';
        if (diffDays <= 28) return 'last_28d';
        if (diffDays <= 30) return 'last_30d';
        if (diffDays <= 90) return 'last_90d';
        
        // For longer ranges, use maximum (2 years of data)
        return 'maximum';
      };
      
      const datePreset = getDatePreset();
      
      // Fetch Facebook data with new date range
      if (facebookIntegrationId) {
        dispatch(resetProgressiveFacebookStats() as any);
        dispatch(fetchFacebookStatsProgressive({
          pageId: facebookIntegrationId,
          platform: 'facebook',
          since,
          until,
          datePreset
        }) as any);
      }
      
      // Fetch LinkedIn data with new date range
      if (linkedInIntegrationId) {
        dispatch(resetProgressiveLinkedInStats() as any);
        dispatch(fetchLinkedInStatsProgressive({
          organizationId: linkedInIntegrationId,
          platform: 'linkedin',
          since,
          until,
          datePreset
        }) as any);
      }
      
      // Fetch X data with new date range
      if (xIntegrationId) {
        dispatch(fetchXStats({
          username: xIntegrationId,
          platform: 'x',
          since,
          until,
          datePreset
        }) as any);
      }
    }
  }, [dateRange, dispatch, facebookIntegrationId, linkedInIntegrationId, xIntegrationId]);

  // Debug logging for Facebook data
  useEffect(() => {
    console.log("=== Facebook Data Debug ===");
    console.log("📘 Progressive Facebook Data:", progressiveData);
    console.log("📘 Progressive Status:", progressiveStatus);
    console.log("📘 Progressive Error:", progressiveError);
    console.log("📘 Facebook Stats from Redux:", facebookStats);
    console.log("📘 Facebook Prop:", facebook);
    console.log("📘 Facebook Integration ID:", facebookIntegrationId);
    console.log("=== End Facebook Data Debug ===");
  }, [progressiveData, progressiveStatus, progressiveError, facebookStats, facebook, facebookIntegrationId]);

  const facebookData: PlatformOverview[] = [];
  const linkedinDataArray: PlatformOverview[] = [];

  // Use progressive Facebook data if available, otherwise fall back to regular facebook data
  const transformed = progressiveData 
    ? transformProgressiveFacebookData(progressiveData)
    : transformFacebookData(facebookStats || facebook);
    
  // Log Facebook data transformation details
  console.log("🔍 Facebook Data Transformation:");
  console.log("  - Using progressive data:", !!progressiveData);
  console.log("  - Progressive data structure:", progressiveData);
  console.log("  - Facebook prop structure:", facebook);
  console.log("  - Facebook stats from Redux:", facebookStats);
  console.log("  - Transformed result:", transformed);
    
  if (transformed) {
    facebookData.push(transformed);
    console.log("✅ Facebook data added to array:", facebookData);
  } else {
    console.log("❌ No Facebook data to display");
  }

  // Use progressive LinkedIn data if available, otherwise fall back to regular LinkedIn data
  console.log("🔍 [OverviewAccounts] LinkedIn data sources:", {
    progressiveLinkedInData,
    linkedInData,
    hasProgressive: !!progressiveLinkedInData,
    hasLegacy: !!linkedInData
  });
  
  const transformedLinkedIn = progressiveLinkedInData 
    ? transformProgressiveLinkedInData(progressiveLinkedInData)
    : transformLinkedInData(linkedInData);
  
  console.log("🔍 [OverviewAccounts] LinkedIn transformation result:", transformedLinkedIn);
    
  if (transformedLinkedIn) {
    // Add last post date from LinkedIn posts
    const lastPostDate = getLastPostDate(linkedinPosts);
    const linkedinWithLastPost = {
      ...transformedLinkedIn,
      last_post_date: lastPostDate
    };
    console.log("✅ [OverviewAccounts] Adding LinkedIn to table data:", linkedinWithLastPost);
    linkedinDataArray.push(linkedinWithLastPost);
  } else {
    console.log("⚠️ [OverviewAccounts] No LinkedIn data to display");
  }

  // Transform Instagram data
  const transformedInstagram = instagramStats || instagramDataProp ? transformInstagramData(instagramStats || instagramDataProp) : null;
  const instagramDataArray: PlatformOverview[] = [];
  if (transformedInstagram) {
    instagramDataArray.push(transformedInstagram);
  }
  
  // Transform X data
  const transformedX = progressiveXData 
    ? transformProgressiveXData(progressiveXData)
    : xData ? transformXData(xData) : null;
  const xDataArray: PlatformOverview[] = [];
  if (transformedX) {
    // Add last post date from X posts
    const lastPostDate = getLastPostDate(xPosts);
    const xWithLastPost = {
      ...transformedX,
      last_post_date: lastPostDate
    };
    xDataArray.push(xWithLastPost);
  }
  
  const tiktokData: { tiktokData: any }[] = [];
  const websiteData: { websiteData: any }[] = [];
  const youtubeData: { youtubeData: any }[] = [];
  const whatsappData: { whatsappData: any }[] = [];

  // Combine all platform data
  // Date filter fetches new data from API for each platform with the selected date range
  const data = [
    ...facebookData,
    ...linkedinDataArray,
    ...instagramDataArray,
    ...xDataArray,
    ...tiktokData,
    ...websiteData,
    ...youtubeData,
    ...whatsappData,
  ];

  const title = "Account";

  const description = "Snapshot of each platform's performance";

  const getPlatformIcon = (platform: string) => {
    if (!platform || typeof platform !== 'string') {
      return null;
    }
    
    switch (platform.toLowerCase()) {
      case 'facebook':
        return facebookIcon;
      case 'linkedin':
        return linkedinIcon;
      case 'instagram':
        return instaIcon;
      case 'x':
      case 'twitter':
      case 'x (twitter)':
        return xIcon;
      default:
        return null;
    }
  };

  const columns = [
    {
      header: "Platform",
      enableColumnFilter: false,
      accessorKey: "platform",
      cell: ({ getValue }: any) => {
        const platform = getValue();
        const icon = getPlatformIcon(platform);
        
        return (
          <div className="d-flex align-items-center">
            {icon ? (
              <Image
                src={icon}
                alt={`${platform || 'Unknown'} icon`}
                style={{ 
                  objectFit: "contain", 
                  width: 20, 
                  height: 20, 
                  marginRight: 8 
                }}
              />
            ) : null}
            <span>{platform || 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      header: "Page Name",
      enableColumnFilter: false,
      accessorKey: "pageName",
    },
    {
      header: "Followers",
      enableColumnFilter: false,
      accessorKey: "page_follows",
    },
    {
      header: "Likes",
      enableColumnFilter: false,
      accessorKey: "page_fans", // Legacy name, still used in PlatformOverview
    },
    {
      header: "Reach",
      enableColumnFilter: false,
      accessorKey: "Reach (month)",
    },
    {
      header: "Engagement",
      enableColumnFilter: false,
      accessorKey: "Engagement (month)",
    },
    {
      header: "CTA Clicks",
      enableColumnFilter: false,
      accessorKey: "CTA Clicks (month)",
    },
    {
      header: "Last Post Date",
      enableColumnFilter: false,
      accessorKey: "last_post_date",
    },
  ];

  // Determine loading state
  const isLoading = progressiveStatus === "loading" || 
                   (!progressiveData && !facebookStats?.metrics && !facebook?.metrics && !progressiveLinkedInData && !linkedInData);

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5>{title}</h5>

              <button onClick={onToggleExpand} className="expand-btn">
                {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              </button>
            </div>
          </Card.Header>
          <Card.Body className="table-border-style">
            {/* Date Range Filter */}
            <div className="mb-3">
              <AccountsDateFilter onDateRangeChange={setDateRange} />
            </div>
            
            <div id="pc-dt-fetchapi">
              <TableContainer
                columns={columns || []}
                data={data || []}
                isGlobalFilter={true}
                isBordered={false}
                customPageSize={5}
                isPagination={true}
                loading={isLoading}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OverviewAccounts;
