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
import React, { ReactElement, useState } from "react";
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
import { usePlatformStats } from "@/hooks/usePlatformStats";
import DashboardDateFilter, { DashboardDateRange } from "@/components/DashboardDateFilter";

const Dashboard = () => {
  const company = useSelector(selectCompany);
  const { hasIntegrations, loading } = useIntegrations();
  const [dateRange, setDateRange] = useState<DashboardDateRange | undefined>(undefined);
  const { totalReach, totalEngagement, previousReach, previousEngagement, reachPercentageChange, engagementPercentageChange, isLoading } = usePlatformStats(dateRange);
  
  // Auto-refresh data for CONNECTED integrations when component mounts
  useAutoDataRefresh();

  // Create dynamic widget data with real platform data
  const dynamicWidgetData = [
    {
      id: 1,
      cardImg: widgetData[0].cardImg, // Use the same image from static data
      title: "Total Reach",
      latestValue: totalReach.toLocaleString(),
      previousValue: previousReach.toLocaleString(),
      description: `Your total reach has grown across all platforms`,
      percentage: reachPercentageChange,
      bagdeColor: reachPercentageChange >= 0 ? "success" : "danger",
    },
    {
      id: 2,
      cardImg: widgetData[1].cardImg, // Use the same image from static data
      title: "Total Engagement",
      latestValue: totalEngagement.toLocaleString(),
      previousValue: previousEngagement.toLocaleString(),
      description: `You had ${totalEngagement} total engagements across all platforms`,
      percentage: engagementPercentageChange,
      bagdeColor: engagementPercentageChange >= 0 ? "primary" : "danger",
    },
    {
      id: 3,
      cardImg: widgetData[2].cardImg, // Use the same image from static data
      title: "Total Ad Spend",
      latestValue: "K0.00",
      previousValue: "K0.00",
      percentage: 0,
      description: "No ad spend data available at this time",
      bagdeColor: "secondary",
    },
  ];

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
      
      {/* Date Range Filter */}
      <div className="mb-4">
        <DashboardDateFilter onDateRangeChange={setDateRange} />
        {isLoading && (
          <div className="text-center mt-2">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading platform data...</span>
            </div>
            <span className="ms-2 text-muted">Loading platform data...</span>
          </div>
        )}
      </div>
      
      <Row>
        <Widgets widgetData={dynamicWidgetData} />
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
