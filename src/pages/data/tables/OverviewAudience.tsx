import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import { useSelector } from "react-redux";
import Image from "next/image";
import facebookIcon from "@/assets/images/socials/facebook.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import xIcon from "../../../assets/images/socials/X_icon.png";
import { 
  selectProgressiveFacebookStats,
  selectProgressiveFacebookStatus,
  selectProgressiveFacebookError,
  selectFacebookStats
} from "@/toolkit/facebookData/reducer";
import { 
  selectProgressiveLinkedInStats, 
  selectProgressiveLinkedInStatus,
  selectProgressiveLinkedInError 
} from "@/toolkit/linkedInData/reducer";
import { 
  selectInstagramStats
} from "@/toolkit/instagramData/reducer";
import { 
  selectProgressiveXStats
} from "@/toolkit/xData/reducer";

interface OverviewAudienceProps {
  facebook: any;
  linkedInData?: any;
  xData?: any;
  instagramDataProp?: any;
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

const transformFacebookData = (facebook: any): PlatformOverview | null => {
  if (!facebook) return null;

  const { platform, pageInfo, metrics = {} } = facebook;

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
const transformProgressiveFacebookData = (progressiveData: any): PlatformOverview | null => {
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

// Function to transform Instagram data for Audience view
const transformInstagramDataForAudience = (instagramData: any): PlatformOverview | null => {
  if (!instagramData) return null;

  console.log("📸 Transforming Instagram data for Audience:", instagramData);

  // Check if data is already in PlatformOverview format (has been transformed)
  if (instagramData && instagramData.platform && instagramData.pageName && typeof instagramData.platform === 'string') {
    // Data is already transformed, adapt it for audience view
    return {
      platform: "Instagram",
      pageName: instagramData.pageName,
      pageFollowersCity: "Global",
      pageFollowersCountry: "Global",
      pageLikesValue: instagramData.page_fans !== "-" ? instagramData.page_fans : "-",
    };
  }

  // Handle raw data structure
  const data = instagramData.data || instagramData;
  
  const username = data.userInfo?.username || "Unknown";
  const metrics = data.metrics || {};
  
  // Extract metrics
  const followers = metrics.followers || 0;
  const likes = metrics.likes || 0;    

  console.log("📸 Extracted Instagram metrics for Audience:", { username, followers, likes });

  return {
    platform: "Instagram",
    pageName: username || "Instagram Account",
    pageFollowersCity: "Global", // Instagram doesn't provide city breakdown
    pageFollowersCountry: "Global", // Instagram doesn't provide country breakdown
    pageLikesValue: followers ? followers.toLocaleString() : "-",
  };
};

const OverviewAudience: React.FC<OverviewAudienceProps> = ({
  facebook,
  linkedInData,
  xData,
  instagramDataProp,
  isExpanded,
  onToggleExpand,
}) => {
  // Get progressive data from Redux
  const progressiveFacebookData = useSelector(selectProgressiveFacebookStats);
  const progressiveFacebookStatus = useSelector(selectProgressiveFacebookStatus);
  const progressiveFacebookError = useSelector(selectProgressiveFacebookError);
  
  // Get regular Facebook data from Redux
  const facebookStats = useSelector(selectFacebookStats);
  
  const progressiveLinkedInData = useSelector(selectProgressiveLinkedInStats);
  const progressiveLinkedInStatus = useSelector(selectProgressiveLinkedInStatus);
  const progressiveLinkedInError = useSelector(selectProgressiveLinkedInError);
  const progressiveXData = useSelector(selectProgressiveXStats);
  const instagramStats = useSelector(selectInstagramStats);

  const [reachHeader, setReachHeader] = useState("Reach (week)");
  const [engagementHeader, setEngagementHeader] =
    useState("Engagement (month)");
  const [CTAClicksHeader, setCTAClicksHeader] = useState("CTA Clicks (month)");
  const facebookData: PlatformOverview[] = [];
  const linkedinDataArray: PlatformOverview[] = [];

    // Use progressive Facebook data if available, otherwise fall back to regular facebook data
  const transformedFacebook = progressiveFacebookData
    ? transformProgressiveFacebookData(progressiveFacebookData)
    : transformFacebookData(facebookStats || facebook);
    
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

  // Transform Instagram data for Audience view
  const transformedInstagram = instagramStats || instagramDataProp ? transformInstagramDataForAudience(instagramStats || instagramDataProp) : null;
  const instagramDataArray: PlatformOverview[] = [];
  if (transformedInstagram) {
    instagramDataArray.push(transformedInstagram);
  } else if (instagramStats || instagramDataProp) {
    console.log("📸 Instagram Data available but transformation failed:", instagramStats || instagramDataProp);
  } else {
    console.log("📸 No Instagram Data available");
  }
  
  // Transform X data
  const transformedX = progressiveXData 
    ? transformXData(progressiveXData)
    : xData ? transformXData(xData) : null;
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
    ...instagramDataArray,
    ...xDataArray,
    ...tiktokData,
    ...websiteData,
    ...youtubeData,
    ...whatsappData,
  ];

  const title = "Audience";

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
    const isLoading = progressiveFacebookStatus === "loading" || progressiveLinkedInStatus === "loading" ||
    (!progressiveFacebookData && !facebookStats?.metrics && !facebook?.metrics && !progressiveLinkedInData && !linkedInData);

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
