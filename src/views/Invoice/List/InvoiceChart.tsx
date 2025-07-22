import React from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js for dynamic import

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false }); 

const InvoiceChart1 = () => {
  const totalInvoiceChartOptions:any = {
    chart: {
      type: 'area',
      height: 55,
      sparkline: {
        enabled: true
      }
    },
    colors: ["#1de9b6"],
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
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      data: [0, 20, 10, 45, 30, 55, 20, 30]
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
            return 'Ticket ';
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
      <ReactApexChart options={totalInvoiceChartOptions} series={totalInvoiceChartOptions.series} type="area" height={55} />
    </React.Fragment>
  );
}
// ====================================================================================


const InvoiceChart2 = () => {
  const totalInvoice2ChartOptions:any = {
    chart: {
      type: 'area',
      height: 55,
      sparkline: {
        enabled: true
      }
    },
    colors: ["#f4c22b"],
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
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      data: [30, 20, 55, 30, 45, 10, 20, 0]
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
            return 'Ticket ';
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
      <ReactApexChart options={totalInvoice2ChartOptions} series={totalInvoice2ChartOptions.series} type="area" height={55} />
    </React.Fragment>
  );
};

// =======================================================================================================

const InvoiceChart3 = () => {
  const totalInvoice3ChartOptions:any = {
    chart: {
      type: 'area',
      height: 55,
      sparkline: {
        enabled: true
      }
    },
    colors: ["#f44236"],
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
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    series: [{
      data: [0, 20, 10, 45, 30, 55, 20, 30]
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
            return 'Ticket ';
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
      <ReactApexChart options={totalInvoice3ChartOptions} series={totalInvoice3ChartOptions.series} type="area" height={55} />
    </React.Fragment>
  );
};

export default InvoiceChart3;




export  {InvoiceChart1,InvoiceChart2,InvoiceChart3}
