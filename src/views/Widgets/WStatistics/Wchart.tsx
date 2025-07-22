import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false 
});

const ProjectRatingChart1 = () => {
    const options: any = {
        chart: { type: 'bar', height: 50, sparkline: { enabled: true } },
        colors: ['#1DE9B6'],
        plotOptions: { bar: { borderRadius: 2, columnWidth: '80%' } },
        series: [
            {
                data: [10, 30, 40, 20, 60, 50, 20, 15, 20, 25, 30, 25]
            }
        ],
        xaxis: { crosshairs: { width: 1 } },
        tooltip: {
            fixed: { enabled: false },
            x: { show: false },
            y: {
                title: {
                    formatter: function (seriesName: any) {
                        return '';
                    }
                }
            },
            marker: { show: false }
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart options={options} series={options.series} type="bar" height={50} />
        </React.Fragment>
    );
};

export { ProjectRatingChart1};
