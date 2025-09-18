import React from "react";
import { Row, Col, Card } from "react-bootstrap";

interface OverviewData {
    followers: number;
    engagement: number;
    reach: number;
    posts: number;
}

interface OverviewCardsProps {
    data: OverviewData;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ data }) => {
    return (
        <Row className="mb-4">
            <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm overview-card metrics-card">
                    <Card.Body className="text-center">
                        <h6 className="text-muted mb-2 metric-label">Followers</h6>
                        <h3 className="mb-0 text-primary metric-value">{data.followers.toLocaleString()}</h3>
                        <small className="text-success metric-change positive">+12.5% from last month</small>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm overview-card metrics-card">
                    <Card.Body className="text-center">
                        <h6 className="text-muted mb-2 metric-label">Engagement Rate</h6>
                        <h3 className="mb-0 text-success metric-value">{data.engagement}%</h3>
                        <small className="text-success metric-change positive">+2.1% from last month</small>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm overview-card metrics-card">
                    <Card.Body className="text-center">
                        <h6 className="text-muted mb-2 metric-label">Reach</h6>
                        <h3 className="mb-0 text-info metric-value">{data.reach.toLocaleString()}</h3>
                        <small className="text-success metric-change positive">+8.3% from last month</small>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 border-0 shadow-sm overview-card metrics-card">
                    <Card.Body className="text-center">
                        <h6 className="text-muted mb-2 metric-label">Posts This Month</h6>
                        <h3 className="mb-0 text-warning metric-value">{data.posts}</h3>
                        <small className="text-muted metric-change">+3 from last month</small>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default OverviewCards;
