import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import OverviewAccounts from "./tables/OverviewAccounts";
import OverviewAudience from "./tables/OverviewAudience";
import { selectMetaStats } from "@/toolkit/metaData/reducer";
import { useSelector } from "react-redux";
import { selectLinkedInStats } from "@/toolkit/linkedInData/reducer";
import IntegrationManagementModal from "@/views/Dashboard/IntegrationManagementModal";
import NoIntegrations from "@/components/NoIntegrations";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useAutoDataRefresh } from "@/hooks/useAutoDataRefresh";

const Overview = () => {
  const metaStats = useSelector(selectMetaStats) || {};
  const linkedInStats = useSelector(selectLinkedInStats) || {};
  const { hasIntegrations, loading } = useIntegrations();
  
  // Auto-refresh data for CONNECTED integrations when component mounts
  useAutoDataRefresh();


  // Debug logging
  useEffect(() => {
    console.log("=== Overview Component Debug ===");
    console.log("metaStats from Redux:", metaStats);
    console.log("linkedInStats from Redux:", linkedInStats);
    console.log("metaStats keys:", Object.keys(metaStats));
    console.log("linkedInStats keys:", Object.keys(linkedInStats));
    console.log("=== End Overview Component Debug ===");
  }, [metaStats, linkedInStats]);

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

  if (!hasIntegrations) {
    return (
      <NoIntegrations variant="data" />
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mx-2">Overview</h3>
        <IntegrationManagementModal 
          text="Manage Integrations"
          onIntegrationCreated={() => {
            // Refresh integrations to update the hasIntegrations state
            window.location.reload();
          }}
          onIntegrationDeleted={() => {
            // Refresh integrations to update the hasIntegrations state
            window.location.reload();
          }}
        />
      </div>
      
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
