import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CustomerReviewChart = () => {
  const options:any = {
    chart: {
      height: 260,
      type: 'pie',
    },
    series: [66, 50, 40, 30],
    labels: ["Very Poor", "Satisfied", "Very Satisfied", "Poor"],
    legend: {
      show: true,
      offsetY: 50,
    },
    theme: {
      monochrome: {
        enabled: true,
        color: '#04a9f5',
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 320,
        },
        legend: {
          position: 'bottom',
          offsetY: 0,
        }
      }
    }]
  };

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={options.series} type="pie" height={260} />
    </React.Fragment>
  );
};

export default CustomerReviewChart;
