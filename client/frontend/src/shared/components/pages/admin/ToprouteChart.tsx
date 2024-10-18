import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register required chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface TopRoutesChartProps {
  routesData: { route: string; revenue: number }[];
}

const TopRoutesChart: React.FC<TopRoutesChartProps> = ({ routesData }) => {
  // Sort the routes data by revenue in descending order (high to low)
  const sortedRoutesData = [...routesData].sort((a, b) => b.revenue - a.revenue);

  const data = {
    labels: sortedRoutesData.map(route => route.route),  // X-axis labels are routes
    datasets: [
      {
        label: 'Revenue ($)',
        data: sortedRoutesData.map(route => route.revenue),  // Y-axis values are revenues
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Set the chart to be horizontal
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend if not necessary
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `$${tooltipItem.raw.toFixed(2)}`;  // Display revenue with dollar sign
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Route',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default TopRoutesChart;
