import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import OverviewAccounts from "./tables/OverviewAccounts";
import OverviewAudience from "./tables/OverviewAudience";
import { selectMetaStats } from "@/toolkit/metaData/reducer";
import { useSelector } from "react-redux";
import { selectLinkedInStats } from "@/toolkit/linkedInData/reducer";
  
const Overview = () => {
  const metaStats = useSelector(selectMetaStats) || {};
  const linkedInStats = useSelector(selectLinkedInStats) || {};

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
      <h3 className="my-4 mx-2 text-center">Overview</h3>
      <Row>
        <Col md={expandedCols[tableKey1] ? 12 : 6}>
          <OverviewAccounts
            meta={metaStats}
            linkedInData={linkedInStats}
            isExpanded={!!expandedCols[tableKey1]}
            onToggleExpand={() => toggleExpand(tableKey1)}
          />
        </Col>
        <Col md={expandedCols[tableKey2] ? 12 : 6}>
          <OverviewAudience
            meta={metaStats}
            linkedInData={linkedInStats}
            isExpanded={!!expandedCols[tableKey2]}
            onToggleExpand={() => toggleExpand(tableKey2)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
