import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false
});

const CanceledOrderChart = () => {
    const options:any= {
        chart: {
            type: 'line',
            height: 60,
            stacked: true,
            sparkline: { enabled: true }
        },
        colors: ['#F44236'],
        stroke: { curve: 'smooth', width: 2 },
        series: [{ data: [0, 50, 4, 10, 3, 25, 5] }],
        tooltip: {
            x: { show: false },
            y: {
                title: {
                    formatter: function (seriesName:any) {
                        return '';
                    }
                }
            },
            marker: { show: false }
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart options={options} series={options.series} type="line" height={60} />
        </React.Fragment>
    );
};
export {CanceledOrderChart}