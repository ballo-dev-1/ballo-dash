import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import Image from "next/image";
import funnelImage from "@/assets/images/funnel.png";

interface PlatformMetrics {
    budget: number;
    spend: number;
    reach: number;
    paidReach: number;
    reachChange: number;
    engagement: number;
    paidEngagement: number;
    engagementChange: number;
    ctr: number;
    comments: number;
}

interface FunnelOverviewProps {
    platform: string;
    platformIcon: any;
    metrics: PlatformMetrics;
}

const FunnelOverview: React.FC<FunnelOverviewProps> = ({
    platform,
    platformIcon,
    metrics
}) => {
    return (
        <Card.Body>
            <h4 className="mb-3 card-title-overview d-flex align-items-center">
                Overview 
                <Image 
                    src={platformIcon} 
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
    );
};

export default FunnelOverview;
