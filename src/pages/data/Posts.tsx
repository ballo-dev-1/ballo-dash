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
import { useAppDispatch } from "@/toolkit/hooks";
import { useSelector } from "react-redux";

interface Props {
  data?: any;
}

const Posts: React.FC<Props> = ({ data }) => {
  const dispatch = useAppDispatch();
  const facebookPosts = useSelector(selectFacebookPosts);
  const facebookPostsStatus = useSelector(selectFacebookStatusPosts);

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

  const tableKey1 = 1;
  const tableKey2 = 2;
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center my-4 mx-2">
        <h3 className="text-center flex-grow-1">Posts</h3>
        <button 
          className="btn btn-primary btn-sm"
          onClick={handleRefreshFacebookPosts}
          disabled={facebookPostsStatus === 'loading'}
        >
          {facebookPostsStatus === 'loading' ? 'Loading...' : 'Refresh Posts'}
        </button>
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
          <BasicTable2 />
        </Col>
      </Row>
      <Row>
        <Col md={expandedCols[tableKey2] ? 12 : 6}>
          <TopPosts
            isExpanded={!!expandedCols[tableKey2]}
            onToggleExpand={() => toggleExpand(tableKey2)}
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
