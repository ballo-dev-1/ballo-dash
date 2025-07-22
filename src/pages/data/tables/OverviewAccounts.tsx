import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";

interface OverviewAccountsProps {
  meta: any; // Replace `any` with a proper type if you know the shape of `meta`
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface PlatformOverview {
  platform: string;
  pageName?: string;
  page_fans?: number;
  page_follows?: number;
  "Reach (day)"?: number;
  "Reach (week)"?: number;
  "Reach (month)"?: number;
  "Engagement (day)"?: number;
  "Engagement (week)"?: number;
  "Engagement (month)"?: number;
  "CTA Clicks (day)"?: number;
  "CTA Clicks (week)"?: number;
  "CTA Clicks (month)"?: number;
  engagement?: number;
  Clicks?: number;
  last_post_date?: Date | string;
}

const transformMetaData = (meta: any): PlatformOverview | null => {
  if (!meta) return null;

  const { platform = "-", pageInfo, metrics = {}, recentPost = "-" } = meta;

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
    engagementDayArr[engagementDayArr.length - 1]?.value ?? "-";
  const engagementWeek =
    engagementWeekArr[engagementWeekArr.length - 1]?.value ?? "-";
  const engagementMonth =
    engagementMonthArr[engagementMonthArr.length - 1]?.value ?? "-";

  const ctaClicksDayArr = metrics?.page_total_actions?.day?.values ?? [];
  const ctaClicksWeekArr = metrics?.page_total_actions?.week?.values ?? [];
  const ctaClicksMonthArr = metrics?.page_total_actions?.days_28?.values ?? [];
  const ctaClicksDay =
    ctaClicksDayArr[ctaClicksDayArr.length - 1]?.value ?? "-";
  const ctaClicksWeek =
    ctaClicksWeekArr[ctaClicksWeekArr.length - 1]?.value ?? "-";
  const ctaClicksMonth =
    ctaClicksMonthArr[ctaClicksMonthArr.length - 1]?.value ?? "-";

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

const OverviewAccounts: React.FC<OverviewAccountsProps> = ({
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
  if (meta?.metrics && transformed) {
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
                loading={!meta?.metrics}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OverviewAccounts;
