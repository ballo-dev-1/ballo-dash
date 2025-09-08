import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";
// import xIcon from "@/assets/images/socials/x.png"; // X icon not available
import Image from "next/image";
import "@/assets/scss/data-page.scss";

interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
  data: any;
}

type XRawPost = {
  id: string;
  message: string;
  created_time: string;
  media_type: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    impression_count: number;
  };
};

type XTransformedPost = {
  created_time: string; // format: dd/mm/yyyy hh:mm
  message: string;
  truncatedMessage: string;
  post_reach: number | string;
  engagement: number | string;
  comments: number | string;
  reactions: string;
  shares: number | string;
  likes: number | string;
  retweets: number | string;
  quotes: number | string;
  impressions: number | string;
  media_type: string;
  permalink: string;
};

function transformXData(data: XRawPost[]): XTransformedPost[] {
  console.log('🐦🐦🐦transformXData', data);
  return data
    .filter(
      (post): post is XRawPost & { message: string; created_time: string } =>
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

      const likes = post.public_metrics?.like_count || 0;
      const retweets = post.public_metrics?.retweet_count || 0;
      const replies = post.public_metrics?.reply_count || 0;
      const quotes = post.public_metrics?.quote_count || 0;
      const impressions = post.public_metrics?.impression_count || 0;
      const engagement = likes + retweets + replies + quotes;

      return {
        created_time: formattedDate,
        message: post.message,
        truncatedMessage: post.message.length > 100 
          ? `${post.message.substring(0, 100)}...` 
          : post.message,
        post_reach: impressions || "-",
        engagement: engagement || "-",
        comments: replies || "-",
        reactions: likes ? `❤️ ${likes}` : "-",
        shares: retweets || "-",
        likes: likes || "-",
        retweets: retweets || "-",
        quotes: quotes || "-",
        impressions: impressions || "-",
        media_type: post.media_type || "TEXT",
        permalink: `https://x.com/i/web/status/${post.id}`
      };
    });
}

const XPostsTable: React.FC<Props> = ({
  isExpanded,
  onToggleExpand,
  data,
}) => {
  console.log("🐦 XPostsTable - Data:", data);

  const transformedData = Array.isArray(data?.posts)
    ? transformXData(data?.posts)
    : [];

  const postData = transformedData;
  
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
      header: "Reactions",
      enableColumnFilter: false,
      accessorKey: "reactions",
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
      header: "Retweets",
      enableColumnFilter: false,
      accessorKey: "retweets",
    },
    {
      header: "Quotes",
      enableColumnFilter: false,
      accessorKey: "quotes",
    },
    {
      header: "Impressions",
      enableColumnFilter: false,
      accessorKey: "impressions",
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
                          alt="X account icon"
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
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#000",
                      color: "#fff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginRight: 8,
                    }}
                  >
                    X
                  </div>
                  X
                </div>
              </div>
            </Card.Header>
            <Card.Body className="table-border-style">
              <div className="overflow-hidden post-table">
                {!hasData && !isLoading ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No posts found for this X account.</p>
                    <small className="text-muted">
                      Make sure your X integration is connected and has posts.
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

export default XPostsTable;
