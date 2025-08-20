import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import React, { ReactElement } from "react";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import "@/assets/scss/data-page.scss";
import Overview from "./Overview";
import Posts from "./Posts";
import NoIntegrations from "@/components/NoIntegrations";
import { useAutoDataRefresh } from "@/hooks/useAutoDataRefresh";
import { useIntegrations } from "@/hooks/useIntegrations";
import Loading from "@/pages/pages/loading";  

const dataTables = () => {
  const company = useAppSelector(selectCompany);
  const { hasIntegrations, error, isInitialized } = useIntegrations();
  
  // Auto-refresh data for CONNECTED integrations when component mounts
  useAutoDataRefresh();
  
  // Show loading state while company is not loaded
  if (!company) {
    return (
      <>
        <BreadcrumbItem mainTitle="Data" subTitle="" />
          <Loading subContainer={true}/>
      </>
    );
  }

  return (
    <>
      <BreadcrumbItem mainTitle="Data" subTitle={company?.name} />  
      <div className={`${hasIntegrations ? 'data-tables-container' : 'd-none'}`}>
        <Overview />
        <Posts />
      </div>
      {!hasIntegrations && <NoIntegrations variant="data" />}
    </>
  );
};

dataTables.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default dataTables;
