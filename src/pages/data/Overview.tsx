import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import OverviewAccounts from "./tables/OverviewAccounts";
import OverviewAudience from "./tables/OverviewAudience";
import { selectMetaStats } from "@/toolkit/metaData/reducer";
import { useSelector } from "react-redux";
import { selectLinkedInStats } from "@/toolkit/linkedInData/reducer";
import { selectXStats } from "@/toolkit/xData/reducer";
import IntegrationManagementModal from "@/views/Dashboard/IntegrationManagementModal";
import NoIntegrations from "@/components/NoIntegrations";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useAutoDataRefresh } from "@/hooks/useAutoDataRefresh";

const Overview = () => {
  const metaStats = useSelector(selectMetaStats) || {};
  const linkedInStats = useSelector(selectLinkedInStats) || {};
  const xStats = useSelector(selectXStats) || {};
  const { loading } = useIntegrations();
  
  // Debug logging for X data
  useEffect(() => {
    if (xStats && Object.keys(xStats).length > 0) {
      console.log("🐦 X Data available in Overview:", xStats);
    }
  }, [xStats]);
  
  // Auto-refresh data for CONNECTED integrations when component mounts
  useAutoDataRefresh();

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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }



  return (
    <div>
      <Row>
        <Col md={expandedCols[tableKey1] ? 12 : 6}>
          <OverviewAccounts
            meta={metaStats}
            linkedInData={linkedInStats}
            xData={xStats}
            isExpanded={!!expandedCols[tableKey1]}
            onToggleExpand={() => toggleExpand(tableKey1)}
          />
        </Col>
        <Col md={expandedCols[tableKey2] ? 12 : 6}>
          <OverviewAudience
            meta={metaStats}
            linkedInData={linkedInStats}
            xData={xStats}
            isExpanded={!!expandedCols[tableKey2]}
            onToggleExpand={() => toggleExpand(tableKey2)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
