import React from "react";
import FacebookPostsTable from "./FacebookPostsTable";
import InstagramPostsTable from "./InstagramPostsTable";
import LinkedInPostsTable from "./LinkedInPostsTable";
import XPostsTable from "./XPostsTable";
import GenericPostsTable from "./GenericPostsTable";

interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
  platform: "facebook" | "linkedin" | "instagram" | "x" | "tiktok";
  data: any;
  isLoading?: boolean;
}

const PostsTable: React.FC<Props> = ({
  isExpanded,
  onToggleExpand,
  platform,
  data,
  isLoading = false,
}) => {
  // Render the appropriate component based on platform
  switch (platform) {
    case "facebook":
      return (
        <FacebookPostsTable
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          data={data}
          isLoading={isLoading}
        />
      );
    
    case "instagram":
      return (
        <InstagramPostsTable
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          data={data}
        />
      );
    
    case "linkedin":
      return (
        <LinkedInPostsTable
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          data={data}
          isLoading={isLoading}
        />
      );
    
    case "x":
      return (
        <XPostsTable
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          data={data}
        />
      );
    
    case "tiktok":
    default:
      // For platforms without specific components, use the generic one
      return (
        <GenericPostsTable
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          platform={platform || "tiktok"}
          data={data}
          columns={[]}
          postData={[]}
          hasData={false}
          isLoading={false}
        />
      );
  }
};

export default PostsTable;
