import React from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

function TotalIncomeChart() {
  const total_income_graph_options:any = {
    chart: {
      height: 280,
      type: 'donut'
    },
    series: [27, 23, 20, 17],
    colors: ['#f4c22b', '#1de9b6', '#f44236', '#04a9f5'],
    labels: ['Pending', 'Paid', 'Overdue', 'Draft'],
    fill: {
      opacity: [1, 1, 1, 0.3]
    },
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true
            },
            value: {
              show: true
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 575,
        options: {
          chart: {
            height: 250
          },
          plotOptions: {
            pie: {
              donut: {
                size: '65%',
                labels: {
                  show: false
                }
              }
            }
          }
        }
      }
    ]
  };

  return (
    <React.Fragment>
      <ReactApexChart options={total_income_graph_options} series={total_income_graph_options.series} type="donut" height={280} />
    </React.Fragment>
  );
}

export default TotalIncomeChart;
