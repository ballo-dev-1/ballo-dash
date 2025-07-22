import React from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ActivityLineChart = () => {
  const activityLineChartOptions: any = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: {
        show: false
      }
    },
    colors: ['#1de9b6', '#4680ff'],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'top',
    },
    markers: {
      size: 1,
      colors: ['#fff', '#fff', '#fff'],
      strokeColors: ['#1de9b6', '#4680ff'],
      strokeWidth: 1,
      shape: 'circle',
      hover: {
        size: 4
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    grid: {
      strokeDashArray: 4
    },
    series: [
      {
        name: 'Free Course',
        data: [20, 90, 65, 85, 20, 80, 30]
      },
      {
        name: 'Subscription',
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
      <ReactApexChart options={activityLineChartOptions} series={activityLineChartOptions.series} type="line" height={300} />
    </React.Fragment>
  );
};

export default ActivityLineChart;
