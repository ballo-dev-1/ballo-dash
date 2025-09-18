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

interface PerformanceComparativelyProps {
    platform: string;
    platformIcon: any;
    metrics: PlatformMetrics;
}

const PerformanceComparatively: React.FC<PerformanceComparativelyProps> = ({
    platform,
    platformIcon,
    metrics
}) => {
    return (
        <Card.Body style={{ backgroundImage: `url(https://plus.unsplash.com/premium_photo-1723813233060-51b63cb3e620?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="position-absolute top-0 start-0 end-0 bottom-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}/>
            <Row className="align-items-center text-white z-1 position-relative">
                <Col md={2}>
                    <div className="metrics-left-panel text-white">
                        <div className="metric-item mb-3">
                            <div className="metric-label text-white small">Ad Budget</div>
                            <div className="metric-value fw-bold text-white">K{metrics.budget.toLocaleString()}</div>
                        </div>
                        <div className="metric-item mb-3">
                            <div className="metric-label text-white small">Ad Spend</div>
                            <div className="metric-value fw-bold text-white">K{metrics.spend.toLocaleString()}</div>
                        </div>
                        <div className="metric-item mb-3">
                            <div className="metric-label text-white small">Paid Reach</div>
                            <div className="metric-value fw-bold text-white">K{metrics.paidReach.toLocaleString()}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-label text-white small">Paid Engagement</div>
                            <div className="metric-value fw-bold text-white">K{metrics.paidEngagement.toLocaleString()}</div>
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
                                    <div className="metric-value ">{metrics.reach.toLocaleString()}</div>
                                    <div className={`metric-change ${metrics.reachChange < 0 ? 'negative' : 'positive'}`}>
                                        {metrics.reachChange > 0 ? '+' : ''}{metrics.reachChange}%
                                    </div>
                                </div>
                            </div>
                            
                            {/* ENGAGEMENT */}
                            <div className="funnel-metric engagement-metric">
                                <div className="metric-content">
                                    <div className="metric-label">ENGAGEMENT</div>
                                    <div className="metric-value">{metrics.engagement.toLocaleString()}</div>
                                    <div className={`metric-change ${metrics.engagementChange < 0 ? 'negative' : 'positive'}`}>
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

export default PerformanceComparatively;
