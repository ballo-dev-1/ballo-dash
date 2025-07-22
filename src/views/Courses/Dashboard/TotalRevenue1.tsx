import React from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TotalRevenueLine1Chart = () => {
  const totalRevenueLine1ChartOptions:any = {
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
    colors: ['#1de9b6'],
    stroke: {
      curve: 'straight',
      lineCap: 'round',
      width: 3
    },
    series: [
      {
        name: 'series1',
        data: [20, 10, 18, 12, 25, 10, 20]
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
      <ReactApexChart options={totalRevenueLine1ChartOptions} series={totalRevenueLine1ChartOptions.series} type="line" height={60} />
    </React.Fragment>
  );
};

export default TotalRevenueLine1Chart;
