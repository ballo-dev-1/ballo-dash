import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";

interface OverviewAudienceProps {
  meta: any; // Replace `any` with a proper type if you know the shape of `meta`
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

  const { platform = "Facebook", pageInfo, metrics = {} } = meta;
  console.log(metrics);

  const pageName = pageInfo?.name ?? "-";
  const pageFansCityArr = Array.isArray(metrics.page_fans_city?.day?.values)
    ? metrics.page_fans_city.day.values
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
      pageFollowersCity: "-",
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

const OverviewAudience: React.FC<OverviewAudienceProps> = ({
  meta,
  isExpanded,
  onToggleExpand,
}) => {
  const [reachHeader, setReachHeader] = useState("Reach (week)");
  const [engagementHeader, setEngagementHeader] =
    useState("Engagement (month)");
  const [CTAClicksHeader, setCTAClicksHeader] = useState("CTA Clicks (month)");
  const facebookData: PlatformOverview[] = [];

  const transformed = transformMetaData(meta);
  if (transformed) {
    facebookData.push(transformed);
  }
  const linkedinData: { linkedinData: any }[] = [];
  const instagramData: { instagramData: any }[] = [];
  const xData: { xData: any }[] = [];
  const tiktokData: { tiktokData: any }[] = [];
  const websiteData: { websiteData: any }[] = [];
  const youtubeData: { youtubeData: any }[] = [];
  const whatsappData: { whatsappData: any }[] = [];

  const data = [
    ...facebookData,
    ...linkedinData,
    ...instagramData,
    ...xData,
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

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5>{title}</h5>

              <button onClick={onToggleExpand} className="expand-btn">
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
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
                loading={true}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OverviewAudience;
