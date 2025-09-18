import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LeadCategory {
    category: string;
    percentage: number;
    color: string;
}

interface LeadsSentimentsProps {
    categories?: LeadCategory[];
    currentPlatform?: string;
}

const LeadsSentiments: React.FC<LeadsSentimentsProps> = ({ 
    categories = [
        { category: 'Product 1', percentage: 52.2, color: '#00133e' },
        { category: 'Product 2', percentage: 26.1, color: '#03a2e9' },
        { category: 'Product 3', percentage: 21.7, color: '#c53b82' }
    ],
    currentPlatform
}) => {
    const pieChartOptions = {
        chart: {
            type: 'pie' as const,
            height: 400
        },
        colors: categories.map(c => c.color),
        labels: categories.map(c => c.category),
        legend: {
            show: false
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number, opts: any) {
                const category = categories[opts.seriesIndex];
                return `${category.category}\n${category.percentage}%`;
            },
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                colors: ['#000000']
            },
            dropShadow: {
                enabled: false
            },
            offset: 20,
            minAngleToShowLabel: 10,
            distributed: false
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                dataLabels: {
                    offset: 20,
                    minAngleToShowLabel: 10
                }
            }
        },
        tooltip: {
            theme: 'light',
            style: {
                fontSize: '12px',
                color: '#000000'
            },
            marker: {
                show: false
            },
            y: {
                formatter: function (val: number) {
                    return val + '%'
                }
            }
        },
        stroke: {
            width: 2,
            colors: ['#ffffff']
        }
    };

    const pieChartSeries = categories.map(c => c.percentage);

    return (
        <Card className="leads-sentiments-card">
            {/* Blue Header */}
            <div className="leads-sentiments-header" style={{ backgroundColor: '#03a2e9', padding: '20px 0' }}>
                <div className="container">
                    <h2 className="text-white fw-bold mb-0 ms-4">Leads Sentiments (%)</h2>
                </div>
            </div>
            
            <Card.Body className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {/* Legend */}
                        <div className="d-flex justify-content-center gap-4 mb-4">
                            {categories.map((category, index) => (
                                <div key={index} className="d-flex align-items-center gap-2">
                                    <div 
                                        className="rounded-circle" 
                                        style={{ 
                                            width: '16px', 
                                            height: '16px', 
                                            backgroundColor: category.color 
                                        }}
                                    ></div>
                                    <span className="fw-medium">{category.category}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pie Chart */}
                        <div className="text-center">
                            <Chart
                                options={pieChartOptions}
                                series={pieChartSeries}
                                type="pie"
                                height={400}
                            />
                        </div>
                        
                        {/* Disclaimer */}
                        <div className="text-end my-4 text-center">
                            <small className="text-muted fst-italic text-center">
                                *Numbers are based on leads inquiries which express general interest.
                            </small>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default LeadsSentiments;
