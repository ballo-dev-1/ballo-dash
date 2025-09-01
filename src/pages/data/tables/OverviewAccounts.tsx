import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import { useSelector } from "react-redux";
import { 
  selectProgressiveFacebookStats,
  selectProgressiveFacebookStatus,
  selectProgressiveFacebookError,
  selectFacebookStats
} from "@/toolkit/facebookData/reducer";
import { 
  selectProgressiveLinkedInStats
} from "@/toolkit/linkedInData/reducer";
import { 
  selectInstagramStats
} from "@/toolkit/instagramData/reducer";
import { 
  selectProgressiveXStats
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
  return DataTransformationService.getInstance().transformFacebookData(facebook);
};

const transformProgressiveFacebookData = (progressiveData: any): PlatformOverview | null => {
  return DataTransformationService.getInstance().transformProgressiveFacebookData(progressiveData);
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

const OverviewAccounts: React.FC<OverviewAccountsProps> = ({
  facebook,
  linkedInData,
  xData,
  instagramDataProp,
  isExpanded,
  onToggleExpand,
}) => {


  // Get progressive data from Redux
  const progressiveData = useSelector(selectProgressiveFacebookStats);
  const progressiveStatus = useSelector(selectProgressiveFacebookStatus);
  const progressiveError = useSelector(selectProgressiveFacebookError);
  
  // Get regular Facebook data from Redux
  const facebookStats = useSelector(selectFacebookStats);
  
  const progressiveLinkedInData = useSelector(selectProgressiveLinkedInStats);
  const progressiveXData = useSelector(selectProgressiveXStats);
  const instagramStats = useSelector(selectInstagramStats);



  const [reachHeader, setReachHeader] = useState("Reach (week)");
  const [engagementHeader, setEngagementHeader] =
    useState("Engagement (month)");
  const [CTAClicksHeader, setCTAClicksHeader] = useState("CTA Clicks (month)");
  const facebookData: PlatformOverview[] = [];
  const linkedinDataArray: PlatformOverview[] = [];

  // Use progressive Facebook data if available, otherwise fall back to regular facebook data
  const transformed = progressiveData 
    ? transformProgressiveFacebookData(progressiveData)
    : transformFacebookData(facebookStats || facebook);
    
  // Debug logging
  console.log("🔍 Facebook Data Debug in OverviewAccounts:");
  console.log("  - progressiveData:", progressiveData);
  console.log("  - facebookStats:", facebookStats);
  console.log("  - facebook prop:", facebook);
  console.log("  - transformed:", transformed);
  console.log("  - facebookData array:", facebookData);
    
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

  // Transform Instagram data
  const transformedInstagram = instagramStats || instagramDataProp ? transformInstagramData(instagramStats || instagramDataProp) : null;
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
    ? transformProgressiveXData(progressiveXData)
    : xData ? transformXData(xData) : null;
  const xDataArray: PlatformOverview[] = [];
  if (transformedX) {
    xDataArray.push(transformedX);
  } else if (progressiveXData || xData) {
    console.log("🐦 X Data available but transformation failed:", progressiveXData || xData);
  } else {
    console.log("🐦 No X Data available");
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
