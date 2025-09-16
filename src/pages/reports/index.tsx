import React, { ReactElement } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import { Row, Col, Card, Button, Dropdown } from "react-bootstrap";
import Image from "next/image";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import { useIntegrations } from "@/hooks/useIntegrations";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Import platform icons
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import xIcon from "@/assets/images/socials/X_icon.png";
import allPlatformsIcon from "@/assets/images/all-platforms.png";
import "@/assets/scss/reports-page.scss";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";

const ReportsIndex = () => {
    const router = useRouter();
    const company = useAppSelector(selectCompany);
    const { integrations, hasIntegrations, loading: integrationsLoading } = useIntegrations();

    // All available platforms
    const allPlatforms = [
        { id: "FACEBOOK", name: "Facebook", icon: facebookIcon, color: "#0a1759", isImage: true },
        { id: "INSTAGRAM", name: "Instagram", icon: instaIcon, color: "#0a1759", isImage: true },
        { id: "X", name: "X", icon: xIcon, color: "#0a1759", isImage: true },
        { id: "LINKEDIN", name: "LinkedIn", icon: linkedinIcon, color: "#0a1759", isImage: true },
        { id: "website", name: "Website", icon: "🌐", color: "#0a1759", isImage: false },
        { id: "whatsapp", name: "WhatsApp", icon: "📱", color: "#0a1759", isImage: false },
        { id: "sms", name: "SMS", icon: "💬", color: "#0a1759", isImage: false },
        { id: "email", name: "Email", icon: "✉️", color: "#0a1759", isImage: false },
        { id: "other", name: "Other Tools", icon: "⚙️", color: "#0a1759", isImage: false },
        { id: "all", name: "All platforms", icon: allPlatformsIcon, color: "#0a1759", wide: true, isImage: true }
    ];

    // Filter platforms based on connected integrations
    const availablePlatforms = React.useMemo(() => {
        if (integrationsLoading) {
            // Show only the "All platforms" card while loading
            return allPlatforms.filter(platform => platform.wide);
        }

        if (integrations && integrations.length > 0) {
            const connected = integrations.filter((i: any) => (i?.status || "").toString().toUpperCase() === "CONNECTED");
            const connectedPlatformTypes = new Set(
                connected.map((i: any) => (i?.type || "").toString().toUpperCase())
            );
            
            // Only include "All platforms" card if there are more than 1 connected integrations
            const shouldShowAllPlatforms = connected.length > 1;
            
            const filtered = allPlatforms.filter(platform => 
                connectedPlatformTypes.has(platform.id) || (platform.wide && shouldShowAllPlatforms)
            );
            return filtered.length > 0 ? filtered : allPlatforms;
        }
        // Fallback: if no integrations or none connected, show all platforms
        return allPlatforms;
    }, [integrations, hasIntegrations, integrationsLoading]);

    // Use available platforms instead of all platforms
    const platforms = availablePlatforms;

    // Overview data
    const overviewData = {
        audience: {
            male: 35,
            female: 65
        },
        engagement: {
            value: 396,
            change: -32.77
        },
        reach: {
            value: 9031,
            change: -3.0
        }
    };

    // Donut chart configuration for audience
    const audienceChartOptions = {
        chart: {
            type: 'donut' as const,
            height: 200
        },
        colors: ['#FF6B6B', '#4ECDC4'],
        labels: ['Male', 'Female'],
        plotOptions: {
            pie: {
                donut: {
                    size: '70%'
                }
            }
        },
        legend: {
            show: true,
            position: 'bottom' as const,
            fontSize: '14px',
            fontWeight: 600,
            markers: {
                size: 6
            }
        },
        dataLabels: {
            enabled: false
        },
        responsive: [{
            breakpoint: 768,
            options: {
                chart: {
                    height: 150
                },
                legend: {
                    position: 'bottom'
                }
            }
        }, {
            breakpoint: 480,
            options: {
                chart: {
                    height: 120
                },
                legend: {
                    position: 'bottom',
                    fontSize: '12px'
                }
            }
        }]
    };

    const audienceChartSeries = [overviewData.audience.male, overviewData.audience.female];

    // Handle platform card click
    const handlePlatformClick = (platform: any) => {
        const platformMap: { [key: string]: string } = {
            'FACEBOOK': 'facebook',
            'INSTAGRAM': 'instagram', 
            'LINKEDIN': 'linkedin',
            'X': 'x',
            'all': 'all'
        };
        
        const platformSlug = platformMap[platform.id] || platform.id.toLowerCase();
        router.push(`/reports/${platformSlug}`);
    };

    return (
        <div className="reports-page">
            <BreadcrumbItem mainTitle="Reports" subTitle={company?.name} showPageHeader={false} />
            
            {/* Top Controls */}
            <Row className="mb-4">
                <Col md={6}>
                    <div className="d-flex align-items-center">
                        <Button variant="light" className="me-2">
                            Previous Month: 1 Feb, 2025 - 28 Feb, 2025
                            <i className="ph-duotone ph-caret-down ms-2"></i>
                        </Button>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="d-flex justify-content-end">
                        {/* This will be replaced by floating button */}
                    </div>
                </Col>
                
            </Row>

            <Row>
                {/* Main Content - Platform Cards */}
                <Col xs={12} lg={9}>
                    {integrationsLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading integrations...</span>
                            </div>
                            <p className="mt-3 text-muted">Loading your connected platforms...</p>
                        </div>
                    ) : platforms.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <i className="ph-duotone ph-plug-circle text-muted" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h5 className="text-muted">No Connected Platforms</h5>
                            <p className="text-muted">Connect your social media accounts to view reports and analytics.</p>
                            <Button variant="primary" className="mt-3">
                                Connect Platforms
                            </Button>
                        </div>
                    ) : (
                        <div 
                            className="reports-grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(3, 1fr)`, // 3 columns as shown in image
                                gap: '1rem',
                                height: '100%'
                            }}
                        >
                            {platforms.map((platform, index) => {
                                const row = Math.floor(index / 3) + 1; // Back to 3 columns
                                const col = (index % 3) + 1; // Back to 3 columns
                                
                                return (
                                    <Card 
                                        key={platform.id}
                                        className={`border-0 ${platform.wide ? 'reports-wide-card' : 'reports-platform-card'}`}
                                        style={{ 
                                            backgroundColor: platform.color,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease',
                                            gridColumn: platform.wide ? 'span 2' : 'auto',
                                            gridRow: platform.wide ? 'auto' : 'auto'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        onClick={() => handlePlatformClick(platform)}
                                        id={platform.id}
                                    >
                                        <Card.Body className="p-2 d-flex flex-column justify-content-between">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div 
                                                    className={`rounded-circle d-flex align-items-center justify-content-center ${platform.wide ? 'opacity-0' : ''}`}
                                                    style={{ 
                                                        width: '32px', 
                                                        height: '32px', 
                                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                >
                                                    {platform.isImage ? (
                                                        <Image 
                                                            src={platform.icon as any} 
                                                            alt={platform.name} 
                                                            width={20} 
                                                            height={20}
                                                            style={{ objectFit: 'contain' }}
                                                        />
                                                    ) : (
                                                        <span style={{ fontSize: '16px' }}>{platform.icon as string}</span>
                                                    )}
                                                </div>
                                                <ChevronRight color="#0a1759" strokeWidth={3} className="bg-white rounded-circle p-1" />
                                            </div>
                                            <div className="text-white">
                                                <h5 className={`mb-0 text-white ${platform.wide ? 'all-platforms-name' : ''}`} style={{ fontWeight: 500, fontSize: '1rem' }}>{platform.name}</h5>
                                            </div>
                                            {platform.wide && (
                                               <Image 
                                                    src={allPlatformsIcon as any} 
                                                    alt={platform.name} 
                                                    style={{ objectFit: 'contain', objectPosition: 'left', left: 0, top: 0 }}
                                                />
                                            )}
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </Col>

                {/* Right Sidebar - Overview */}
                <Col xs={12} lg={3} className="position-relative">
                    <Card 
                        className="h-100 border-0 reports-overview-card"
                    >
                        <Card.Body className="p-4 p-md-3 p-sm-2 d-flex flex-column h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-bold">Overview</h5>
                            </div>

                            {/* Audience Section */}
                            <div className="mb-4">
                                <h6 className="mb-3 fs-6 fs-md-5">Audience</h6>
                                <div className="text-center">
                                    <Chart
                                        options={audienceChartOptions}
                                        series={audienceChartSeries}
                                        type="donut"
                                        height={200}
                                    />
                                </div>
                            </div>

                            {/* Engagement Section */}
                            <div className="mb-4">
                                <h6 className="mb-2 fs-6 fs-md-5">Engagement</h6>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-4 fw-bold">{overviewData.engagement.value.toLocaleString()}</span>
                                    <span className="text-danger fw-semibold">
                                        {overviewData.engagement.change > 0 ? '+' : ''}{overviewData.engagement.change}%
                                    </span>
                                </div>
                            </div>

                            {/* Reach Section */}
                            <div className="mb-4">
                                <h6 className="mb-2 fs-6 fs-md-5">Reach</h6>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-4 fw-bold">{overviewData.reach.value.toLocaleString()}</span>
                                    <span className="text-danger fw-semibold">
                                        {overviewData.reach.change > 0 ? '+' : ''}{overviewData.reach.change}%
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

ReportsIndex.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    );
};

export default ReportsIndex;
