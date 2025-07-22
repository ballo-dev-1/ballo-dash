import React from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CourseReportBarChart = () => {
  const courseReportBarChartOptions:any = {
    chart: {
      type: 'bar',
      height: 210,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 3
      }
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      show: true,
      fontFamily: `'Public Sans', sans-serif`,
      offsetX: 10,
      offsetY: 10,
      labels: {
        useSeriesColors: false
      },
      markers: {
        width: 10,
        height: 10,
        radius: '50%',
        offsexX: 2,
        offsexY: 2
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5
      }
    },
    colors: ['#04a9f5', '#ffa21d'],
    series: [{
      name: 'Net Profit',
      data: [180, 90, 135, 114, 120, 145, 180, 90, 135, 114, 120, 145]
    }, {
      name: 'Revenue',
      data: [120, 45, 78, 150, 168, 99, 120, 45, 78, 150, 168, 99]
    }],
    grid:{
      borderColor: '#00000010',
    },
    yaxis: {
      show:false
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart options={courseReportBarChartOptions} series={courseReportBarChartOptions.series} type="bar" height={210} />
    </React.Fragment>
  );
};

export default CourseReportBarChart;
