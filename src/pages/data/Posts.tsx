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
import { fetchMetaPosts, selectMetaPosts } from "@/toolkit/metaData/reducer";
import { useAppDispatch } from "@/toolkit/hooks";
import { useSelector } from "react-redux";

interface Props {
  data?: any;
}

const Posts: React.FC<Props> = ({ data }) => {
  const metaPosts = useSelector(selectMetaPosts);

  const [expandedCols, setExpandedCols] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleExpand = (index: number) => {
    setExpandedCols((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const tableKey1 = 1;
  const tableKey2 = 2;
  return (
    <div>
      <h3 className="my-4 mx-2 text-center">Posts</h3>
      <Row>
        <Col md={expandedCols[tableKey1] ? 12 : 6}>
          <PostsTable
            isExpanded={!!expandedCols[tableKey1]}
            onToggleExpand={() => toggleExpand(tableKey1)}
            platform="facebook"
            data={metaPosts}
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
