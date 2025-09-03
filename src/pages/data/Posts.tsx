import BasicTable1 from "@/views/Table/Bootstrap/BootstrapTable/BasicTable1";
import BasicTable2 from "@/views/Table/Bootstrap/BootstrapTable/BasicTable2";
import BasicTable3 from "@/views/Table/Bootstrap/BootstrapTable/BasicTable3";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import BasicTable from "@views/Table/Bootstrap/BootstrapTable/BasicTable";
import ContextualClassesTable from "@views/Table/Bootstrap/BootstrapTable/ContextualClasses";
import DarkTable from "@views/Table/Bootstrap/BootstrapTable/DarkTable";
import HoverTable from "@views/Table/Bootstrap/BootstrapTable/HoverTable";
import React, { ReactElement, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import PostsTable from "./tables/PostsTable";
import TopPosts from "./tables/TopPosts";
import { fetchFacebookPosts, selectFacebookPosts, selectFacebookStatusPosts } from "@/toolkit/facebookData/reducer";
import { fetchInstagramPosts, selectInstagramPosts, selectInstagramPostsStatus, fetchInstagramStats, selectInstagramStats } from "@/toolkit/instagramData/reducer";
import { selectIntegrations } from "@/toolkit/Integrations/reducer";
import { useAppDispatch } from "@/toolkit/hooks";
import { useSelector } from "react-redux";

interface Props {
  data?: any;
}

const Posts: React.FC<Props> = ({ data }) => {
  const dispatch = useAppDispatch();
  const facebookPosts = useSelector(selectFacebookPosts);
  const facebookPostsStatus = useSelector(selectFacebookStatusPosts);
  const instagramPosts = useSelector(selectInstagramPosts);
  const instagramPostsStatus = useSelector(selectInstagramPostsStatus);
  const instagramStats = useSelector(selectInstagramStats);
  const integrations = useSelector(selectIntegrations);

  const [expandedCols, setExpandedCols] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleExpand = (index: number) => {
    setExpandedCols((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRefreshFacebookPosts = async () => {
    try {
      await dispatch(fetchFacebookPosts({
        pageId: 'me',
        platform: 'facebook',
        since: '',
        until: '',
        datePreset: 'last_30_days'
      })).unwrap();
      console.log('✅ Facebook posts refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh Facebook posts:', error);
    }
  };

  const handleRefreshInstagramPosts = async () => {
    try {
      // Get Instagram integration to get the accountId
      const instagramIntegration = integrations?.find((integration: any) => integration.type === 'INSTAGRAM');
      const accountId = instagramIntegration?.accountId || 'me';
      
      // First get the current Instagram stats to get the username
      let username = instagramStats?.userInfo?.username;
      
      // If no username in current stats, fetch stats first
      if (!username) {
        const statsResult = await dispatch(fetchInstagramStats({
          platform: 'instagram',
          since: '',
          until: '',
          datePreset: 'last_30_days'
        })).unwrap();
        username = statsResult.userInfo?.username;
      }
      
      // Then fetch Instagram posts with the accountId from integration and username
      await dispatch(fetchInstagramPosts({
        accountId: accountId,
        username: username
      })).unwrap();
      console.log(`✅ Instagram posts refreshed successfully for accountId: ${accountId}`);
    } catch (error) {
      console.error('❌ Failed to refresh Instagram posts:', error);
    }
  };

  const tableKey1 = 1;
  const tableKey2 = 2;
  const tableKey3 = 3;
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center my-4 mx-2">
        <h3 className="text-center flex-grow-1">Posts</h3>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleRefreshFacebookPosts}
            disabled={facebookPostsStatus === 'loading'}
          >
            {facebookPostsStatus === 'loading' ? 'Loading...' : 'Refresh Facebook'}
          </button>
          <button 
            className="btn btn-success btn-sm"
            onClick={handleRefreshInstagramPosts}
            disabled={instagramPostsStatus === 'loading'}
          >
            {instagramPostsStatus === 'loading' ? 'Loading...' : 'Refresh Instagram'}
          </button>
        </div>
      </div>
      <Row>
        <Col md={expandedCols[tableKey1] ? 12 : 6}>
          <PostsTable
            isExpanded={!!expandedCols[tableKey1]}
            onToggleExpand={() => toggleExpand(tableKey1)}
            platform="facebook"
            data={facebookPosts}
          />
          <BasicTable3 />
        </Col>
        <Col md={6}>
          <PostsTable
            isExpanded={!!expandedCols[tableKey2]}
            onToggleExpand={() => toggleExpand(tableKey2)}
            platform="instagram"
            data={instagramPosts}
          />
        </Col>
      </Row>
      <Row>
        <Col md={expandedCols[tableKey3] ? 12 : 6}>
          <TopPosts
            isExpanded={!!expandedCols[tableKey3]}
            onToggleExpand={() => toggleExpand(tableKey3)}
          />
        </Col>
        <Col md={6}>
          <ContextualClassesTable />
        </Col>
      </Row>
    </div>
  );
};

export default Posts;
