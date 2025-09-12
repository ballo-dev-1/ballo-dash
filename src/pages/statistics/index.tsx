import React, { ReactElement } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import { Row, Col, Card, Dropdown } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import { useIntegrations } from "@/hooks/useIntegrations";
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import xIcon from "@/assets/images/socials/X_icon.png";
import funnelImage from "@/assets/images/funnel.png";
import "@/assets/scss/statistics-page.scss";
import BarChartStackedWide from "@/views/Chart/BarChartStackedWide";

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
						<Col md={3} lg={2} className="mb-3 platforms-column bg-white pt-3 rounded-3">
							<div className="mb-2 fw-semibold text-center">Platforms</div>
							<div className="list-group list-group-flush gap-3">
								{(availablePlatforms || []).map(p => (
									<a key={p.key} onClick={() => setPlatform(p.key)} className={`list-group-item list-group-item-action d-flex align-items-center px-2 py-2 border-0 bg-transparent ${platform === p.key ? "statistics-active-platform" : ""}`} role="button">
										<Image src={p.icon} alt={p.label} style={{ objectFit: "contain", width: 20, height: 20 }} />
										<span className="ms-2">{p.label}</span>
									</a>
								))}
							</div>
						</Col>
						<Col md={9} lg={10}>
							<Card className="mb-3">
								<Card.Body className="d-flex align-items-center justify-content-between controls-row">
									<div className="d-flex align-items-center border rounded-3 control-group">
										<button className="btn btn-sm me-2">Previous Month: 1 Feb, 2025 - 28 Feb, 2025</button>
										<button className="btn btn-sm">▼</button>
									</div>
									<Dropdown className="border rounded-3 control-group">
										<Dropdown.Toggle as="button" className="btn btn-sm">
											Export
										</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item onClick={handleExportPDF}>
												<i className="feather-file-text me-2"></i>
												Export as PDF
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</Card.Body>

								<Card.Body>
									<h4 className="mb-3 card-title-overview d-flex align-items-center">
										Overview 
										<Image 
											src={getPlatformIcon(platform)} 
											alt={platform} 
											width={24} 
											height={24} 
											className="ms-2"
											style={{ objectFit: "contain" }}
										/>
									</h4>
									<Row className="align-items-center">
										{/* Left Panel - Budget and Spend Metrics */}
										<Col md={2}>
											<div className="metrics-left-panel">
												<div className="metric-item mb-3">
													<div className="metric-label text-muted small">Ad Budget</div>
													<div className="metric-value fw-bold">K{metrics.budget.toLocaleString()}</div>
												</div>
												<div className="metric-item mb-3">
													<div className="metric-label text-muted small">Ad Spend</div>
													<div className="metric-value fw-bold">K{metrics.spend.toLocaleString()}</div>
												</div>
												<div className="metric-item mb-3">
													<div className="metric-label text-muted small">Paid Reach</div>
													<div className="metric-value fw-bold">K{metrics.paidReach.toLocaleString()}</div>
												</div>
												<div className="metric-item">
													<div className="metric-label text-muted small">Paid Engagement</div>
													<div className="metric-value fw-bold">K{metrics.paidEngagement.toLocaleString()}</div>
												</div>
											</div>
										</Col>
										
										{/* Right Panel - Funnel with Metrics */}
										<Col md={8}>
											<div className="funnel-container position-relative">
												<Image 
													src={funnelImage} 
													alt="Funnel and KPIs" 
													className="img-fluid"
													style={{ maxWidth: '100%', height: 'auto' }}
												/>
												
												{/* Funnel Metrics Overlay */}
												<div className="funnel-metrics">
													{/* REACH */}
													<div className="funnel-metric reach-metric">
														<div className="metric-content">
															<div className="metric-label">REACH</div>
															<div className="metric-value">{metrics.reach.toLocaleString()}</div>
															<div className={`metric-change ${metrics.reachChange < 0 ? 'text-danger' : 'text-success'}`}>
																{metrics.reachChange > 0 ? '+' : ''}{metrics.reachChange}%
															</div>
														</div>
													</div>
													
													{/* ENGAGEMENT */}
													<div className="funnel-metric engagement-metric">
														<div className="metric-content">
															<div className="metric-label">ENGAGEMENT</div>
															<div className="metric-value">{metrics.engagement.toLocaleString()}</div>
															<div className={`metric-change ${metrics.engagementChange < 0 ? 'text-danger' : 'text-success'}`}>
																{metrics.engagementChange > 0 ? '+' : ''}{metrics.engagementChange}%
															</div>
														</div>
													</div>
													
													{/* CTR */}
													<div className="funnel-metric ctr-metric">
														<div className="metric-content">
															<div className="metric-label">CTR</div>
															<div className="metric-value">{metrics.ctr}%</div>
														</div>
													</div>
													
													{/* MESSAGES */}
													<div className="funnel-metric messages-metric">
														<div className="metric-content">
															<div className="metric-label">COMMENTS</div>
															<div className="metric-value">{metrics.comments.toLocaleString()}</div>
														</div>
													</div>
												</div>
											</div>
										</Col>
									</Row>
								</Card.Body>

								<Card.Body className="p-0">
									<div className="audience-chart-container">
										<BarChartStackedWide platform={platform} />
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


