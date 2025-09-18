import React from "react";
import { Card, Col } from "react-bootstrap";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface EngagementChartProps {
    options: any;
    series: any[];
}

const EngagementChart: React.FC<EngagementChartProps> = ({ options, series }) => {
    return (
        <Col lg={8} className="mb-4">
            <Card className="h-100 border-0 shadow-sm chart-section">
                <Card.Header className="bg-white border-0 pb-0 chart-header">
                    <h5 className="mb-0">Engagement Trends</h5>
                </Card.Header>
                <Card.Body>
                    <div className="chart-container">
                        <Chart
                            options={options}
                            series={series}
                            type="line"
                            height={300}
                        />
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default EngagementChart;
