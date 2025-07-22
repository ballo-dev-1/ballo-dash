// src/components/EarningCoursesLineChart.js
import dynamic from 'next/dynamic';
import React from 'react';
// import Chart from 'react-apexcharts';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const EarningCoursesLineChart = () => {
    const earningCoursesLineChartOptions: any = {
        chart: {
            type: 'line',
            height: 230,
            toolbar: {
                show: false
            }
        },
        colors: ['#f4c22b', '#4680ff'],
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 1,
            colors: ['#fff', '#fff', '#fff'],
            strokeColors: ['#f4c22b', '#4680ff'],
            strokeWidth: 1,
            shape: 'circle',
            hover: {
                size: 4
            }
        },
        stroke: {
            width: 3
        },
        grid: {
            strokeDashArray: 4
        },
        series: [
            {
                name: 'Last Month',
                data: [200, 320, 275, 400, 300, 440]
            }
        ],
        xaxis: {
            labels: {
                hideOverlappingLabels: true
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        }
    };

    return (
        <div id="earning-courses-line-chart">
            <ReactApexChart
                options={earningCoursesLineChartOptions}
                series={earningCoursesLineChartOptions.series}
                type="line"
                height={230}
            />
        </div>
    );
};

export default EarningCoursesLineChart;
