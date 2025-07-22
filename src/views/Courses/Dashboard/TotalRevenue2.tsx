import React from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TotalRevenueLine2Chart = () => {
  const totalRevenueLine2ChartOptions:any = {
    chart: {
      type: 'line',
      height: 60,
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#f44236'],
    stroke: {
      curve: 'straight',
      lineCap: 'round',
      width: 3
    },
    series: [
      {
        name: 'series1',
        data: [20, 10, 25, 18, 18, 10, 12]
      }
    ],
    yaxis: {
      min: 0,
      max: 30
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName:any) {
            return '';
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart options={totalRevenueLine2ChartOptions} series={totalRevenueLine2ChartOptions.series} type="line" height={60} />
    </React.Fragment>
  );
};

export default TotalRevenueLine2Chart;
