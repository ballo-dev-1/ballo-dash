import TableContainer from "@/Common/TableContainer";
import { Maximize2, Minimize2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import tiktokIcon from "@/assets/images/socials/tiktok.png";
import tableIcon from "@/assets/images/socials/table.png";
import Image from "next/image";
import "@/assets/scss/data-page.scss";
import DateFilter, { DateRange } from "@/components/DateFilter";

interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
  platform: "facebook" | "linkedin" | "instagram" | "tiktok";
  data: any;
  columns: any[];
  postData: any[];
  hasData: boolean;
  isLoading: boolean;
  enableDateFilter?: boolean;
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
  enableDateFilter = false,
}) => {
  const title = platform?.toLowerCase() || 'unknown';
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  // Filter posts based on selected date range (only if date filter is enabled)
  const filteredPostData = useMemo(() => {
    if (!enableDateFilter || !dateRange || postData.length === 0) {
      return postData;
    }

    return postData.filter((post) => {
      // Try to find a date field in the post data
      let postDateString = post.created_time || post.date || post.timestamp;
      if (!postDateString) return true; // If no date field, include the post

      try {
        let postDate: Date;
        
        // Handle different date formats
        if (postDateString.includes('/')) {
          // Format: dd/mm/yyyy hh:mm
          const [datePart, timePart] = postDateString.split(' ');
          const [day, month, year] = datePart.split('/');
          const [hours, minutes] = (timePart || '00:00').split(':');
          
          postDate = new Date(
            parseInt(year),
            parseInt(month) - 1, // Month is 0-indexed
            parseInt(day),
            parseInt(hours),
            parseInt(minutes)
          );
        } else {
          // Try to parse as ISO string or other standard format
          postDate = new Date(postDateString);
        }

        return postDate >= dateRange.startDate && postDate <= dateRange.endDate;
      } catch (error) {
        console.warn('Error parsing date for post:', post, error);
        return true; // Include post if date parsing fails
      }
    });
  }, [postData, dateRange, enableDateFilter]);

  const finalPostData = enableDateFilter ? filteredPostData : postData;

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
      case "unknown":
        return tableIcon;
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
      case "unknown":
        return "Unknown Platform";
      default:
        return title || "Unknown Platform";
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
              {/* Date Filter - only show if enabled */}
              {enableDateFilter && (
                <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <DateFilter 
                    onDateRangeChange={setDateRange}
                    className={`date-filter-${title}`}
                  />
                </div>
              )}
              
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
                    data={finalPostData || []}
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
