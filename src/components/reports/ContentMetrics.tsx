import React from "react";
import { Card, Table, Image } from "react-bootstrap";
import dynamic from "next/dynamic";
import ContentMetricsIcon from "@/assets/images/reports/content-metrics-icon.png";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MonthlyMetric {
    month: string;
    reach: number;
    engagement: number;
    posts: number;
    newFollowers: number;
    totalFollowing: number;
}

interface PlatformData {
    platform: string;
    monthlyData: MonthlyMetric[];
}

interface ContentMetricsProps {
    currentPlatform?: string;
    monthlyData?: MonthlyMetric[];
    platformsData?: PlatformData[];
    year?: string;
    period?: string;
}

const ContentMetrics: React.FC<ContentMetricsProps> = ({ 
    currentPlatform,
    monthlyData = [
        { month: "July", reach: 1355, engagement: 100, posts: 5, newFollowers: 38, totalFollowing: 444 },
        { month: "August", reach: 1779, engagement: 228, posts: 7, newFollowers: 38, totalFollowing: 486 },
        { month: "Sept", reach: 1052, engagement: 56, posts: 5, newFollowers: 30, totalFollowing: 516 },
        { month: "Oct", reach: 3155, engagement: 1626, posts: 9, newFollowers: 62, totalFollowing: 575 },
        { month: "Nov", reach: 2109, engagement: 129, posts: 12, newFollowers: 26, totalFollowing: 601 },
        { month: "Dec", reach: 1310, engagement: 96, posts: 8, newFollowers: 21, totalFollowing: 622 }
    ],
    platformsData = [
        {
            platform: "LinkedIn",
            monthlyData: [
                { month: "July", reach: 1355, engagement: 100, posts: 5, newFollowers: 38, totalFollowing: 444 },
                { month: "August", reach: 1779, engagement: 228, posts: 7, newFollowers: 38, totalFollowing: 486 },
                { month: "Sept", reach: 1052, engagement: 56, posts: 5, newFollowers: 30, totalFollowing: 516 },
                { month: "Oct", reach: 3155, engagement: 1626, posts: 9, newFollowers: 62, totalFollowing: 575 },
                { month: "Nov", reach: 2109, engagement: 129, posts: 12, newFollowers: 26, totalFollowing: 601 },
                { month: "Dec", reach: 1310, engagement: 96, posts: 8, newFollowers: 21, totalFollowing: 622 }
            ]
        },
        {
            platform: "Facebook",
            monthlyData: [
                { month: "July", reach: 28311, engagement: 332, posts: 5, newFollowers: 450, totalFollowing: 20500 },
                { month: "August", reach: 25200, engagement: 298, posts: 6, newFollowers: 380, totalFollowing: 20880 },
                { month: "Sept", reach: 22800, engagement: 275, posts: 4, newFollowers: 320, totalFollowing: 21200 },
                { month: "Oct", reach: 31500, engagement: 425, posts: 8, newFollowers: 520, totalFollowing: 21720 },
                { month: "Nov", reach: 27900, engagement: 356, posts: 7, newFollowers: 410, totalFollowing: 22130 },
                { month: "Dec", reach: 24600, engagement: 312, posts: 6, newFollowers: 350, totalFollowing: 22480 }
            ]
        },
        {
            platform: "Instagram",
            monthlyData: [
                { month: "July", reach: 15200, engagement: 890, posts: 12, newFollowers: 280, totalFollowing: 8500 },
                { month: "August", reach: 18400, engagement: 1120, posts: 15, newFollowers: 350, totalFollowing: 8850 },
                { month: "Sept", reach: 16800, engagement: 945, posts: 11, newFollowers: 310, totalFollowing: 9160 },
                { month: "Oct", reach: 21300, engagement: 1350, posts: 18, newFollowers: 420, totalFollowing: 9580 },
                { month: "Nov", reach: 19700, engagement: 1180, posts: 14, newFollowers: 380, totalFollowing: 9960 },
                { month: "Dec", reach: 17500, engagement: 1025, posts: 13, newFollowers: 340, totalFollowing: 10300 }
            ]
        }
    ],
    year = "2024",
    period = "H2"
}) => {
    // Get platform name for display
    const getPlatformName = (platform: string) => {
        const platformNames: { [key: string]: string } = {
            'facebook': 'Facebook',
            'instagram': 'Instagram',
            'linkedin': 'LinkedIn',
            'x': 'X',
            'all': 'All Platforms'
        };
        return platformNames[platform?.toLowerCase()] || 'LinkedIn';
    };

    const platformName = getPlatformName(currentPlatform || 'linkedin');

    // Determine what data to display
    const isAllPlatforms = currentPlatform?.toLowerCase() === 'all';
    const displayData = isAllPlatforms ? platformsData : [{ platform: platformName, monthlyData }];

    // Calculate consolidated data for "All Platforms" table
    const getConsolidatedData = (): MonthlyMetric[] => {
        if (!isAllPlatforms || !platformsData || platformsData.length === 0) {
            return [];
        }

        // Get all unique months from the first platform (assuming all platforms have same months)
        const months = platformsData[0]?.monthlyData.map(data => data.month) || [];
        
        return months.map(month => {
            // Sum up all metrics for this month across all platforms
            const monthlyTotals = platformsData.reduce((totals, platform) => {
                const monthData = platform.monthlyData.find(data => data.month === month);
                if (monthData) {
                    totals.reach += monthData.reach;
                    totals.engagement += monthData.engagement;
                    totals.posts += monthData.posts;
                    totals.newFollowers += monthData.newFollowers;
                    totals.totalFollowing += monthData.totalFollowing;
                }
                return totals;
            }, {
                reach: 0,
                engagement: 0,
                posts: 0,
                newFollowers: 0,
                totalFollowing: 0
            });

            return {
                month,
                reach: monthlyTotals.reach,
                engagement: monthlyTotals.engagement,
                posts: monthlyTotals.posts,
                newFollowers: monthlyTotals.newFollowers,
                totalFollowing: monthlyTotals.totalFollowing
            };
        });
    };

    const consolidatedData = getConsolidatedData();

    // Chart configuration for growth visualization
    const getChartData = () => {
        // Use data from the current platform or first platform in all platforms view
        const chartData = isAllPlatforms && consolidatedData.length > 0 
            ? consolidatedData 
            : monthlyData;

        // Extend data to show full year (January to December)
        const fullYearData = [
            { month: "January", reach: 5500, engagement: 180, posts: 4, newFollowers: 32, totalFollowing: 29000 },
            { month: "February", reach: 7200, engagement: 220, posts: 6, newFollowers: 33, totalFollowing: 29200 },
            { month: "March", reach: 10200, engagement: 350, posts: 8, newFollowers: 56, totalFollowing: 29500 },
            { month: "April", reach: 9800, engagement: 380, posts: 7, newFollowers: 20, totalFollowing: 29750 },
            { month: "May", reach: 7500, engagement: 290, posts: 5, newFollowers: 25, totalFollowing: 29900 },
            { month: "June", reach: 8900, engagement: 320, posts: 6, newFollowers: 47, totalFollowing: 30100 },
            { month: "July", reach: 4500, engagement: 100, posts: 5, newFollowers: 120, totalFollowing: 30220 },
            { month: "August", reach: 16000, engagement: 1626, posts: 7, newFollowers: 48, totalFollowing: 30268 },
            { month: "Sept", reach: 2000, engagement: 129, posts: 5, newFollowers: 25, totalFollowing: 30293 },
            { month: "Oct", reach: 29500, engagement: 96, posts: 9, newFollowers: 62, totalFollowing: 30355 },
            { month: "Nov", reach: 17500, engagement: 228, posts: 12, newFollowers: 26, totalFollowing: 30381 },
            { month: "Dec", reach: 15500, engagement: 56, posts: 8, newFollowers: 21, totalFollowing: 30402 }
        ];

        return fullYearData;
    };

    const chartData = getChartData();
    const displayPlatformName = isAllPlatforms ? "All Platforms" : platformName;

    // Helper function to render a single chart section
    const renderChartSection = (data: MonthlyMetric[], platformTitle: string, index: number) => (
        <div key={`chart-${index}`} className={index > 0 ? 'mt-5 pt-4' : ''} style={{ borderTop: index > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
            {/* Chart Header */}
            <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Growth arrow */}
                        <path d="M5 35 L15 25 L25 30 L35 15" stroke="white" strokeWidth="3" fill="none"/>
                        <path d="M30 15 L35 15 L35 20" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                </div>
                <h3 className="text-white fw-bold mb-0">{platformTitle} Growth - 2025</h3>
            </div>

            {/* Charts Container */}
            <div className="row">
                {/* Left Chart - Line Chart (Reach & Engagement) */}
                <div className="col-lg-8">
                    {/* Legend for line chart */}
                    <div className="d-flex align-items-center gap-4 mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <div 
                                className="rounded-circle" 
                                style={{ 
                                    width: '16px', 
                                    height: '16px', 
                                    backgroundColor: '#00bcd4' 
                                }}
                            ></div>
                            <span className="fw-medium text-white">Reach</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div 
                                className="rounded-circle" 
                                style={{ 
                                    width: '16px', 
                                    height: '16px', 
                                    backgroundColor: '#ffffff' 
                                }}
                            ></div>
                            <span className="fw-medium text-white">Engagement</span>
                        </div>
                    </div>

                    {/* Line Chart */}
                    <Chart
                        options={lineChartOptions}
                        series={[
                            {
                                name: 'Reach',
                                data: data.map(d => d.reach)
                            },
                            {
                                name: 'Engagement',
                                data: data.map(d => d.engagement)
                            }
                        ]}
                        type="line"
                        height={400}
                    />
                </div>

                {/* Right Chart - Bar Chart (New Followers) */}
                <div className="col-lg-4">
                    {/* Legend for bar chart */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div 
                            className="rounded-circle" 
                            style={{ 
                                width: '16px', 
                                height: '16px', 
                                backgroundColor: '#00bcd4' 
                            }}
                        ></div>
                        <span className="fw-medium text-white">{platformTitle}</span>
                    </div>

                    {/* Bar Chart */}
                    <Chart
                        options={{
        chart: {
            type: 'bar' as const,
                                height: 400,
                                toolbar: { show: false },
                                background: 'transparent'
        },
                            colors: ['#00bcd4'],
        plotOptions: {
            bar: {
                horizontal: false,
                                    columnWidth: '60%'
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
                                categories: data.map(d => d.month),
                                labels: {
                                    style: {
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        colors: '#ffffff'
                                    },
                                    rotate: -45
                                }
                            },
                            yaxis: {
                                title: {
                                    text: 'New followers',
                                    style: {
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        fontWeight: 500
                                    }
                                },
                                labels: {
                                    style: {
                                        fontSize: '12px',
                                        colors: '#ffffff'
                                    }
                                },
                                max: 120
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
                            },
                                        tooltip: {
                                            y: {
                                                formatter: function (val: number) {
                                                    return val.toString()
                                                }
                                            }
                                        }
                        }}
                        series={[{
                            name: 'New Followers',
                            data: data.map(d => d.newFollowers || 0)
                        }]}
                        type="bar"
                        height={400}
                    />
                </div>
            </div>
        </div>
    );

    // Line chart configuration
    const lineChartOptions = {
        chart: {
            type: 'line' as const,
            height: 400,
            toolbar: { show: false },
            background: 'transparent'
        },
        colors: ['#00bcd4', '#ffffff'], // Cyan for reach, white for engagement
        stroke: {
            curve: 'smooth' as const,
            width: 3
        },
        xaxis: {
            categories: chartData.map(data => data.month),
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    colors: '#ffffff'
                },
                rotate: -45
            }
        },
        yaxis: {
            title: {
                text: 'No of users',
                style: {
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 500
                }
            },
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#ffffff'
                }
            },
            max: 30000
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
        },
        legend: {
            show: false
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val.toLocaleString()
                }
            }
        }
    };

    const lineChartSeries = [
        {
            name: 'Reach',
            data: chartData.map(data => data.reach)
        },
        {
            name: 'Engagement',
            data: chartData.map(data => data.engagement)
        }
    ];

    // Helper function to render a single platform table
    const renderPlatformTable = (platformData: PlatformData, index: number) => (
        <div key={index} className='mt-5'>
            {/* Growth Chart Icon and Title */}
            <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 35 L15 25 L25 30 L35 15" stroke="white" strokeWidth="3" fill="none"/>
                        <path d="M30 15 L35 15 L35 20" stroke="white" strokeWidth="2" fill="none"/>

                    </svg>
                        </div>
                <h3 className="text-white fw-bold mb-0">{platformData.platform} Growth - {year} {period}</h3>
                        </div>
                
            {/* Table */}
                            <div className="table-responsive">
                <Table 
                    className="mb-0" 
                    style={{ 
                        borderCollapse: 'collapse',
                        border: '2px solid white'
                    }}
                >
                    <thead>
                        <tr>
                            <th 
                                className="text-white fw-bold py-3 px-4" 
                                style={{ 
                                    fontSize: '18px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid white',
                                    width: '20%'
                                }}
                            >
                                Metric
                            </th>
                            {platformData.monthlyData.map((data, index) => (
                                <th 
                                    key={index}
                                    className="text-white fw-bold py-3 px-4 text-center" 
                                    style={{ 
                                        fontSize: '18px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid white'
                                    }}
                                >
                                    {data.month}
                                </th>
                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                        {/* Reach Row */}
                        <tr>
                            <td 
                                className="text-white fw-medium py-4 px-4" 
                                style={{ 
                                    fontSize: '16px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid white'
                                }}
                            >
                                Reach
                            </td>
                            {platformData.monthlyData.map((data, index) => (
                                <td 
                                    key={index}
                                    className="text-white py-4 px-4 text-center" 
                                                            style={{ 
                                        backgroundColor: 'transparent',
                                        border: '1px solid white'
                                    }}
                                >
                                    <span className="fw-bold" style={{ fontSize: '16px' }}>
                                        {data.reach.toLocaleString()}
                                    </span>
                                                </td>
                            ))}
                        </tr>
                        
                        {/* Engagement Row */}
                        <tr>
                            <td 
                                className="text-white fw-medium py-4 px-4" 
                                style={{ 
                                    fontSize: '16px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid white'
                                }}
                            >
                                Engagement
                                                </td>
                            {platformData.monthlyData.map((data, index) => (
                                <td 
                                    key={index}
                                    className="text-white py-4 px-4 text-center" 
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: '1px solid white'
                                    }}
                                >
                                    <span className="fw-bold" style={{ fontSize: '16px' }}>
                                        {data.engagement.toLocaleString()}
                                    </span>
                                                </td>
                            ))}
                        </tr>
                        
                        {/* No. of Posts Row */}
                        <tr>
                            <td 
                                className="text-white fw-medium py-4 px-4" 
                                style={{ 
                                    fontSize: '16px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid white'
                                }}
                            >
                                No. of Posts
                                                </td>
                            {platformData.monthlyData.map((data, index) => (
                                <td 
                                    key={index}
                                    className="text-white py-4 px-4 text-center" 
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: '1px solid white'
                                    }}
                                >
                                    <span className="fw-bold" style={{ fontSize: '16px' }}>
                                        {data.posts}
                                    </span>
                                                </td>
                            ))}
                                            </tr>
                        
                        {/* New Followers Row */}
                        <tr>
                            <td 
                                className="text-white fw-medium py-4 px-4" 
                                style={{ 
                                    fontSize: '16px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid white'
                                }}
                            >
                                New Followers
                            </td>
                            {platformData.monthlyData.map((data, index) => (
                                <td 
                                    key={index}
                                    className="text-white py-4 px-4 text-center" 
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: '1px solid white'
                                    }}
                                >
                                    <span className="fw-bold" style={{ fontSize: '16px' }}>
                                        {data.newFollowers}
                                    </span>
                                </td>
                            ))}
                        </tr>
                        
                        {/* Total Following Row */}
                        <tr>
                            <td 
                                className="text-white fw-medium py-4 px-4" 
                                style={{ 
                                    fontSize: '16px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid white'
                                }}
                            >
                                Total Following
                            </td>
                            {platformData.monthlyData.map((data, index) => (
                                <td 
                                    key={index}
                                    className="text-white py-4 px-4 text-center" 
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: '1px solid white'
                                    }}
                                >
                                    <span className="fw-bold" style={{ fontSize: '16px' }}>
                                        {data.totalFollowing}
                                    </span>
                                </td>
                            ))}
                        </tr>
                                    </tbody>
                </Table>
                            </div>
                        </div>
    );

    return (
        <Card className="content-metrics-card" style={{ borderTop: '1px solid white' }}>
            <Card.Body style={{ padding: '0' }}>
                {/* Header with Icon and Title */}
                <div className="d-flex align-items-center position-relative" style={{ minHeight: '550px', backgroundImage: 'url(https://images.unsplash.com/photo-1694109016554-9a52bff4e9f1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNvY2lhbCUyMG1lZGlhJTIwbWV0cmljc3xlbnwwfHwwfHx8MA%3D%3D)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
                    <div className="position-relative z-1 d-flex align-items-center justify-content-center gap-5" style={{ width: '85%', color: 'white' }}>
                        <Image src={ContentMetricsIcon.src} alt="Content Metrics" style={{ width: '20%', height: 'auto' }} />
                        <h2 className="text-white fw-bold mb-0 position-relative z-1" style={{ fontSize: '3rem' }}>Content Metrics</h2>
                            </div>
                        </div>
                </Card.Body>

                <Card.Body style={{ backgroundColor: '#2c2c2c', color: 'white', padding: '40px', borderBottom: '1px solid white' }}>
                {/* Render individual platform tables */}
                {displayData.map((platformData, index) => renderPlatformTable(platformData, isAllPlatforms ? index : index))}

                {/* Render consolidated table first for all platforms view */}
                {isAllPlatforms && consolidatedData.length > 0 && renderPlatformTable({ platform: "All Platforms", monthlyData: consolidatedData }, -1)}
            </Card.Body>

            {/* Chart Visualization Card Body */}
            <Card.Body style={{ padding: '0' }}>
                <div className="position-relative" style={{ 
                    minHeight: '550px', 
                }}>
                    {/* Dark overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: '#2c2c2c' }} />
                    
                    <div className="position-relative" style={{ height: '100%', padding: '40px' }}>
                        {/* Render consolidated chart first for all platforms view */}
                        {isAllPlatforms && consolidatedData.length > 0 && renderChartSection(consolidatedData, "All Platforms", 0)}

                        {/* Render individual platform charts */}
                        {isAllPlatforms ? (
                            platformsData.map((platformData, index) => 
                                renderChartSection(
                                    platformData.monthlyData, 
                                    platformData.platform, 
                                    index + 1
                                )
                            )
                        ) : (
                            renderChartSection(chartData, displayPlatformName, 0)
                        )}
                            </div>
                        </div>
            </Card.Body>
        </Card>
    );
};

export default ContentMetrics;
