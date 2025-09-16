import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import facebookIcon from "@/assets/images/socials/facebook.png";
import Image from "next/image";
import "@/assets/scss/data-page.scss";

interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
  data: any;
  isLoading?: boolean;
}

type FacebookRawPost = {
  created_time: string;
  message?: string;
  story?: string;
  id: string;
  insights?: any;
};

type FacebookTransformedPost = {
  created_time: string; // format: dd/mm/yyyy hh:mm
  message: string;
  truncatedMessage: string;
  post_reach: number | string;
  engagement: number | string;
  comments: number | string;
  reactions: string;
  shares: number | string;
  likes: number | string;
  loves: number | string;
  wows: number | string;
  hahas: number | string;
  sorries: number | string;
  angers: number | string;
};

function transformFacebookData(data: FacebookRawPost[]): FacebookTransformedPost[] {
  return data
    .filter(
      (post): post is FacebookRawPost & { message: string; created_time: string } =>
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

      const post_reach = post?.insights?.post_impressions ?? "-";
      const comments = post?.insights?.comment || 0;
      const shares = post?.insights?.share || 0;
      const likes = post?.insights?.post_reactions_like_total || 0;
      const loves = post?.insights?.post_reactions_love_total || 0;
      const wows = post?.insights?.post_reactions_wow_total || 0;
      const hahas = post?.insights?.post_reactions_haha_total || 0;
      const sorries = post?.insights?.post_reactions_sorry_total || 0;
      const angers = post?.insights?.post_reactions_anger_total || 0;

      const engagement = likes + comments + shares + loves + wows + hahas + sorries + angers;

      // Reactions will be handled in the cell renderer
      const reactions = "";

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
        loves,
        wows,
        hahas,
        sorries,
        angers,
      };
    });
}

const FacebookPostsTable: React.FC<Props> = ({
  isExpanded,
  onToggleExpand,
  data,
  isLoading: externalLoading = false,
}) => {
  console.log("📘 FacebookPostsTable - Data:", data);
  console.log("📘 FacebookPostsTable - External Loading:", externalLoading);

  const transformedData = Array.isArray(data?.posts)
    ? transformFacebookData(data?.posts)
    : [];

  const postData = transformedData;
  
  // Check if we have valid data
  const hasData = postData.length > 0;
  // Use external loading state if provided, otherwise fall back to data-based logic
  const isLoading = externalLoading || (!data || (data && !data.posts));

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
      cell: ({ row }: any) => {
        const post = row.original;
        const likes = post.likes || 0;
        const loves = post.loves || 0;
        const hahas = post.hahas || 0;
        const wows = post.wows || 0;
        const sorries = post.sorries || 0;
        const angers = post.angers || 0;
        
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
            {loves > 0 && (
              <span style={{
                backgroundColor: '#ffd9d9',
                color: 'black',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                ❤️ {loves}
              </span>
            )}
            {hahas > 0 && (
              <span style={{
                backgroundColor: '#ffd93d',
                color: '#8b5a00',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                😂 {hahas}
              </span>
            )}
            {wows > 0 && (
              <span style={{
                backgroundColor: '#ff9ff3',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                😮 {wows}
              </span>
            )}
            {sorries > 0 && (
              <span style={{
                backgroundColor: '#a8e6cf',
                color: '#2d5a3d',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                😢 {sorries}
              </span>
            )}
            {angers > 0 && (
              <span style={{
                backgroundColor: '#ff4757',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                😡 {angers}
              </span>
            )}
            {likes === 0 && loves === 0 && hahas === 0 && wows === 0 && sorries === 0 && angers === 0 && (
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

              <div className="d-flex justify-content-between align-items-center">
                <h5>
                  {data?.pageInfo?.name && (
                    <div>
                      {data?.pageInfo?.profilePicture && (
                        <img
                          src={data?.pageInfo?.profilePicture}
                          alt="Facebook page icon"
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
                    src={facebookIcon}
                    alt="Facebook icon"
                    style={{ objectFit: "contain", width: 20, marginRight: 8 }}
                  />
                  Facebook
                </div>
              </div>
            </Card.Header>
            <Card.Body className="table-border-style">
              <div className="overflow-hidden post-table">
                {!hasData && !isLoading ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No posts found for this Facebook page.</p>
                    <small className="text-muted">
                      Make sure your Facebook integration is connected and has posts.
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

export default FacebookPostsTable;