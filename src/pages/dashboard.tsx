import React, { ReactElement } from "react";
import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";

// Components
import Layout from "@layout/index";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Widgets from "@views/Dashboard/widgets";
import { widgetData, socialWidgetsData } from "@data/index";
import UsersCharts from "@views/Dashboard/UsersCharts";
import SocialWidgets from "@views/Dashboard/SocialWidgets";

import { selectCompany } from "@/toolkit/Company/reducer";
import ZambianMap from "@/views/Dashboard/ZambianMap";
import IntegrationManagementModal from "@/views/Dashboard/IntegrationManagementModal";
import NoIntegrations from "@/components/NoIntegrations";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useAutoDataRefresh } from "@/hooks/useAutoDataRefresh";

const Dashboard = () => {
  const company = useSelector(selectCompany);
  const { hasIntegrations, loading } = useIntegrations();
  
  // Auto-refresh data for CONNECTED integrations when component mounts
  useAutoDataRefresh();

  if (loading) {
    return (
      <>
        <BreadcrumbItem mainTitle="Dashboard" subTitle={company?.name} />
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (!hasIntegrations) {
    return (
      <>
        <BreadcrumbItem mainTitle="Dashboard" subTitle={company?.name} />
        <NoIntegrations variant="dashboard" />
      </>
    );
  }

  return (
    <>
      <BreadcrumbItem mainTitle="Dashboard" subTitle={company?.name} />
      
      {/* Integration Management Button */}
      <div className="mb-3 d-flex justify-content-end">
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
        <Widgets widgetData={widgetData} />
        <ZambianMap />
        <UsersCharts />
        <SocialWidgets socialWidgetsData={socialWidgetsData} />
      </Row>
    </>
  );
};

Dashboard.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
