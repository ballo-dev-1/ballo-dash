// src/Common/AppInitializer.tsx
import { useEffect } from "react";
import { useAppDispatch } from "@/toolkit/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/toolkit";
import { fetchCompany } from "@/toolkit/Company/reducer";
import { fetchMetaPosts, fetchMetaStats } from "@/toolkit/metaData/reducer";

const AppInitializer = () => {
  const dispatch = useAppDispatch();

  const stats = useSelector((state: RootState) => state.meta.stats) || {};
  const posts = useSelector((state: RootState) => state.meta.posts);
  const company = useSelector((state: RootState) => state.company.data);

  useEffect(() => {
    console.log(stats);
  }, [stats]);

  // Initial fetch
  useEffect(() => {
    if (!company) dispatch(fetchCompany());

    if (!posts) {
      dispatch(
        fetchMetaPosts({
          pageId: "me",
          platform: "FACEBOOK",
          since: " ",
          until: " ",
          datePreset: " ",
        })
      );
    }

    if (!Object.keys(stats).length) {
      console.log("Stats", stats);
      dispatch(
        fetchMetaStats({
          pageId: "me",
          platform: "FACEBOOK",
          since: " ",
          until: " ",
          datePreset: " ",
        })
      );
    }
  }, [dispatch]);

  // Polling every 5 mins
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCompany());
      dispatch(
        fetchMetaPosts({
          pageId: "me",
          platform: "FACEBOOK",
          since: " ",
          until: " ",
          datePreset: " ",
        })
      );
      dispatch(
        fetchMetaStats({
          pageId: "me",
          platform: "FACEBOOK",
          since: " ",
          until: " ",
          datePreset: " ",
        })
      );
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default AppInitializer;
