import React from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StudentStatesChart = () => {
  const studentStatesChartOptions:any = {
    chart: {
      height: 250,
      type: 'donut'
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
    },
    labels: ['Total Signups', 'Active Student'],
    series: [76.7, 30],
    legend: {
      show: true,
      position: 'bottom',
    },
    fill: {
      opacity: [1, 0.5],
    },
    colors: ['#04a9f5', '#04a9f5']
  };

  return (
    <React.Fragment>
      <ReactApexChart options={studentStatesChartOptions} series={studentStatesChartOptions.series} type="donut" height={250} />
    </React.Fragment>
  );
};

export default StudentStatesChart;
