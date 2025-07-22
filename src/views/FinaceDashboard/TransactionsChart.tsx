import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TransactionsChart1 = () => {
  const totalLine1ChartOptions:any = {
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
      marker: {
        show: false
      }
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart options={totalLine1ChartOptions} series={totalLine1ChartOptions.series} type="line" height={60} />
    </React.Fragment>
  );
};




const TransactionsChart2 = () => {
  const totalLine2ChartOptions:any = {
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
      marker: {
        show: false
      }
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart options={totalLine2ChartOptions} series={totalLine2ChartOptions.series} type="line" height={60} />
    </React.Fragment>
  );
};


const TransactionsChart3 = () => {
  const totalLine3ChartOptions:any = {
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
      marker: {
        show: false
      }
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart options={totalLine3ChartOptions} series={totalLine3ChartOptions.series} type="line" height={60} />
    </React.Fragment>
  );
};

export { TransactionsChart1,TransactionsChart2,TransactionsChart3 };
