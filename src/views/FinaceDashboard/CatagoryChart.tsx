import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CategoryChart = () => {
  const options: any = {
    chart: {
      height: 300,
      type: 'donut'
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
    },
    labels: ['Saving', 'Spend', 'Income'],
    series: [25, 50, 25],
    colors: ['#212529', '#04a9f5', '#caedfd']
  };

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={options.series} type="donut" height={300} />
    </React.Fragment>
  );
};

export default CategoryChart;
