import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MembershipStateChart = () => {
    const options:any = {
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
                    size: '40%',
                },
                track: {
                    background: '#04a9f525',
                    strokeWidth: '97%',
                    margin: 10
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
        <ReactApexChart options={options} series={options.series} type="radialBar" height={300} />
    );
};

export default MembershipStateChart;
