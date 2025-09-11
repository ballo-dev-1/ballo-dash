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
import { fetchLinkedInPosts, selectLinkedInPosts, selectLinkedInStatusPosts } from "@/toolkit/linkedInData/reducer";
import { fetchXPosts, selectXPosts, selectXPostsStatus, fetchXStats, selectXStats } from "@/toolkit/xData/reducer";
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
  const linkedinPosts = useSelector(selectLinkedInPosts);
  const linkedinPostsStatus = useSelector(selectLinkedInStatusPosts);
  const xPosts = useSelector(selectXPosts);
  const xPostsStatus = useSelector(selectXPostsStatus);
  const xStats = useSelector(selectXStats);
  const integrations = useSelector(selectIntegrations);

  const [expandedCols, setExpandedCols] = useState<{ [key: number]: boolean }>(
    { 1: true, 2: true, 3: true, 4: true }
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

  const handleRefreshLinkedInPosts = async () => {
    try {
      // Get LinkedIn integration to get the organizationId (stored as accountId)
      const linkedinIntegration = integrations?.find((integration: any) => integration.type === 'LINKEDIN');
      const organizationId = linkedinIntegration?.accountId || 'me';
      
      // Fetch LinkedIn posts with the organizationId from integration
      await dispatch(fetchLinkedInPosts({
        organizationId: organizationId
      })).unwrap();
      console.log(`✅ LinkedIn posts refreshed successfully for organizationId: ${organizationId}`);
    } catch (error) {
      console.error('❌ Failed to refresh LinkedIn posts:', error);
    }
  };

  const handleRefreshXPosts = async () => {
    try {
      // Get X integration to get the handle
      const xIntegration = integrations?.find((integration: any) => integration.type === 'X');
      const username = xIntegration?.handle || 'GeorgeMsapenda';
      
      // First get the current X stats to get the accountId
      let accountId = xStats?.userId;
      
      // If no accountId in current stats, fetch stats first
      if (!accountId) {
        const statsResult = await dispatch(fetchXStats({
          username: username,
          platform: 'x',
          since: '',
          until: '',
          datePreset: 'last_30_days'
        })).unwrap();
        accountId = statsResult.userId;
      }
      
      // Then fetch X posts with the accountId from stats and username
      if (accountId) {
        await dispatch(fetchXPosts({
          accountId: accountId,
          username: username
        })).unwrap();
        console.log(`✅ X posts refreshed successfully for accountId: ${accountId}`);
      } else {
        console.error('❌ No accountId available for X posts');
      }
    } catch (error) {
      console.error('❌ Failed to refresh X posts:', error);
    }
  };

  const tableKey1 = 1;
  const tableKey2 = 2;
  const tableKey3 = 3;
  const tableKey4 = 4;
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center my-4 mx-2">
        <h3 className="text-center flex-grow-1">Posts</h3>
      </div>
      <Row>
        <Col md={expandedCols[tableKey1] ? 12 : 6}>
          <PostsTable
            isExpanded={!!expandedCols[tableKey1]}
            onToggleExpand={() => toggleExpand(tableKey1)}
            platform="facebook"
            data={facebookPosts}
          />
        </Col>
        <Col md={expandedCols[tableKey2] ? 12 : 6}>
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
          <PostsTable
            isExpanded={!!expandedCols[tableKey3]}
            onToggleExpand={() => toggleExpand(tableKey3)}
            platform="linkedin"
            data={linkedinPosts}
          />
        </Col>
      </Row>
      <Row>
        <Col md={expandedCols[tableKey4] ? 12 : 6}>
          <PostsTable
            isExpanded={!!expandedCols[tableKey4]}
            onToggleExpand={() => toggleExpand(tableKey4)}
            platform="x"
            data={xPosts}
          />
        </Col>
        {/* <Col md={6}>
          <TopPosts
            isExpanded={!!expandedCols[tableKey3]}
            onToggleExpand={() => toggleExpand(tableKey3)}
          />
        </Col> */}
      </Row>
      {/* <Row>
        <Col md={6}>
          <ContextualClassesTable />
        </Col>
      </Row> */}
    </div>
  );
};

export default Posts;
