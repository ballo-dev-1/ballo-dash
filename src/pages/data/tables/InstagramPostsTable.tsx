import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import instaIcon from "@/assets/images/socials/instagram.png";
import Image from "next/image";
import "@/assets/scss/data-page.scss";

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
  reactions: string;
  shares: number | string;
  likes: number | string;
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

      // Instagram insights structure is different from Facebook
      const post_reach = post?.insights?.impressions ?? "-";
      const comments = post?.insights?.comments_count || 0;
      const likes = post?.insights?.like_count || 0;
      const shares = post?.insights?.shares_count || 0;

      const engagement = likes + comments + shares;

      const reactions = [
        likes ? `❤️${likes}` : null,
        comments ? `💬${comments}` : null,
        shares ? `📤${shares}` : null,
      ]
        .filter(Boolean)
        .join(", ");

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
        reactions,
        shares,
        likes,
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

  const transformedData = Array.isArray(data?.posts)
    ? transformInstagramData(data?.posts)
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
      header: "Reactions",
      enableColumnFilter: false,
      accessorKey: "reactions",
    },
    {
      header: "Comments",
      enableColumnFilter: false,
      accessorKey: "comments",
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
