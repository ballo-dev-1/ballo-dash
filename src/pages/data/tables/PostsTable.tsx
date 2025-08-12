import { apimethod } from "@/Common/JsonData";
import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import tiktokIcon from "@/assets/images/socials/tiktok.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import tableIcon from "@/assets/images/socials/table.png";
import Image from "next/image";
import "@/assets/scss/data-page.scss";
import { Engagement } from "next/font/google";

interface Props {
  // meta: any; // Replace `any` with a proper type if you know the shape of `meta`
  isExpanded: boolean;
  onToggleExpand: () => void;
  platform: "facebook" | "linkedin" | "instagram" | "tiktok";
  data: any;
}

type RawPost = {
  created_time: string;
  message?: string;
  story?: string;
  id: string;
  insights?: any;
};

type TransformedPost = {
  created_time: string; // format: dd/mm/yyyy hh:mm
  message: string;
  truncatedMessage: string;
  post_reach: number | string;
};

function transformData(data: RawPost[]): TransformedPost[] {
  let reactions = "";
  return data
    .filter(
      (post): post is RawPost & { message: string; created_time: string } =>
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

      const likes = post?.insights?.post_reactions_like_total;

      const loves = post?.insights?.post_reactions_love_total;

      const wows = post?.insights?.post_reactions_wow_total;

      const hahas = post?.insights?.post_reactions_haha_total;

      const sorries = post?.insights?.post_reactions_sorry_total;

      const angers = post?.insights?.post_reactions_anger_total;

      let engagement =
        likes + comments + shares + loves + wows + hahas + sorries + angers;

      const reactions = [
        likes ? `👍${likes}` : null,
        loves ? `❤️${loves}` : null,
        hahas ? `😂${hahas}` : null,
        wows ? `😮${wows}` : null,
        sorries ? `😢${sorries}` : null,
        angers ? `😡${angers}` : null,
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
      };
    });
}

const PostsTable: React.FC<Props> = ({
  isExpanded,
  onToggleExpand,
  platform,
  data,
}) => {
  // console.log(data);

  const transformedData = Array.isArray(data?.posts)
    ? transformData(data?.posts)
    : [];

  const postData = transformedData;

  const title =
    typeof platform === "string" ? platform.toLocaleLowerCase() : "facebook";

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
                          alt={`${title} icon`}
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
                    src={
                      title === "facebook"
                        ? facebookIcon
                        : title === "linkedin"
                        ? linkedinIcon
                        : tableIcon
                    }
                    alt={`${title} icon`}
                    style={{ objectFit: "contain", width: 20, marginRight: 8 }}
                  />
                  {title}
                </div>
              </div>
            </Card.Header>
            <Card.Body className="table-border-style">
              <div className="overflow-hidden post-table">
                <TableContainer
                  columns={columns || []}
                  data={postData || []}
                  isGlobalFilter={true}
                  isBordered={false}
                  customPageSize={5}
                  isPagination={true}
                  loading={postData.length < 1}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default PostsTable;
