import React, { ReactElement, useEffect } from "react";
import { Row } from "react-bootstrap";
import { getSession } from "next-auth/react";

// Components
import Layout from "@layout/index";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Widgets from "@views/Dashboard/widgets";
import { widgetData, socialWidgetsData } from "@data/index";
import UsersCharts from "@views/Dashboard/UsersCharts";
import SocialWidgets from "@views/Dashboard/SocialWidgets";
import RecentUsers from "@views/Dashboard/RecentUsers";
import RecentTableData from "@views/Dashboard/RecentTableData";
import { useAppDispatch, useAppSelector } from "@/toolkit/hooks";
import { fetchCompany, selectCompany } from "@/toolkit/Company/reducer";
import ZambianMap from "@/views/Dashboard/ZambianMap";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const company = useAppSelector(selectCompany);

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  return (
    <>
      <BreadcrumbItem mainTitle="Dashboard" subTitle={company?.name} />
      <Row>
        <Widgets widgetData={widgetData} />
        <ZambianMap />
        <UsersCharts />
        <SocialWidgets socialWidgetsData={socialWidgetsData} />
        {/* <RecentUsers /> */}
        {/* <RecentTableData /> */}
      </Row>
    </>
  );
};

Dashboard.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
