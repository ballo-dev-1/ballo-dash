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
    metrics = {},
    recentPost = "-",
  } = facebook;

  const pageName = pageInfo?.name ?? "-";
  const pageFansArr = metrics.page_fans?.day?.values || [];
  const page_fans = pageFansArr[pageFansArr.length - 1]?.value ?? "-";
  const pageFollowsArr = metrics.page_follows?.lifetime?.values || [];
  const page_follows = pageFollowsArr[pageFollowsArr.length - 1]?.value ?? "-";

  const reachDayArr = metrics?.page_impressions?.day?.values ?? [];
  const reachWeekArr = metrics?.page_impressions?.week?.values ?? [];
  const reachMonthArr = metrics?.page_impressions?.days_28?.values ?? [];
  const reachDay = reachDayArr[reachDayArr.length - 1]?.value ?? "-";
  const reachWeek = reachWeekArr[reachWeekArr.length - 1]?.value ?? "-";
  const reachMonth = reachMonthArr[reachMonthArr.length - 1]?.value ?? "-";

  const engagementDayArr = metrics?.page_post_engagements?.day?.values ?? [];
  const engagementWeekArr = metrics?.page_post_engagements?.week?.values ?? [];
  const engagementMonthArr =
    metrics?.page_post_engagements?.days_28?.values ?? [];
  const engagementDay =
    engagementDayArr[engagementDayArr.length - 1].value ?? "-";
  const engagementWeek =
    engagementWeekArr[engagementWeekArr.length - 1].value ?? "-";
  const engagementMonth =
    engagementMonthArr[engagementMonthArr.length - 1].value ?? "-";

  const ctaClicksDayArr = metrics?.page_total_actions?.day?.values ?? [];
  const ctaClicksWeekArr = metrics?.page_total_actions?.week?.values ?? [];
  const ctaClicksMonthArr = metrics?.page_total_actions?.days_28?.values ?? [];
  const ctaClicksDay = ctaClicksDayArr[ctaClicksDayArr.length - 1].value ?? "-";
  const ctaClicksWeek =
    ctaClicksWeekArr[ctaClicksWeekArr.length - 1].value ?? "-";
  const ctaClicksMonth =
    ctaClicksMonthArr[ctaClicksMonthArr.length - 1].value ?? "-";

  let recentPostDate = "-";

  const rawDate = recentPost?.data?.[0]?.created_time;

  if (rawDate) {
    const isoDateStr = rawDate.replace("+0000", "Z");
    const parsedDate = new Date(isoDateStr);

    if (!isNaN(parsedDate.getTime())) {
      recentPostDate = parsedDate.toLocaleString(); // or use a custom formatter
    }
  }

  return {
    platform,
    pageName,
    page_fans,
    page_follows,
    "Reach (day)": reachDay,
    "Reach (week)": reachWeek,
    "Reach (month)": reachMonth,
    "Engagement (day)": engagementDay,
    "Engagement (week)": engagementWeek,
    "Engagement (month)": engagementMonth,
    "CTA Clicks (day)": ctaClicksDay,
    "CTA Clicks (week)": ctaClicksWeek,
    "CTA Clicks (month)": ctaClicksMonth,
    engagement: reachMonth,
    last_post_date: recentPostDate,
  };
};

// New function to transform progressive data
const transformProgressiveFacebookData = (progressiveData: any): PlatformOverview | null => {
  if (!progressiveData) return null;

  const { pageInfo, metrics, recentPost, loadingMetrics } = progressiveData;

  const pageName = pageInfo?.name ?? "-";

  // Helper function to get metric value with loading state
  const getMetricValue = (metricName: string, period: string, defaultValue: any = "-") => {
    if (loadingMetrics?.includes(metricName)) {
      return "Loading...";
    }
    
    const metricData = metrics[metricName];
    if (!metricData || !metricData[period]) {
      return defaultValue;
    }
    
    const values = metricData[period].values;
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

  return {
    platform: progressiveData.platform || "Facebook",
    pageName,
    page_fans: getMetricValue("page_fans", "lifetime"),
    page_follows: getMetricValue("page_follows", "lifetime"),
    "Reach (day)": getMetricValue("page_impressions", "day"),
    "Reach (week)": getMetricValue("page_impressions", "week"),
    "Reach (month)": getMetricValue("page_impressions", "days_28"),
    "Engagement (day)": getMetricValue("page_post_engagements", "day"),
    "Engagement (week)": getMetricValue("page_post_engagements", "week"),
    "Engagement (month)": getMetricValue("page_post_engagements", "days_28"),
    "CTA Clicks (day)": getMetricValue("page_total_actions", "day"),
    "CTA Clicks (week)": getMetricValue("page_total_actions", "week"),
    "CTA Clicks (month)": getMetricValue("page_total_actions", "days_28"),
    engagement: getMetricValue("page_impressions", "days_28"),
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

  const result = {
    platform: "LinkedIn",
    pageName: linkedInData.organizationName || "Company Page", // Use actual company name
    page_fans: formatNumber(linkedInData.followers),
    page_follows: formatNumber(linkedInData.followers),
    "Reach (day)": formatNumber(linkedInData.impressionCount),
    "Reach (week)": formatNumber(linkedInData.impressionCount), // LinkedIn doesn't provide weekly breakdown
    "Reach (month)": formatNumber(linkedInData.impressionCount),
    "Engagement (day)": formatNumber(linkedInData.engagement),
    "Engagement (week)": formatNumber(linkedInData.engagement),
    "Engagement (month)": formatNumber(linkedInData.engagement),
    "CTA Clicks (day)": formatNumber(linkedInData.clickCount),
    "CTA Clicks (week)": formatNumber(linkedInData.clickCount),
    "CTA Clicks (month)": formatNumber(linkedInData.clickCount),
    engagement: formatNumber(linkedInData.engagement),
    last_post_date: "-", // LinkedIn posts are fetched separately
  };

  return result;
};

// New function to transform progressive LinkedIn data
const transformProgressiveLinkedInData = (progressiveData: any): PlatformOverview | null => {
  if (!progressiveData) return null;

  const { organizationName, followers, impressionCount, clickCount, engagement, loadingMetrics } = progressiveData;

  const pageName = organizationName || "Company Page";

  // Helper function to get metric value with loading state
  const getMetricValue = (metricName: string, defaultValue: any = "-") => {
    if (loadingMetrics?.includes(metricName)) {
      return "Loading...";
    }
    
    switch (metricName) {
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
    page_fans: formatNumber(getMetricValue("followers")),
    page_follows: formatNumber(getMetricValue("followers")),
    "Reach (day)": formatNumber(getMetricValue("impressions")),
    "Reach (week)": formatNumber(getMetricValue("impressions")), // LinkedIn doesn't provide weekly breakdown
    "Reach (month)": formatNumber(getMetricValue("impressions")),
    "Engagement (day)": formatNumber(getMetricValue("engagement")),
    "Engagement (week)": formatNumber(getMetricValue("engagement")),
    "Engagement (month)": formatNumber(getMetricValue("engagement")),
    "CTA Clicks (day)": formatNumber(getMetricValue("clicks")),
    "CTA Clicks (week)": formatNumber(getMetricValue("clicks")),
    "CTA Clicks (month)": formatNumber(getMetricValue("clicks")),
    engagement: formatNumber(getMetricValue("engagement")),
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
