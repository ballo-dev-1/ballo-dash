import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import { useSelector } from "react-redux";
import { 
  selectProgressiveFacebookStats,
  selectProgressiveFacebookStatus,
  selectProgressiveFacebookError
} from "@/toolkit/facebookData/reducer";
import { 
  selectProgressiveLinkedInStats, 
  selectProgressiveLinkedInStatus,
  selectProgressiveLinkedInError 
} from "@/toolkit/linkedInData/reducer";

interface OverviewAccountsProps {
  facebook: any; // Replace `any` with a proper type if you know the shape of `facebook`
  linkedInData?: any; // Add LinkedIn data prop
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface PlatformOverview {
  platform: string;
  pageName?: string;
  page_fans?: number | string;
  page_follows?: number | string;
  "Reach (day)"?: number | string;
  "Reach (week)"?: number | string;
  "Reach (month)"?: number | string;
  "Engagement (day)"?: number | string;
  "Engagement (week)"?: number | string;
  "Engagement (month)"?: number | string;
  "CTA Clicks (day)"?: number | string;
  "CTA Clicks (week)"?: number | string;
  "CTA Clicks (month)"?: number | string;
  engagement?: number | string;
  Clicks?: number | string;
  last_post_date?: Date | string;
}

const transformFacebookData = (facebook: any): PlatformOverview | null => {
  if (!facebook) return null;

  const {
    platform = "Facebook",
    pageInfo,
    accountInfo,
    metrics = {},
    recentPost = "-",
  } = facebook;

  // Use accountInfo if available (new format), otherwise fall back to pageInfo (old format)
  const pageName = accountInfo?.name ?? pageInfo?.name ?? "-";
  
  // NEW FORMAT: Flat metrics without period nesting
  const pageLikesArr = metrics.page_likes?.values || [];
  const page_fans = pageLikesArr[pageLikesArr.length - 1]?.value ?? "-";
  
  const pageFollowsArr = metrics.page_follows?.values || [];
  const page_follows = pageFollowsArr[pageFollowsArr.length - 1]?.value ?? "-";

  const reachArr = metrics?.page_reach?.values ?? [];
  const reach = reachArr[reachArr.length - 1]?.value ?? "-";

  const engagementArr = metrics?.page_post_engagements?.values ?? [];
  const engagement = engagementArr[engagementArr.length - 1]?.value ?? "-";

  const ctaClicksArr = metrics?.page_actions?.values ?? [];
  const ctaClicks = ctaClicksArr[ctaClicksArr.length - 1]?.value ?? "-";

  let recentPostDate = "-";

  const rawDate = recentPost?.data?.[0]?.created_time;

  if (rawDate) {
    const isoDateStr = rawDate.replace("+0000", "Z");
    const parsedDate = new Date(isoDateStr);

    if (!isNaN(parsedDate.getTime())) {
      recentPostDate = parsedDate.toLocaleString();
    }
  }

  return {
    platform,
    pageName,
    page_fans,
    page_follows,
    "Reach (day)": reach,
    "Reach (week)": reach, // Flat structure doesn't have periods, use same value
    "Reach (month)": reach,
    "Engagement (day)": engagement,
    "Engagement (week)": engagement,
    "Engagement (month)": engagement,
    "CTA Clicks (day)": ctaClicks,
    "CTA Clicks (week)": ctaClicks,
    "CTA Clicks (month)": ctaClicks,
    engagement: engagement,
    last_post_date: recentPostDate,
  };
};

// New function to transform progressive data
const transformProgressiveFacebookData = (progressiveData: any): PlatformOverview | null => {
  if (!progressiveData) return null;

  const { pageInfo, accountInfo, metrics, recentPost, loadingMetrics } = progressiveData;

  // Use accountInfo if available (new format), otherwise fall back to pageInfo (old format)
  const pageName = accountInfo?.name ?? pageInfo?.name ?? "-";

  // Helper function to get metric value with loading state - NOW FLAT STRUCTURE
  const getMetricValue = (metricName: string, defaultValue: any = "-") => {
    if (loadingMetrics?.includes(metricName)) {
      return "Loading...";
    }
    
    const metricData = metrics[metricName];
    if (!metricData || !metricData.values) {
      return defaultValue;
    }
    
    const values = metricData.values;
    return values && values.length > 0 ? values[values.length - 1].value : defaultValue;
  };

  // Helper function to format recent post date
  const getRecentPostDate = () => {
    if (!recentPost?.data?.[0]?.created_time) return "-";
    
    const rawDate = recentPost.data[0].created_time;
    const isoDateStr = rawDate.replace("+0000", "Z");
    const parsedDate = new Date(isoDateStr);
    
    return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : "-";
  };

  const page_fans = getMetricValue("page_likes");
  const page_follows = getMetricValue("page_follows");
  const reach = getMetricValue("page_reach");
  const engagement = getMetricValue("page_post_engagements");
  const ctaClicks = getMetricValue("page_actions");

  return {
    platform: progressiveData.platform || "Facebook",
    pageName,
    page_fans,
    page_follows,
    "Reach (day)": reach,
    "Reach (week)": reach, // Flat structure doesn't have periods, use same value
    "Reach (month)": reach,
    "Engagement (day)": engagement,
    "Engagement (week)": engagement,
    "Engagement (month)": engagement,
    "CTA Clicks (day)": ctaClicks,
    "CTA Clicks (week)": ctaClicks,
    "CTA Clicks (month)": ctaClicks,
    engagement: engagement,
    last_post_date: getRecentPostDate(),
  };
};

const transformLinkedInData = (linkedInData: any): PlatformOverview | null => {
  if (!linkedInData || Object.keys(linkedInData).length === 0) {
    return null;
  }

  // Helper function to format numbers
  const formatNumber = (num: number | null | undefined): string | number => {
    if (num === null || num === undefined || num === 0) return "-";
    return num.toLocaleString();
  };

  // Helper function to extract metric value from flat structure
  const getMetricValue = (metrics: any, metricName: string): number | null => {
    const metricData = metrics?.[metricName];
    if (!metricData || !metricData.values || metricData.values.length === 0) {
      return null;
    }
    return metricData.values[metricData.values.length - 1].value;
  };

  // Check if using new standardized format with accountInfo and flat metrics
  const isStandardized = linkedInData.accountInfo && linkedInData.metrics;
  
  let followers, impressions, engagement, clicks;
  let pageName;
  
  if (isStandardized) {
    // NEW FORMAT: Use accountInfo and flat metrics
    pageName = linkedInData.accountInfo.name || "Company Page";
    followers = getMetricValue(linkedInData.metrics, "page_follows");
    impressions = getMetricValue(linkedInData.metrics, "impression_count");
    engagement = getMetricValue(linkedInData.metrics, "engagement");
    clicks = getMetricValue(linkedInData.metrics, "click_count");
  } else {
    // OLD FORMAT: Use flat structure
    pageName = linkedInData.organizationName || "Company Page";
    followers = linkedInData.followers;
    impressions = linkedInData.impressionCount;
    engagement = linkedInData.engagement;
    clicks = linkedInData.clickCount;
  }

  const result = {
    platform: "LinkedIn",
    pageName,
    page_fans: formatNumber(followers),
    page_follows: formatNumber(followers),
    "Reach (day)": formatNumber(impressions),
    "Reach (week)": formatNumber(impressions),
    "Reach (month)": formatNumber(impressions),
    "Engagement (day)": formatNumber(engagement),
    "Engagement (week)": formatNumber(engagement),
    "Engagement (month)": formatNumber(engagement),
    "CTA Clicks (day)": formatNumber(clicks),
    "CTA Clicks (week)": formatNumber(clicks),
    "CTA Clicks (month)": formatNumber(clicks),
    engagement: formatNumber(engagement),
    last_post_date: "-", // LinkedIn posts are fetched separately
  };

  return result;
};

// New function to transform progressive LinkedIn data
const transformProgressiveLinkedInData = (progressiveData: any): PlatformOverview | null => {
  if (!progressiveData) return null;

  const { 
    organizationName, 
    accountInfo,
    followers, 
    impressionCount, 
    clickCount, 
    engagement, 
    metrics,
    loadingMetrics 
  } = progressiveData;

  // Use accountInfo if available (new format), otherwise fall back to organizationName (old format)
  const pageName = accountInfo?.name ?? organizationName ?? "Company Page";

  // Helper function to extract metric value from flat structure
  const getMetricValueFromMetrics = (metricName: string): number | null => {
    const metricData = metrics?.[metricName];
    if (!metricData || !metricData.values || metricData.values.length === 0) {
      return null;
    }
    return metricData.values[metricData.values.length - 1].value;
  };

  // Helper function to get metric value with loading state
  const getMetricValue = (metricName: string, legacyField: string, defaultValue: any = "-") => {
    if (loadingMetrics?.includes(metricName)) {
      return "Loading...";
    }
    
    // Try new format first (flat metrics structure)
    if (metrics) {
      const value = getMetricValueFromMetrics(metricName);
      if (value !== null) return value;
    }
    
    // Fall back to old format
    switch (legacyField) {
      case "followers":
        return followers || defaultValue;
      case "impressions":
        return impressionCount || defaultValue;
      case "clicks":
        return clickCount || defaultValue;
      case "engagement":
        return engagement || defaultValue;
      default:
        return defaultValue;
    }
  };

  // Helper function to format numbers
  const formatNumber = (num: number | null | undefined): string | number => {
    if (num === null || num === undefined || num === 0) return "-";
    return num.toLocaleString();
  };

  return {
    platform: "LinkedIn",
    pageName,
    page_fans: formatNumber(getMetricValue("page_follows", "followers")),
    page_follows: formatNumber(getMetricValue("page_follows", "followers")),
    "Reach (day)": formatNumber(getMetricValue("impression_count", "impressions")),
    "Reach (week)": formatNumber(getMetricValue("impression_count", "impressions")),
    "Reach (month)": formatNumber(getMetricValue("impression_count", "impressions")),
    "Engagement (day)": formatNumber(getMetricValue("engagement", "engagement")),
    "Engagement (week)": formatNumber(getMetricValue("engagement", "engagement")),
    "Engagement (month)": formatNumber(getMetricValue("engagement", "engagement")),
    "CTA Clicks (day)": formatNumber(getMetricValue("click_count", "clicks")),
    "CTA Clicks (week)": formatNumber(getMetricValue("click_count", "clicks")),
    "CTA Clicks (month)": formatNumber(getMetricValue("click_count", "clicks")),
    engagement: formatNumber(getMetricValue("engagement", "engagement")),
    last_post_date: "-", // LinkedIn posts are fetched separately
  };
};

const OverviewAccounts: React.FC<OverviewAccountsProps> = ({
  facebook,
  linkedInData,
  isExpanded,
  onToggleExpand,
}) => {
  // Get progressive data from Redux
  const progressiveData = useSelector(selectProgressiveFacebookStats);
  const progressiveStatus = useSelector(selectProgressiveFacebookStatus);
  const progressiveError = useSelector(selectProgressiveFacebookError);
  
  const progressiveLinkedInData = useSelector(selectProgressiveLinkedInStats);
  const progressiveLinkedInStatus = useSelector(selectProgressiveLinkedInStatus);
  const progressiveLinkedInError = useSelector(selectProgressiveLinkedInError);

  // Debug logging
  useEffect(() => {
    console.log("=== Table OverviewAccounts Debug ===");
    console.log("progressiveData:", progressiveData);
    console.log("progressiveStatus:", progressiveStatus);
    console.log("progressiveError:", progressiveError);
    console.log("progressiveLinkedInData:", progressiveLinkedInData);
    console.log("progressiveLinkedInStatus:", progressiveLinkedInStatus);
    console.log("progressiveLinkedInError:", progressiveLinkedInError);
    console.log("facebook:", facebook);
    console.log("linkedInData:", linkedInData);
    console.log("=== End Table OverviewAccounts Debug ===");
  }, [progressiveData, progressiveStatus, progressiveError, progressiveLinkedInData, progressiveLinkedInStatus, progressiveLinkedInError, facebook, linkedInData]);

  const [reachHeader, setReachHeader] = useState("Reach (week)");
  const [engagementHeader, setEngagementHeader] =
    useState("Engagement (month)");
  const [CTAClicksHeader, setCTAClicksHeader] = useState("CTA Clicks (month)");
  const facebookData: PlatformOverview[] = [];
  const linkedinDataArray: PlatformOverview[] = [];

  // Use progressive data if available, otherwise fall back to regular facebook data
  const transformed = progressiveData 
    ? transformProgressiveFacebookData(progressiveData)
    : transformFacebookData(facebook);
    
  if (transformed) {
    facebookData.push(transformed);
  }

  // Use progressive LinkedIn data if available, otherwise fall back to regular LinkedIn data
  const transformedLinkedIn = progressiveLinkedInData 
    ? transformProgressiveLinkedInData(progressiveLinkedInData)
    : transformLinkedInData(linkedInData);
    
  if (transformedLinkedIn) {
    linkedinDataArray.push(transformedLinkedIn);
  }

  const instagramData: { instagramData: any }[] = [];
  const xData: { xData: any }[] = [];
  const tiktokData: { tiktokData: any }[] = [];
  const websiteData: { websiteData: any }[] = [];
  const youtubeData: { youtubeData: any }[] = [];
  const whatsappData: { whatsappData: any }[] = [];

  const data = [
    ...facebookData,
    ...linkedinDataArray,
    ...instagramData,
    ...xData,
    ...tiktokData,
    ...websiteData,
    ...youtubeData,
    ...whatsappData,
  ];

  const title = "Account";

  const description = "Snapshot of each platform's performance";

  const columns = [
    {
      header: "Platform",
      enableColumnFilter: false,
      accessorKey: "platform",
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
      accessorKey: "page_fans",
    },
    {
      header: reachHeader,
      enableColumnFilter: false,
      accessorKey: reachHeader,
    },
    {
      header: engagementHeader,
      enableColumnFilter: false,
      accessorKey: engagementHeader,
    },
    {
      header: CTAClicksHeader,
      enableColumnFilter: false,
      accessorKey: CTAClicksHeader,
    },
    {
      header: "Last Post Date",
      enableColumnFilter: false,
      accessorKey: "last_post_date",
    },
  ];

  // Determine loading state
  const isLoading = progressiveStatus === "loading" || progressiveLinkedInStatus === "loading" || 
                   (!progressiveData && !facebook?.metrics && !progressiveLinkedInData && !linkedInData);

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
