import React from "react";
import { Card, Col } from "react-bootstrap";

interface MetricsData {
    impressions: number;
    clicks: number;
    shares: number;
    comments: number;
}

interface MetricsPanelProps {
    data: MetricsData;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ data }) => {
    return (
        <Col lg={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-white border-0 pb-0">
                    <h5 className="mb-0">Top Metrics</h5>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Impressions</span>
                        <strong>{data.impressions.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Clicks</span>
                        <strong>{data.clicks.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span>Shares</span>
                        <strong>{data.shares.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Comments</span>
                        <strong>{data.comments.toLocaleString()}</strong>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default MetricsPanel;
