// src/Common/AppInitializer.tsx

import { useEffect } from "react";
import { useAppDispatch } from "@/toolkit/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/toolkit";
import { fetchCompany } from "@/toolkit/Company/reducer";
import { fetchMetaPosts, fetchMetaStatsProgressive } from "@/toolkit/metaData/reducer";
import { fetchLinkedInStatsProgressive, selectLinkedInStats, resetProgressiveLinkedInStats } from "@/toolkit/linkedInData/reducer";
import { fetchIntegrations } from "@/toolkit/Integrations/reducer";

const AppInitializer = () => {
  const dispatch = useAppDispatch();

  // Selectors for checking if data is already present in the store
  const company = useSelector((state: RootState) => state.company.data);
  const metaStats = useSelector((state: RootState) => state.meta.stats) || {};
  const progressiveMetaStats = useSelector((state: RootState) => state.meta.progressiveStats);
  const metaPosts = useSelector((state: RootState) => state.meta.posts);
  const linkedInStats = useSelector(selectLinkedInStats) || {};
  const progressiveLinkedInStats = useSelector((state: RootState) => state.linkedin.progressiveStats);
  const integrations = useSelector((state: RootState) => state.integration.items);
  const integrationsStatus = useSelector((state: RootState) => state.integration.status);
  


  // One-time fetch on mount
  useEffect(() => {
    // Fetch integrations if not already loaded
    if (integrations.length === 0 && integrationsStatus !== "loading") {
      dispatch(fetchIntegrations());
    } else {
      console.log("Integrations already loaded or loading:", integrations);
    }
    
    // Fetch company info if not already loaded
    if (!company) {
      dispatch(fetchCompany());
    }

    // Fetch Facebook posts if not already loaded
    if (!metaPosts) {
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

    // Fetch Facebook stats progressively if not already loaded
    if (!Object.keys(metaStats).length && !progressiveMetaStats) {
      dispatch(
        fetchMetaStatsProgressive({
          pageId: "me",
          platform: "FACEBOOK",
          since: " ",
          until: " ",
          datePreset: " ",
        })
      );
    }

    // Fetch LinkedIn stats progressively if not already loaded
    if (!progressiveLinkedInStats || 
        (progressiveLinkedInStats && 
         progressiveLinkedInStats.completedMetrics.length === 0 && 
         progressiveLinkedInStats.loadingMetrics.length === 0)) {
      console.log("Dispatching fetchLinkedInStatsProgressive...");
      
      // Reset if we have a failed/incomplete state
      if (progressiveLinkedInStats && 
          progressiveLinkedInStats.completedMetrics.length === 0 && 
          progressiveLinkedInStats.loadingMetrics.length === 0) {
        console.log("Resetting incomplete progressive LinkedIn stats...");
        dispatch(resetProgressiveLinkedInStats());
      }
      
      dispatch(
        fetchLinkedInStatsProgressive({
          organizationId: "90362182",
          platform: "linkedin",
          datePreset: "",
        })
      );
    } else {
      console.log("NOT dispatching fetchLinkedInStatsProgressive because progressiveLinkedInStats exists with data:", progressiveLinkedInStats);
      console.log("   Completed metrics:", progressiveLinkedInStats.completedMetrics);
      console.log("   Loading metrics:", progressiveLinkedInStats.loadingMetrics);
      console.log("   Has organization name:", !!progressiveLinkedInStats.organizationName);
      console.log("   Followers:", progressiveLinkedInStats.followers);
      console.log("   Impression count:", progressiveLinkedInStats.impressionCount);
    }
      
  }, [dispatch, company, metaPosts, metaStats, progressiveMetaStats, linkedInStats, progressiveLinkedInStats, integrations, integrationsStatus]);

  // Polling effect to refresh company and Facebook data every 5 minutes
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
        fetchMetaStatsProgressive({
          pageId: "me",
          platform: "FACEBOOK",
          since: " ",
          until: " ",
          datePreset: " ",
        })
      );

      dispatch(
        fetchLinkedInStatsProgressive({
          organizationId: "90362182",
          platform: "linkedin",
          datePreset: "",
        })
      );
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  return null; // This component only runs side effects
};

export default AppInitializer;
