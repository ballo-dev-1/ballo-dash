import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import tiktokIcon from "@/assets/images/socials/tiktok.png";
import tableIcon from "@/assets/images/socials/table.png";
import Image from "next/image";
import "@/assets/scss/data-page.scss";

interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
  platform: "facebook" | "linkedin" | "instagram" | "tiktok";
  data: any;
  columns: any[];
  postData: any[];
  hasData: boolean;
  isLoading: boolean;
}

const GenericPostsTable: React.FC<Props> = ({
  isExpanded,
  onToggleExpand,
  platform,
  data,
  columns,
  postData,
  hasData,
  isLoading,
}) => {
  const title = platform.toLowerCase();

  const getPlatformIcon = () => {
    switch (title) {
      case "facebook":
        return facebookIcon;
      case "linkedin":
        return linkedinIcon;
      case "instagram":
        return instaIcon;
      case "tiktok":
        return tiktokIcon;
      default:
        return tableIcon;
    }
  };

  const getPlatformDisplayName = () => {
    switch (title) {
      case "facebook":
        return "Facebook";
      case "linkedin":
        return "LinkedIn";
      case "instagram":
        return "Instagram";
      case "tiktok":
        return "TikTok";
      default:
        return title;
    }
  };

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
                          alt={`${getPlatformDisplayName()} icon`}
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
                    src={getPlatformIcon()}
                    alt={`${getPlatformDisplayName()} icon`}
                    style={{ objectFit: "contain", width: 20, marginRight: 8 }}
                  />
                  {getPlatformDisplayName()}
                </div>
              </div>
            </Card.Header>
            <Card.Body className="table-border-style">
              <div className="overflow-hidden post-table">
                {!hasData && !isLoading ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No posts found for this {getPlatformDisplayName()} page.</p>
                    <small className="text-muted">
                      Make sure your {getPlatformDisplayName()} integration is connected and has posts.
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

export default GenericPostsTable;
