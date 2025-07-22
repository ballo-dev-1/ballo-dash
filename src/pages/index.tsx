import Layout from "@/Layouts";
import WeeklyPlanTabs from "@/views/Home/Home Content";
import HomeBanner from "@/views/Home/Welcome Banner";
import { ReactElement } from "react";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <WeeklyPlanTabs />
    </>
  );
}

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
