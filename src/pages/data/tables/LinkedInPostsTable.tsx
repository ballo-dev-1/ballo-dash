import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import Image from "next/image";
import "@/assets/scss/data-page.scss";
import DateFilter, { DateRange } from "@/components/DateFilter";

interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
  data: any;
  isLoading?: boolean;
}

type LinkedInRawPost = {
  id: string;
  message: string;
  created_time: string;
  media_type: string;
  media_url?: string;
  permalink?: string;
  author?: any;
  visibility?: any;
  lifecycleState?: string;
  specificContent?: any;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  clicks: number;
  uniqueImpressions: number;
  engagement: number;
};

type LinkedInTransformedPost = {
  created_time: string; // format: dd/mm/yyyy hh:mm
  message: string;
  truncatedMessage: string;
  post_reach: number | string;
  engagement: number | string;
  comments: number | string;
  reactions: string;
  shares: number | string;
  likes: number | string;
  media_type: string;
  media_url?: string;
  permalink?: string;
  views: number | string;
  clicks: number | string;
  uniqueImpressions: number | string;
  engagementRate: number | string;
};

function transformLinkedInData(data: LinkedInRawPost[]): LinkedInTransformedPost[] {
  console.log('🔗🔗🔗transformLinkedInData', data);
  return data
    .filter(
      (post): post is LinkedInRawPost & { message: string; created_time: string } =>
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

      // LinkedIn metrics from insights API
      const post_reach = post.uniqueImpressions || post.views || "-";
      const comments = post.comments || 0;
      const likes = post.likes || 0;
      const shares = post.shares || 0;
      const clicks = post.clicks || 0;
      const uniqueImpressions = post.uniqueImpressions || 0;
      
      // Calculate engagement rate as percentage
      const engagementRate = uniqueImpressions > 0 
        ? ((likes + comments + shares) / uniqueImpressions * 100).toFixed(2) + '%'
        : '0%';

      const engagement = likes + comments + shares;

      // Reactions will be handled in the cell renderer
      const reactions = "";

      // Determine media type based on content
      let mediaType = post.media_type || "TEXT";
      if (post.media_url) {
        if (post.media_url.includes('video') || post.media_type === 'VIDEO') {
          mediaType = "VIDEO";
        } else if (post.media_url.includes('image') || post.media_type === 'IMAGE') {
          mediaType = "IMAGE";
        }
      }

      return {
        created_time: formattedDate,
        message: post.message,
        truncatedMessage:
          post.message.length > 100
            ? post.message.slice(0, 100) + "..."
            : post.message,
        post_reach,
        engagement,
        comments,
        reactions,
        shares,
        likes,
        views: post.views || 0,
        clicks,
        uniqueImpressions,
        engagementRate,
        media_type: mediaType,
        media_url: post.media_url,
        permalink: post.permalink,
      };
    });
}

const LinkedInPostsTable: React.FC<Props> = ({
  isExpanded,
  onToggleExpand,
  data,
  isLoading: externalLoading = false,
}) => {
  console.log("🔗 LinkedInPostsTable - Data:", data);
  console.log("🔗 LinkedInPostsTable - External Loading:", externalLoading);

  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const transformedData = Array.isArray(data?.posts)
    ? transformLinkedInData(data?.posts)
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
  // Use external loading state if provided, otherwise fall back to data-based logic
  const isLoading = externalLoading || !data;
  
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
      header: "Impressions",
      enableColumnFilter: false,
      accessorKey: "views",
    },
    {
      header: "Unique Reach",
      enableColumnFilter: false,
      accessorKey: "uniqueImpressions",
    },
    {
      header: "Clicks",
      enableColumnFilter: false,
      accessorKey: "clicks",
    },
    {
      header: "Engagement Rate",
      enableColumnFilter: false,
      accessorKey: "engagementRate",
    },
    {
      header: "Total Engagement",
      enableColumnFilter: false,
      accessorKey: "engagement",
    },
    {
      header: "Reactions",
      enableColumnFilter: false,
      accessorKey: "reactions",
      cell: ({ row }: any) => {
        const post = row.original;
        const likes = post.likes || 0;
        const comments = post.comments || 0;
        const shares = post.shares || 0;
        
        return (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {likes > 0 && (
              <span style={{
                backgroundColor: 'lightgoldenrodyellow',
                color: 'black',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                👍 {likes}
              </span>
            )}
            {comments > 0 && (
              <span style={{
                backgroundColor: '#e3f2fd',
                color: '#1565c0',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                💬 {comments}
              </span>
            )}
            {shares > 0 && (
              <span style={{
                backgroundColor: '#f3e5f5',
                color: '#7b1fa2',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                🔄 {shares}
              </span>
            )}
            {likes === 0 && comments === 0 && shares === 0 && (
              <span style={{ color: '#999', fontSize: '12px' }}>-</span>
            )}
          </div>
        );
      },
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

              <div className="d-flex justify-content-between align-items-center" style={{ maxHeight: "0.5rem" }}>
                <h5>
                  {data?.pageInfo?.name && (
                    <div>
                      {data?.pageInfo?.profilePicture && (
                        <img
                          src={data?.pageInfo?.profilePicture}
                          alt="LinkedIn organization icon"
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
                    src={linkedinIcon}
                    alt="LinkedIn icon"
                    style={{ objectFit: "contain", width: 20, marginRight: 8 }}
                  />
                  LinkedIn
                </div>
              </div>
            </Card.Header>
            <Card.Body className="table-border-style">
              {/* Date Filter */}
              <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <DateFilter 
                  onDateRangeChange={setDateRange}
                  className="date-filter-linkedin"
                />
              </div>
              
              <div className="overflow-hidden post-table">
                {!hasData && !isLoading ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No posts found for this LinkedIn organization.</p>
                    <small className="text-muted">
                      Make sure your LinkedIn integration is connected and has posts.
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

export default LinkedInPostsTable;
