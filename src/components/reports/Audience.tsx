import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AudienceData {
    ageGroup: string;
    men: number;
    women: number;
}

interface AudienceProps {
    data?: AudienceData[];
    currentPlatform?: string;
}

const Audience: React.FC<AudienceProps> = ({ 
    data = [
        { ageGroup: "18-24", men: 4, women: 3 },
        { ageGroup: "25-34", men: 25, women: 19 },
        { ageGroup: "35-44", men: 18, women: 13 },
        { ageGroup: "45-54", men: 4, women: 3 },
        { ageGroup: "55-64", men: 1, women: 1 },
        { ageGroup: "65+", men: 8, women: 9 }
    ],
    currentPlatform
}) => {
    // Calculate totals for donut chart
    const totalMen = data.reduce((sum, item) => sum + item.men, 0);
    const totalWomen = data.reduce((sum, item) => sum + item.women, 0);
    const total = totalMen + totalWomen;
    const menPercentage = ((totalMen / total) * 100).toFixed(1);
    const womenPercentage = ((totalWomen / total) * 100).toFixed(1);

    // Bar chart configuration
    const barChartOptions = {
        chart: {
            type: 'bar' as const,
            height: 400,
            toolbar: { show: false },
            background: 'transparent'
        },
        colors: ['#03a2e9', '#1B4F72'], // Light blue for men, dark blue for women
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
                endingShape: 'rounded',
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: data.map(item => item.ageGroup),
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 600
                }
            }
        },
        yaxis: {
            title: {
                text: ''
            },
            labels: {
                style: {
                    fontSize: '12px'
                }
            },
            max: 30
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: false
        },
        grid: {
            show: true,
            borderColor: '#e9ecef',
            strokeDashArray: 0,
            position: 'back' as const,
            xaxis: {
                lines: {
                    show: false
                }
            },   
            yaxis: {
                lines: {
                    show: true
                }
            }
        }
    };

    const barChartSeries = [
        {
            name: 'Men',
            data: data.map(item => item.men)
        },
        {
            name: 'Women',
            data: data.map(item => item.women)
        }
    ];

    // Donut chart configuration
    const donutChartOptions = {
        chart: {
            type: 'donut' as const,
            height: 300
        },
        colors: ['#03a2e9', '#1B4F72'], // Light blue for men, dark blue for women
        labels: ['Men', 'Women'],
        dataLabels: {
            enabled: true,
            formatter: function (val: number, opts: any) {
                const label = opts.w.globals.labels[opts.seriesIndex];
                const percentage = label === 'Men' ? menPercentage : womenPercentage;
                return `${label}\n${percentage}%`;
            },
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                colors: ['#ffffff']
            },
            dropShadow: {
                enabled: false
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: false
                    }
                }
            }
        },
        legend: {
            show: false
        },
        stroke: {
            width: 0
        }
    };

    const donutChartSeries = [totalMen, totalWomen];

    // Location data (cities in Zambia)
    const locationData = [
        { city: "Lusaka", value: 52 },
        { city: "Kitwe", value: 8 },
        { city: "Ndola", value: 6 },
        { city: "Kabwe", value: 4 },
        { city: "Livingstone", value: 3 },
        { city: "Chingola", value: 2 },
        { city: "Mufilira", value: 2 },
        { city: "Kasama", value: 1 },
        { city: "Mansa", value: 1 }
    ];

    // Industries data
    const industriesData = [
        { industry: "Financial Services", value: 28 },
        { industry: "Hospitals and Health Care", value: 22 },
        { industry: "Transportation, Logistics, Supply Chain and Storage", value: 18 },
        { industry: "Government Administration", value: 15 },
        { industry: "Accounting", value: 12 },
        { industry: "Food and Beverage Manufacturing", value: 8 },
        { industry: "Banking", value: 6 }
    ];

    // Location bar chart configuration
    const locationChartOptions = {
        chart: {
            type: 'bar' as const,
            height: 400,
            toolbar: { show: false },
            background: 'transparent'
        },
        colors: ['#ffffff'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: locationData.map(item => item.city),
            labels: {
                style: {
                    fontSize: '11px',
                    fontWeight: 500,
                    colors: '#ffffff'
                },
                rotate: -45
            }
        },
        yaxis: {
            title: {
                text: ''
            },
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#ffffff'
                }
            },
            max: 60
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: false
        },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '12px',
                color: '#ffffff'
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
        grid: {
            show: true,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            strokeDashArray: 0,
            position: 'back' as const,
            xaxis: {
                lines: {
                    show: false
                }
            },   
            yaxis: {
                lines: {
                    show: true
                }
            }
        }
    };

    const locationChartSeries = [{
        name: 'Location',
        data: locationData.map(item => item.value)
    }];

    // Industries horizontal bar chart configuration
    const industriesChartOptions = {
        chart: {
            type: 'bar' as const,
            height: 400,
            toolbar: { show: false },
            background: 'transparent'
        },
        colors: ['#ffffff'],
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: '60%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: industriesData.map(item => item.industry),
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#ffffff'
                }
            },
            max: 30
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '11px',
                    fontWeight: 500,
                    colors: '#ffffff'
                }
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: false
        },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '12px',
                color: '#ffffff'
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
        grid: {
            show: true,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            strokeDashArray: 0,
            position: 'back' as const,
            xaxis: {
                lines: {
                    show: true
                }
            },   
            yaxis: {
                lines: {
                    show: false
                }
            }
        }
    };

    const industriesChartSeries = [{
        name: 'Industries',
        data: industriesData.map(item => item.value)
    }];

    return (
        <Card className="audience-card">
            {/* Blue Header */}
            <div className="audience-header" style={{ backgroundColor: '#03a2e9', padding: '20px 0' }}>
                <div className="container">
                    <h2 className="text-white fw-bold mb-0 ms-4">Audience (%)</h2>
                </div>
            </div>
            
            <Card.Body className="p-4">
                <Row className="align-items-center">
                    {/* Left side - Bar Chart */}
                    <Col lg={8}>
                        {/* Legend */}
                        <div className="d-flex align-items-center gap-4 mb-4">
                            <div className="d-flex align-items-center gap-2">
                                <div 
                                    className="rounded-circle" 
                                    style={{ 
                                        width: '16px', 
                                        height: '16px', 
                                        backgroundColor: '#03a2e9' 
                                    }}
                                ></div>
                                <span className="fw-medium">Men</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div 
                                    className="rounded-circle" 
                                    style={{ 
                                        width: '16px', 
                                        height: '16px', 
                                        backgroundColor: '#1B4F72' 
                                    }}
                                ></div>
                                <span className="fw-medium">Women</span>
                            </div>
                        </div>
                        
                        {/* Bar Chart */}
                        <Chart
                            options={barChartOptions}
                            series={barChartSeries}
                            type="bar"
                            height={400}
                        />
                    </Col>
                    
                    {/* Right side - Donut Chart */}
                    <Col lg={4}>
                        <div className="text-center">
                            <Chart
                                options={donutChartOptions}
                                series={donutChartSeries}
                                type="donut"
                                height={300}
                            />
                        </div>
                    </Col>
                </Row>
            </Card.Body>

            <Card.Body style={{ backgroundColor: '#00133e', color: 'white' }}>
                <Row className="align-items-center">
                    {/* Left side - Location Chart */}
                    <Col lg={6}>
                        {/* Legend */}
                        <div className="d-flex align-items-center gap-4 mb-4">
                                        <div className="d-flex align-items-center gap-2">
                                
                                <span className="fw-medium text-white">Location</span>
                            </div>
                        </div>
                        
                        {/* Location Bar Chart */}
                        <Chart
                            options={locationChartOptions}
                            series={locationChartSeries}
                            type="bar"
                            height={400}
                        />
                    </Col>
                    
                    {/* Right side - Industries Chart */}
                    <Col lg={6}>
                        {/* Legend */}
                        <div className="d-flex align-items-center gap-4 mb-4">
                                        <div className="d-flex align-items-center gap-2">
                   
                                <span className="fw-medium text-white">Industries</span>
                            </div>
                        </div>
                        
                        {/* Industries Horizontal Bar Chart */}
                        <Chart
                            options={industriesChartOptions}
                            series={industriesChartSeries}
                            type="bar"
                            height={400}
                        />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default Audience;
