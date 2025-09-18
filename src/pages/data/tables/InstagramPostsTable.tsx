import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import instaIcon from "@/assets/images/socials/instagram.png";
import Image from "next/image";
import "@/assets/scss/data-page.scss";
import DateFilter, { DateRange } from "@/components/DateFilter";

interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
  data: any;
}

type InstagramRawPost = {
  id: string;
  message?: string; // Changed from caption to message
  created_time: string; // Changed from timestamp to created_time
  media_type: string;
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  insights?: any;
};

type InstagramTransformedPost = {
  created_time: string; // format: dd/mm/yyyy hh:mm
  message: string;
  truncatedMessage: string;
  post_reach: number | string;
  engagement: number | string;
  comments: number | string;
  shares: number | string;
  likes: number | string;
  saved: number | string;
  views: number | string;
  media_type: string;
  media_url?: string;
  permalink?: string;
};

function transformInstagramData(data: InstagramRawPost[]): InstagramTransformedPost[] {
  console.log('🚀🚀🚀transformInstagramData', data);
  return data
    .filter(
      (post): post is InstagramRawPost & { message: string; created_time: string } =>
        !!post.message && !!post.created_time
    )
    .map((post) => {
      const date = new Date(post.created_time);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

      // Use the insights data from the API
      const post_reach = post?.insights?.reach || post?.insights?.views || "-";
      const comments = post?.insights?.comments || 0;
      const likes = post?.insights?.likes || 0;
      const shares = post?.insights?.shares || 0;
      const saved = post?.insights?.saved || 0;
      const total_interactions = post?.insights?.total_interactions || 0;

      // Use total_interactions if available, otherwise calculate from individual metrics
      const engagement = total_interactions || (likes + comments + shares + saved);


      return {
        created_time: formattedDate,
        message: post.message,
        truncatedMessage:
          post.message.length > 50
            ? post.message.slice(0, 50) + "..."
            : post.message,
        post_reach,
        engagement,
        comments,
        shares,
        likes,
        saved,
        views: post?.insights?.views || "-",
        media_type: post.media_type,
        media_url: post.media_url,
        permalink: post.permalink,
      };
    });
}

const InstagramPostsTable: React.FC<Props> = ({
  isExpanded,
  onToggleExpand,
  data,
}) => {
  console.log("📸 InstagramPostsTable - Data:", data);

  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const transformedData = Array.isArray(data?.posts)
    ? transformInstagramData(data?.posts)
    : [];

  // Filter posts based on selected date range
  const filteredPostData = useMemo(() => {
    if (!dateRange || transformedData.length === 0) {
      return transformedData;
    }

    return transformedData.filter((post) => {
      // Parse the date from the formatted string (dd/mm/yyyy hh:mm)
      const [datePart, timePart] = post.created_time.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      
      const postDate = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      return postDate >= dateRange.startDate && postDate <= dateRange.endDate;
    });
  }, [transformedData, dateRange]);

  const postData = filteredPostData;
  
  // Check if we have valid data
  const hasData = postData.length > 0;
  const isLoading = !data || (data && !data.posts);

  const columns = [
    { header: "Date", enableColumnFilter: false, accessorKey: "created_time" },
    {
      header: "Content",
      enableColumnFilter: false,
      accessorKey: "truncatedMessage",
    },
    {
      header: "Media Type",
      enableColumnFilter: false,
      accessorKey: "media_type",
    },
    {
      header: "Reach",
      enableColumnFilter: false,
      accessorKey: "post_reach",
    },
    {
      header: "Engagement",
      enableColumnFilter: false,
      accessorKey: "engagement",
    },
    {
      header: "Comments",
      enableColumnFilter: false,
      accessorKey: "comments",
    },
    {
      header: "Shares",
      enableColumnFilter: false,
      accessorKey: "shares",
    },
    {
      header: "Likes",
      enableColumnFilter: false,
      accessorKey: "likes",
    },
    {
      header: "Saved",
      enableColumnFilter: false,
      accessorKey: "saved",
    },
    {
      header: "Views",
      enableColumnFilter: false,
      accessorKey: "views",
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-end pb-2">
                <button
                  onClick={onToggleExpand}
                  className="expand-btn"
                  style={{ margin: "-0.5rem -0.5rem 0 0" }}
                >
                  {isExpanded ? (
                    <Minimize2 size={12} />
                  ) : (
                    <Maximize2 size={12} />
                  )}
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <h5>
                  {data?.pageInfo?.name && (
                    <div>
                      {data?.pageInfo?.profilePicture && (
                        <img
                          src={data?.pageInfo?.profilePicture}
                          alt="Instagram account icon"
                          className="rounded-circle"
                          style={{
                            objectFit: "contain",
                            width: 25,
                            marginRight: 8,
                          }}
                        />
                      )}
                      <span className="">{data?.pageInfo?.name}</span>
                    </div>
                  )}
                </h5>

                <div className="d-flex justify-content-center align-items-center">
                  <Image
                    src={instaIcon}
                    alt="Instagram icon"
                    style={{ objectFit: "contain", width: 20, marginRight: 8 }}
                  />
                  Instagram
                </div>
              </div>
            </Card.Header>
            <Card.Body className="table-border-style">
              {/* Date Filter */}
              <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <DateFilter 
                  onDateRangeChange={setDateRange}
                  className="date-filter-instagram"
                />
              </div>
              
              <div className="overflow-hidden post-table">
                {!hasData && !isLoading ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No posts found for this Instagram account.</p>
                    <small className="text-muted">
                      Make sure your Instagram integration is connected and has posts.
                    </small>
                  </div>
                ) : (
                  <TableContainer
                    columns={columns || []}
                    data={postData || []}
                    isGlobalFilter={true}
                    isBordered={false}
                    customPageSize={5}
                    isPagination={true}
                    loading={isLoading}
                  />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default InstagramPostsTable;
