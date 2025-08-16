import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import React, { ReactElement, useEffect, useState } from "react";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import "@/assets/scss/data-page.scss";
import Overview from "./Overview";
import Posts from "./Posts";
// import AppInitializer from "@/Common/AppInitializer";
import NoIntegrations from "@/components/NoIntegrations";
import { useAutoDataRefresh } from "@/hooks/useAutoDataRefresh";
import { useIntegrations } from "@/hooks/useIntegrations";

{/* <AppInitializer />; */}

const dataTables = () => {
  const company = useAppSelector(selectCompany);
  const { hasIntegrations, loading } = useIntegrations();
    
  // Auto-refresh data for CONNECTED integrations when component mounts
  useAutoDataRefresh();
  
  // Show loading state while checking for integrations
  if (loading) {
    return (
      <>
        <BreadcrumbItem mainTitle="Data" subTitle={company?.name} />
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BreadcrumbItem mainTitle="Data" subTitle={company?.name} />
      {hasIntegrations ? (
        <div className="data-tables-container">
          <Overview />
          <Posts />
        </div>
      ) : (
        <NoIntegrations variant="data" />
      )}
    </>
  );
};

dataTables.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default dataTables;
