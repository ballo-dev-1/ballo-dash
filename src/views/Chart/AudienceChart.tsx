import React from "react";
import { Card, Col } from "react-bootstrap";
import Image from "next/image";
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Import platform icons
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import xIcon from "@/assets/images/socials/X_icon.png";

interface AudienceChartProps {
    platform?: string;
    data?: {
        male: number[];
        female: number[];
        other?: number[];
        unknown?: number[];
    };
    categories?: string[];
}

const AudienceChart: React.FC<AudienceChartProps> = ({ 
    platform = "facebook", 
    data,
    categories 
}) => {
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
    // Default data for each platform
    const getPlatformData = (platformKey: string) => {
        const platformData = {
            facebook: {
                male: [44, 55, 41, 67, 22, 43],
                female: [13, 23, 20, 8, 13, 27],
                
            },
            instagram: {
                male: [35, 42, 38, 45, 28, 35],
                female: [25, 32, 28, 30, 22, 28],
                
            },
            linkedin: {
                male: [55, 62, 58, 65, 45, 52],
                female: [20, 25, 22, 28, 18, 22],
                
            },
            x: {
                male: [40, 48, 45, 52, 35, 42],
                female: [18, 22, 20, 25, 16, 20],
                
            }
        };
        return platformData[platformKey as keyof typeof platformData] || platformData.facebook;
    };

    const platformData = data || getPlatformData(platform);
    const defaultCategories = ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'];
    const chartCategories = categories || defaultCategories;

    const series: any = [
        {
            name: 'Male',
            data: platformData.male
        },
        {
            name: 'Female',
            data: platformData.female
        },
    ];

    const options: any = {
        chart: {
            height: 350,
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false
            },
            zoom: {
                enabled: true
            }
        },
        colors: ['#04A9F5', '#1DE9B6', '#F4C22B', '#3EBFEA'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        xaxis: {
            type: 'datetime',
            categories: chartCategories
        },
        legend: {
            position: 'bottom'
        },
        fill: {
            opacity: 1
        }
    };
    return (
        <React.Fragment>
            <Col md={12}>
                <Card className="border-0">
                    <Card.Header>
                        <h5 className="d-flex align-items-center">
                            Audience 
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <ReactApexChart
                            dir="ltr"
                            className="apex-charts"
                            options={options}
                            series={series}
                            type="bar"
                            height={350}
                        />
                    </Card.Body>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default AudienceChart;
