import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import React, { ReactElement, useEffect, useState } from "react";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import "@/assets/scss/data-page.scss";
import Overview from "./Overview";
import Posts from "./Posts";
import AppInitializer from "@/Common/AppInitializer";

<AppInitializer />;

const dataTables = () => {
  const company = useAppSelector(selectCompany);
  return (
    <>
      <BreadcrumbItem mainTitle="Data" subTitle={company?.name} />
      <div className="data-tables-container">
        <Overview />
        <Posts />
      </div>
    </>
  );
};

dataTables.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default dataTables;
