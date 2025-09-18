import React, { ReactElement } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import { Row, Col, Card } from "react-bootstrap";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import { useIntegrations } from "@/hooks/useIntegrations";
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import xIcon from "@/assets/images/socials/X_icon.png";
import "@/assets/scss/statistics-page.scss";
import AudienceChart from "@/views/Chart/AudienceChart";
import {
    PlatformSelector,
    StatisticsHeader,
    FunnelOverview,
    OverviewCards,
    EngagementChart,
    MetricsPanel,
    RecentPostsTable
} from "@/components/statistics";

const StatisticsIndex = () => {
    const company = useAppSelector(selectCompany);
    const [platform, setPlatform] = React.useState<string>("facebook");
    const { integrations } = useIntegrations();

    const allPlatforms = [
        { key: "facebook", label: "Facebook", icon: facebookIcon },
        { key: "instagram", label: "Instagram", icon: instaIcon },
        { key: "linkedin", label: "LinkedIn", icon: linkedinIcon },
        { key: "x", label: "X", icon: xIcon },
    ];

    const availablePlatforms = React.useMemo(() => {
        if (!integrations || integrations.length === 0) return allPlatforms;
        const connected = integrations.filter((i: any) => (i?.status || "").toString().toUpperCase() === "CONNECTED");
        const types = new Set(connected.map((i: any) => (i?.type || "").toString().toLowerCase()));
        const filtered = allPlatforms.filter(p => types.has(p.key));
        return filtered.length > 0 ? filtered : allPlatforms;
    }, [integrations]);

    React.useEffect(() => {
        if (!platform && availablePlatforms.length > 0) {
            setPlatform(availablePlatforms[0].key);
        }
    }, [availablePlatforms, platform]);

    const handleExportPDF = () => {
        // TODO: Implement PDF export functionality
        console.log('Exporting statistics as PDF for platform:', platform);
        // This would typically generate a PDF report of the current statistics
    };

    // Platform-specific metrics data
    const getPlatformMetrics = (platformKey: string) => {
        const platformData = {
            facebook: {
                budget: 2500,
                spend: 1800,
                reach: 42000,
                paidReach: 12000,
                reachChange: -0.65,
                engagement: 6520,
                paidEngagement: 2100,
                engagementChange: 42.67,
                ctr: 39.7,
                comments: 200
            },
            instagram: {
                budget: 1800,
                spend: 1200,
                reach: 35000,
                paidReach: 8000,
                reachChange: 12.5,
                engagement: 8900,
                paidEngagement: 1500,
                engagementChange: 28.3,
                ctr: 45.2,
                comments: 450
            },
            linkedin: {
                budget: 3200,
                spend: 2400,
                reach: 28000,
                paidReach: 15000,
                reachChange: 8.2,
                engagement: 4200,
                paidEngagement: 1800,
                engagementChange: 15.7,
                ctr: 32.1,
                comments: 120
            },
            x: {
                budget: 1500,
                spend: 1100,
                reach: 25000,
                paidReach: 6000,
                reachChange: -5.2,
                engagement: 3800,
                paidEngagement: 900,
                engagementChange: 22.1,
                ctr: 28.9,
                comments: 180
            }
        };
        return platformData[platformKey as keyof typeof platformData] || platformData.facebook;
    };

    // Platform-specific audience data
    const getPlatformAudienceData = (platformKey: string) => {
        const audienceData = {
            facebook: {
                categories: ['Jan \'11', '02 Jan', '03 Jan', '04 Jan'],
                male: [44, 55, 41, 50],
                female: [13, 23, 20, 18],
                other: [11, 17, 15, 12],
                unknown: [21, 7, 25, 20]
            },
            instagram: {
                categories: ['Jan \'11', '02 Jan', '03 Jan', '04 Jan'],
                male: [35, 42, 38, 45],
                female: [25, 32, 28, 30],
                other: [15, 18, 16, 14],
                unknown: [25, 8, 18, 11]
            },
            linkedin: {
                categories: ['Jan \'11', '02 Jan', '03 Jan', '04 Jan'],
                male: [55, 62, 58, 65],
                female: [20, 25, 22, 28],
                other: [10, 12, 11, 9],
                unknown: [15, 1, 9, 8]
            },
            x: {
                categories: ['Jan \'11', '02 Jan', '03 Jan', '04 Jan'],
                male: [40, 48, 45, 52],
                female: [18, 22, 20, 25],
                other: [12, 15, 13, 11],
                unknown: [30, 15, 22, 12]
            }
        };
        return audienceData[platformKey as keyof typeof audienceData] || audienceData.facebook;
    };

    const metrics = getPlatformMetrics(platform);

    // Platform data structure matching reports page
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

    // Chart data
    const engagementChartOptions = {
        chart: {
            type: 'line' as const,
            height: 300,
            toolbar: { show: false }
        },
        colors: ['#0a1759'],
        stroke: {
            curve: 'smooth' as const,
            width: 3
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        },
        yaxis: {
            title: { text: 'Engagement Rate (%)' }
        },
        grid: {
            borderColor: '#f1f1f1'
        }
    };

    const engagementChartSeries = [{
        name: 'Engagement Rate',
        data: [6.2, 7.1, 8.3, 7.8, 8.9, 8.5]
    }];

    // Platform icons mapping
    const getPlatformIcon = (platformKey: string) => {
        const icons = {
            facebook: facebookIcon,
            instagram: instaIcon,
            linkedin: linkedinIcon,
            x: xIcon
        };
        return icons[platformKey as keyof typeof icons] || facebookIcon;
    };

    return (
        <>
            <BreadcrumbItem mainTitle="Statistics" subTitle={company?.name} showPageHeader={false} />
            <Row className="statistics-page">
                <PlatformSelector
                    platforms={availablePlatforms}
                    selectedPlatform={platform}
                    onPlatformSelect={setPlatform}
                />
                <Col md={9} lg={10}>
                    <Card className="mb-3">
                        <StatisticsHeader onExportPDF={handleExportPDF} />
                        
                        <FunnelOverview
                            platform={platform}
                            platformIcon={getPlatformIcon(platform)}
                            metrics={metrics}
                        />

                        <Card.Body>
                            <OverviewCards data={platformData.overview} />

                            {/* Charts Section */}
                            <Row className="mb-4">
                                <EngagementChart
                                    options={engagementChartOptions}
                                    series={engagementChartSeries}
                                />
                                <MetricsPanel data={platformData.metrics} />
                            </Row>

                            <RecentPostsTable posts={platformData.recentPosts} />
                        </Card.Body>

                        <Card.Body className="p-0">
                            <div className="audience-chart-container">
                                <AudienceChart platform={platform} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

StatisticsIndex.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
};

export default StatisticsIndex;


