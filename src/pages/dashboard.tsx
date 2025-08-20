/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
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
