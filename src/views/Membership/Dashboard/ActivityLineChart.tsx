import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ActivityLineChart = () => {
  const activityLineChartOptions:any = {
    chart: {
      type: 'line',
      height: 150,
      toolbar: {
        show: false
      }
    },
    colors: ['#1de9b6', '#1de9b6'],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'top',
    },
    markers: {
      size: 1,
      colors: ['#fff', '#fff'],
      strokeColors: ['#1de9b6', '#1de9b6'],
      strokeWidth: 1,
      shape: 'circle',
      hover: {
        size: 4
      }
    },
    fill: {
      opacity:[1,0.3]
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    grid: {
      show: false,
    },
    series: [
      {
        name: 'Active',
        data: [20, 90, 65, 85, 20, 80, 30]
      },
      {
        name: 'Inactive',
        data: [70, 30, 40, 15, 60, 40, 95]
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
    <React.Fragment>
      <ReactApexChart options={activityLineChartOptions} series={activityLineChartOptions.series} type="line" height={150} />
    </React.Fragment>
  );
};

export default ActivityLineChart;
