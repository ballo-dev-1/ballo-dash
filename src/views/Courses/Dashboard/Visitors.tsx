import dynamic from 'next/dynamic';
import Chart from 'react-apexcharts';
const ApexCharts = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const VisitorsBarChart = () => {
  const visitorsBarChartOptions: any = {
    chart: {
      type: 'bar',
      height: 220,
      toolbar: {
        show: false
      }
    },
    colors: ['#1de9b6'],
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 4
    },
    yaxis: {
      tickAmount: 3
    },
    states: {
      normal: {
        filter: {
          type: 'lighten',
          value: 0.5
        }
      },
      hover: {
        filter: {
          type: 'lighten',
          value: 0
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '50%'
      }
    },
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    series: [
      {
        data: [20, 15, 22, 25, 32, 50]
      }
    ]
  };

  return (
    <div id="visitors-bar-chart">
      <ApexCharts
        options={visitorsBarChartOptions}
        series={visitorsBarChartOptions.series}
        type="bar"
        height={220}
      />
    </div>
  );
};

export default VisitorsBarChart;
