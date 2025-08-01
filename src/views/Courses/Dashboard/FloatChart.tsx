import React from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ApexCharts = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const FloatChart = () => {
  const options: any = {
    chart: {
      type: 'area',
      height: 250,
      toolbar: {
        show: false
      }
    },
    colors: ['#f4c22b', '#4680ff'],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'top'
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
      width: 2,
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0
      }
    },
    grid: {
      show: false
    },
    series: [
      {
        name: 'Revenue',
        data: [200, 320, 320, 275, 275, 400, 400, 300, 440, 320, 320, 275, 275, 400, 300, 440]
      },
      {
        name: 'Sales',
        data: [200, 250, 240, 300, 340, 320, 320, 400, 350, 250, 240, 300, 340, 320, 400, 350]
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
      <ApexCharts options={options} series={options.series} type="area" height={250} />
    </React.Fragment>
  );
};

export default FloatChart;
