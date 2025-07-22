import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const InvitesGoalChart = () => {
    const invitesGoalChartOption:any = {
        series: [76],
        chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
                enabled: true
            }
        },
        colors: ['#04a9f5'],
        plotOptions: {
            radialBar: {
                startAngle: -95,
                endAngle: 95,
                hollow: {
                    margin: 15,
                    size: '50%',
                },
                track: {
                    background: '#eaeaea',
                    strokeWidth: '97%',
                    margin: 20
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: 0,
                        fontSize: '20px'
                    }
                }
            }
        },
        grid: {
            padding: {
                top: 10
            }
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Average Results']
    };

    return (
        <ReactApexChart options={invitesGoalChartOption} series={invitesGoalChartOption.series} type="radialBar" height={480} />
    );
};

export default InvitesGoalChart;
