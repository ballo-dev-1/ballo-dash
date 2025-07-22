import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SupportChart1 = () => {
  const options1 :any = {
    chart: {
      type: 'area',
      height: 100,
      sparkline: {
        enabled: true
      }
    },
    colors: ["#3ebfea"],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      name: 'series1',
      data: [0, 20, 10, 45, 30, 55, 20, 30,0]
    }],
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName:any) {
            return ''
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
      <ReactApexChart options={options1} series={options1.series} type="area" height={100} />
    </React.Fragment>
  );
};



const SupportChart2 = () => {
  const options1 :any = {
    chart: {
      type: 'area',
      height: 100,
      sparkline: {
        enabled: true
      }
    },
    colors: ["#3ebfea"],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      name: 'series1',
      data: [0, 20, 10, 45, 30, 55, 20, 30,0]
    }],
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName:any) {
            return ''
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
      <ReactApexChart options={options1} series={options1.series} type="area" height={100} />
    </React.Fragment>
  );
};



const SupportChart3 = () => {
  const options1 :any = {
    chart: {
      type: 'area',
      height: 100,
      sparkline: {
        enabled: true
      }
    },
    colors: ["#1de9b6"],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      name: 'series1',
      data: [0, 20, 10, 45, 30, 55, 20, 30,0]
    }],
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName:any) {
            return ''
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
      <ReactApexChart options={options1} series={options1.series} type="area" height={100} />
    </React.Fragment>
  );
};





export  {SupportChart1,SupportChart2,SupportChart3};
