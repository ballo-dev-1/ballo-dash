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
  selectProgressiveLinkedInStats
} from "@/toolkit/linkedInData/reducer";
import DataTransformationService, { PlatformOverview } from "@/services/dataTransformationService";

interface OverviewAccountsProps {
  meta: any;
  linkedInData?: any;
  xData?: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const transformMetaData = (meta: any): PlatformOverview | null => {
  return DataTransformationService.getInstance().transformMetaData(meta);
};

const transformProgressiveMetaData = (progressiveData: any): PlatformOverview | null => {
  return DataTransformationService.getInstance().transformProgressiveMetaData(progressiveData);
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

const OverviewAccounts: React.FC<OverviewAccountsProps> = ({
  meta,
  linkedInData,
  xData,
  isExpanded,
  onToggleExpand,
}) => {


  // Get progressive data from Redux
  const progressiveData = useSelector(selectProgressiveMetaStats);
  const progressiveStatus = useSelector(selectProgressiveMetaStatus);
  const progressiveError = useSelector(selectProgressiveMetaError);
  
  const progressiveLinkedInData = useSelector(selectProgressiveLinkedInStats);



  const [reachHeader, setReachHeader] = useState("Reach (week)");
  const [engagementHeader, setEngagementHeader] =
    useState("Engagement (month)");
  const [CTAClicksHeader, setCTAClicksHeader] = useState("CTA Clicks (month)");
  const facebookData: PlatformOverview[] = [];
  const linkedinDataArray: PlatformOverview[] = [];

  // Use progressive Facebook data if available, otherwise fall back to regular meta data
  const transformed = progressiveData 
    ? transformProgressiveMetaData(progressiveData)
    : transformMetaData(meta);
    
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
  
  // Transform X data
  const transformedX = xData ? transformXData(xData) : null;
  const xDataArray: PlatformOverview[] = [];
  if (transformedX) {
    xDataArray.push(transformedX);

  } else if (xData) {
    console.log("🐦 X Data available but transformation failed:", xData);
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
    ...instagramData,
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
                   (!progressiveData && !meta?.metrics && !progressiveLinkedInData && !linkedInData);

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
