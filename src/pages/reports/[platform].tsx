import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import { Spinner, Card } from "react-bootstrap";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import { useIntegrations } from "@/hooks/useIntegrations";
import "@/assets/scss/reports-page.scss";
import "@/assets/scss/platform-report.scss";
import {
    ReportHeader,
    ExecutiveSummary,
    KeyInsights,
    PerformanceAnalysis,
    StrategicRecommendations,
    FloatingExportButton,
    ReportCard,
    SocialMediaStrategy,
    SocialMediaCalendar,
    HighestPerformingPosts,
    PerformanceOnPlatforms,
    PerformanceComparatively as PerformanceComparativelyComponent,
    Audience,
    LeadsSentiments,
    Queries,
    Comments,
    ContentMetrics,
    Commentary,
    Recommendations,
    ThankYou
} from "@/components/reports";

// Import platform icons
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import xIcon from "@/assets/images/socials/X_icon.png";
import allPlatformsIcon from "@/assets/images/all-platforms.png"; 

const platformIcons: { [key: string]: any } = {
  facebook: facebookIcon,
  instagram: instaIcon,
  linkedin: linkedinIcon,
  x: xIcon,
  all: allPlatformsIcon,
};

const platformNames: { [key: string]: string } = {
  facebook: "Facebook",
  instagram: "Instagram", 
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  all: "All Platforms",
};

const PlatformReport = () => {
  const router = useRouter();
  const { platform } = router.query;
  const company = useAppSelector(selectCompany);
  const { integrations, loading: integrationsLoading } = useIntegrations();
  const [isExporting, setIsExporting] = useState(false);

  // Mock data - replace with actual data fetching
  const platformData = {
    overview: {
      followers: 12500,
      engagement: 8.5,
      reach: 45000,
      posts: 24,
    },
    metrics: {
      impressions: 125000,
      clicks: 3200,
      shares: 890,
      comments: 456,
    },
    recentPosts: [
      { id: 1, content: "Exciting news about our latest product launch!", engagement: 1250, date: "2024-01-15" },
      { id: 2, content: "Behind the scenes of our team meeting", engagement: 890, date: "2024-01-14" },
      { id: 3, content: "Customer success story", engagement: 2100, date: "2024-01-13" },
    ],
  };


  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    // Here you would implement actual export functionality
    alert('Report exported successfully!');
  };

  // Transform integration data for FunnelOverview
  const getFunnelMetrics = () => {
    // Get the current platform's integration data
    const currentIntegration = integrations?.find((integration: any) => {
      const integrationType = integration.type?.toLowerCase();
      return integrationType === platformKey?.toLowerCase();
    });

    // Platform-specific mock data - in real app, this would come from integration APIs
    const platformSpecificData: { [key: string]: any } = {
      facebook: {
        budget: 35,
        spend: 28,
        reach: 28311,
        paidReach: 15,
        reachChange: -3.0,
        engagement: 332,
        paidEngagement: 12,
        engagementChange: -32.77,
        ctr: 2.8,
        comments: 45
      },
      linkedin: {
        budget: 20,
        spend: 15,
        reach: 2027,
        paidReach: 8,
        reachChange: 5.2,
        engagement: 147,
        paidEngagement: 6,
        engagementChange: 15.3,
        ctr: 3.2,
        comments: 12
      },
      instagram: {
        budget: 30,
        spend: 22,
        reach: 15000,
        paidReach: 10,
        reachChange: 8.5,
        engagement: 850,
        paidEngagement: 9,
        engagementChange: 12.1,
        ctr: 2.5,
        comments: 78
      },
      x: {
        budget: 18,
        spend: 14,
        reach: 8500,
        paidReach: 6,
        reachChange: -1.8,
        engagement: 420,
        paidEngagement: 5,
        engagementChange: 6.7,
        ctr: 1.9,
        comments: 32
      },
      all: {
        budget: 103, // Sum of all platforms
        spend: 79,   // Sum of all platforms
        reach: 53838, // Sum of all platforms
        paidReach: 39,
        reachChange: 2.2, // Average
        engagement: 1749, // Sum of all platforms
        paidEngagement: 32,
        engagementChange: 0.3, // Average
        ctr: 2.6, // Average
        comments: 167 // Sum of all platforms
      }
    };

    // Handle "all platforms" view - aggregate data from connected integrations
    if (platformKey?.toLowerCase() === 'all' && integrations?.length > 0) {
      const connectedPlatforms = integrations
        .filter((integration: any) => integration.status?.toUpperCase() === 'CONNECTED')
        .map((integration: any) => integration.type?.toLowerCase())
        .filter((type: string) => platformSpecificData[type]);

      if (connectedPlatforms.length > 0) {
        // Aggregate metrics from connected platforms
        const aggregatedData = connectedPlatforms.reduce((acc: any, platformType: string) => {
          const data = platformSpecificData[platformType];
          return {
            budget: acc.budget + data.budget,
            spend: acc.spend + data.spend,
            reach: acc.reach + data.reach,
            paidReach: acc.paidReach + data.paidReach,
            engagement: acc.engagement + data.engagement,
            paidEngagement: acc.paidEngagement + data.paidEngagement,
            comments: acc.comments + data.comments,
            // Averages
            reachChange: (acc.reachChange + data.reachChange) / 2,
            engagementChange: (acc.engagementChange + data.engagementChange) / 2,
            ctr: (acc.ctr + data.ctr) / 2,
          };
        }, {
          budget: 0, spend: 0, reach: 0, paidReach: 0, engagement: 0, 
          paidEngagement: 0, comments: 0, reachChange: 0, engagementChange: 0, ctr: 0
        });

        return aggregatedData;
      }
    }

    const platformData = platformSpecificData[platformKey?.toLowerCase() || 'facebook'];

    // If we have integration data, we could enhance it with real data
    if (currentIntegration) {
      // Map integration data to funnel metrics when available
      return {
        ...platformData,
        // Example of how to map real integration data:
        // reach: currentIntegration.insights?.reach || platformData.reach,
        // engagement: currentIntegration.insights?.engagement || platformData.engagement,
        // Add platform-specific mapping based on integration metadata
      };
    }

    return platformData;
  };

  if (router.isFallback || integrationsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const platformKey = platform as string;
  const platformName = platformNames[platformKey] || 'Platform';
  const platformIcon = platformIcons[platformKey];

  return (
    <div className="platform-report-page">
      <BreadcrumbItem 
        mainTitle="Reports" 
        subTitle={`${company?.name}`}
        subTitle2={`${platformName}`}
        showPageHeader={false} 
      />
      
      <ReportHeader    
        platformName={platformName}
        platformIcon={platformIcon}
        reportPeriod="2024-01-01 to 2024-01-31"
      />
      <SocialMediaStrategy platformName={platformName} />
      <SocialMediaCalendar />
      <HighestPerformingPosts />
      <PerformanceOnPlatforms currentPlatform={platformKey} />
      <Card>
        <PerformanceComparativelyComponent
          platform={platformKey}
          platformIcon={platformIcon}
          metrics={getFunnelMetrics()}
        />
      </Card>
      <Audience currentPlatform={platformKey} />      
      <LeadsSentiments currentPlatform={platformKey} />
      <Queries currentPlatform={platformKey} />
      <Comments currentPlatform={platformKey} />
      <ContentMetrics currentPlatform={platformKey} />
      <Commentary currentPlatform={platformKey} />
      <Recommendations currentPlatform={platformKey} />
      <ThankYou currentPlatform={platformKey} />
      

      {/* <ReportCard platformName={platformName}>
        <ExecutiveSummary data={platformData.overview} />
        <KeyInsights platformName={platformName} />
        <PerformanceAnalysis data={platformData.overview} />
        <StrategicRecommendations />
      </ReportCard> */}

      <FloatingExportButton 
        onExport={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
};

PlatformReport.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default PlatformReport;
