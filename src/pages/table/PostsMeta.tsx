import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import TableContainer from "@common/TableContainer";

interface PlatformOverview {
  platform: string;
  pageName?: string;
  pageFollowersCity?: string;
  pageFollowersCountry?: string;
  pageFollowersValue?: number;
}

const transformMetaData = (meta: any): PlatformOverview | null => {
  if (!meta) return null;

  const {
    platform = "Facebook",
    pageInfo,
    metrics = {},
    recentPost = "-",
  } = meta;

  const pageName = pageInfo?.name ?? "-";
  const pageFansCityArr = metrics.page_fans_city?.day?.values || [];
  const pageFansCity = pageFansCityArr[pageFansCityArr.length - 1].value ?? "-";
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
      pageFollowersValue: 0,
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
    pageFollowersValue: value,
  };
};

const PostsMeta = ({ meta }: { meta: any }) => {
  const facebookData: PlatformOverview[] = [];

  const transformed = transformMetaData(meta?.metaStats ?? null);
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

  const title = "Top Performing Content Overview";

  const description = "Snapshot of each platform's performance";

  const columns = [
    {
      header: "Rank",
      enableColumnFilter: false,
      accessorKey: "Rank",
    },
    { header: "Platform", enableColumnFilter: false, accessorKey: "platform" },
    {
      header: "Page Name",
      enableColumnFilter: false,
      accessorKey: "pageName",
    },
    {
      header: "Date",
      enableColumnFilter: false,
      accessorKey: "Date",
    },
    {
      header: "Type",
      enableColumnFilter: false,
      accessorKey: "Type",
    },
    {
      header: "Caption (shortened)",
      enableColumnFilter: false,
      accessorKey: "Caption (shortened) ",
    },
    {
      header: "Impressions",
      enableColumnFilter: false,
      accessorKey: "Impressions",
    },
    {
      header: "Engagement Rate",
      enableColumnFilter: false,
      accessorKey: "Engagement Rate",
    },
    {
      header: "Link",
      enableColumnFilter: false,
      accessorKey: "Link",
    },
  ];

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header>
            <h5>{title}</h5>
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
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PostsMeta;
