import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import { useSelector } from "react-redux";
import { 
  selectProgressiveMetaStats, 
  selectProgressiveMetaStatus,
  selectProgressiveMetaError 
} from "@/toolkit/metaData/reducer";
import { 
  selectProgressiveLinkedInStats, 
  selectProgressiveLinkedInStatus,
  selectProgressiveLinkedInError 
} from "@/toolkit/linkedInData/reducer";

interface OverviewAudienceProps {
  meta: any;
  linkedInData?: any;
  xData?: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface PlatformOverview {
  platform: string;
  pageName?: string;
  pageFollowersCity?: string;
  pageFollowersCountry?: string;
  pageLikesValue?: number | string;
}

const transformMetaData = (meta: any): PlatformOverview | null => {
  if (!meta) return null;

  const { platform, pageInfo, metrics = {} } = meta;

  const pageName = pageInfo?.name ?? "-";
  const pageFansCityArr = Array.isArray(metrics.page_fans_city?.day?.values)
    ? metrics.page_fans_city?.day?.values
    : [];

  const lastEntry = pageFansCityArr[pageFansCityArr.length - 1];
  const pageFansCity = lastEntry?.value ?? "-";

  if (
    pageFansCity === "-" ||
    typeof pageFansCity !== "object" ||
    pageFansCity === null
  ) {
    return {
      platform,
      pageName,
      pageFollowersCity: pageFansCity,
      pageFollowersCountry: "-",
      pageLikesValue: "-",
    };
  }

  const pageFansCityData = pageFansCity as Record<string, number>;

  const maxEntry = Object.entries(pageFansCityData).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max
  );

  const [location, value] = maxEntry;
  const [city, country] = location.split(", ").slice(-2);

  return {
    platform,
    pageName,
    pageFollowersCity: city,
    pageFollowersCountry: country,
    pageLikesValue: value,
  };
};

// New function to transform progressive Facebook data
const transformProgressiveMetaData = (progressiveData: any): PlatformOverview | null => {
  if (!progressiveData) return null;

  const { pageInfo, metrics, loadingMetrics } = progressiveData;

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

  // Get page_fans_city data
  const pageFansCity = getMetricValue("page_fans_city", "day");

  if (
    pageFansCity === "Loading..." ||
    pageFansCity === "-" ||
    typeof pageFansCity !== "object" ||
    pageFansCity === null
  ) {
    return {
      platform: progressiveData.platform || "Facebook",
      pageName,
      pageFollowersCity: pageFansCity,
      pageFollowersCountry: "-",
      pageLikesValue: "-",
    };
  }

  const pageFansCityData = pageFansCity as Record<string, number>;

  const maxEntry = Object.entries(pageFansCityData).reduce((max, entry) =>
    entry[1] > max[1] ? entry : max
  );

  const [location, value] = maxEntry;
  const [city, country] = location.split(", ").slice(-2);

  return {
    platform: progressiveData.platform || "Facebook",
    pageName,
    pageFollowersCity: city,
    pageFollowersCountry: country,
    pageLikesValue: value,
  };
};

// New function to transform progressive LinkedIn data
const transformProgressiveLinkedInData = (progressiveData: any): PlatformOverview | null => {
  if (!progressiveData) return null;

  const { organizationName, followers, loadingMetrics } = progressiveData;

  const pageName = organizationName || "Company Page";

  // Helper function to get metric value with loading state
  const getMetricValue = (metricName: string, defaultValue: any = "-") => {
    if (loadingMetrics?.includes(metricName)) {
      return "Loading...";
    }
    
    switch (metricName) {
      case "followers":
        return followers || defaultValue;
      default:
        return defaultValue;
    }
  };

  // For LinkedIn audience data, we'll show the followers count and location info
  // LinkedIn doesn't provide city/country breakdown in the same way as Facebook
  return {
    platform: "LinkedIn",
    pageName,
    pageFollowersCity: "Global", // LinkedIn doesn't provide city breakdown
    pageFollowersCountry: "Global", // LinkedIn doesn't provide country breakdown
    pageLikesValue: getMetricValue("followers"),
  };
};

const OverviewAudience: React.FC<OverviewAudienceProps> = ({
  meta,
  linkedInData,
  xData,
  isExpanded,
  onToggleExpand,
}) => {
  // Get progressive data from Redux
  const progressiveMetaData = useSelector(selectProgressiveMetaStats);
  const progressiveMetaStatus = useSelector(selectProgressiveMetaStatus);
  const progressiveMetaError = useSelector(selectProgressiveMetaError);
  
  const progressiveLinkedInData = useSelector(selectProgressiveLinkedInStats);
  const progressiveLinkedInStatus = useSelector(selectProgressiveLinkedInStatus);
  const progressiveLinkedInError = useSelector(selectProgressiveLinkedInError);

  const [reachHeader, setReachHeader] = useState("Reach (week)");
  const [engagementHeader, setEngagementHeader] =
    useState("Engagement (month)");
  const [CTAClicksHeader, setCTAClicksHeader] = useState("CTA Clicks (month)");
  const facebookData: PlatformOverview[] = [];
  const linkedinDataArray: PlatformOverview[] = [];

  // Use progressive Facebook data if available, otherwise fall back to regular meta data
  const transformedFacebook = progressiveMetaData 
    ? transformProgressiveMetaData(progressiveMetaData)
    : transformMetaData(meta);
    
  if (transformedFacebook) {
    facebookData.push(transformedFacebook);
  }

  // Use progressive LinkedIn data if available, otherwise fall back to regular LinkedIn data
  const transformedLinkedIn = progressiveLinkedInData 
    ? transformProgressiveLinkedInData(progressiveLinkedInData)
    : linkedInData ? {
        platform: "LinkedIn",
        pageName: linkedInData.organizationName || "Company Page",
        pageFollowersCity: "Global",
        pageFollowersCountry: "Global", 
        pageLikesValue: linkedInData.followers ? linkedInData.followers.toLocaleString() : "-"
      } : null;

  if (transformedLinkedIn) {
    linkedinDataArray.push(transformedLinkedIn);
  }

  const instagramData: { instagramData: any }[] = [];
  
  // Transform X data
  const transformedX = xData ? transformXData(xData) : null;
  const xDataArray: PlatformOverview[] = [];
  if (transformedX) {
    xDataArray.push(transformedX);
  }
  
  const tiktokData: { tiktokData: any }[] = [];
  const websiteData: { websiteData: any }[] = [];
  const youtubeData: { youtubeData: any }[] = [];
  const whatsappData: { whatsappData: any }[] = [];

  const data = [
    ...facebookData,
    ...linkedinDataArray,
    ...instagramData,
    ...xDataArray,
    ...tiktokData,
    ...websiteData,
    ...youtubeData,
    ...whatsappData,
  ];

  const title = "Audience";

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
      header: "Top City",
      enableColumnFilter: false,
      accessorKey: "pageFollowersCity",
    },
    {
      header: "Top Country",
      enableColumnFilter: false,
      accessorKey: "pageFollowersCountry",
    },
    {
      header: "Likes",
      enableColumnFilter: false,
      accessorKey: "pageLikesValue",
    },
  ];

  // Determine loading state
  const isLoading = progressiveMetaStatus === "loading" || progressiveLinkedInStatus === "loading" || 
                   (!progressiveMetaData && !meta?.metrics && !progressiveLinkedInData && !linkedInData);

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

// Function to transform X data
const transformXData = (xData: any): PlatformOverview | null => {
  if (!xData) return null;

  console.log("🐦 Transforming X data for Audience:", xData);

  // Handle both direct data and nested data structure
  const data = xData.data || xData;
  
  const username = data.username || "Unknown";
  const name = data.name || username;
  
  // Extract metrics directly from the data structure (not nested under public_metrics)
  const followers = data.followers || 0;
  const likes = data.likeCount || 0;    

  console.log("🐦 Extracted X metrics for Audience:", { username, name, followers });

  return {
    platform: "X (Twitter)",
    pageName: name || username || "X Account",
    pageFollowersCity: "Global",
    pageFollowersCountry: "Global",
    pageLikesValue: followers ? followers.toLocaleString() : "-",
  };
};

export default OverviewAudience;
