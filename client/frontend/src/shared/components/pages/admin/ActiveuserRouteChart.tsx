import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement } from 'chart.js';

// Register required chart elements
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

interface ActiveUsersRoutesChartProps {
  data: { date: string; users: number; routes: number }[];
}

const ActiveUsersRoutesChart: React.FC<ActiveUsersRoutesChartProps> = ({ data }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = {
    labels: sortedData.map(item => item.date),  // X-axis sorted dates
    datasets: [
      {
        label: 'Active Users',
        data: sortedData.map(item => item.users),
        fill: false,
        borderColor: '#4CAF50',
        backgroundColor: '#4CAF50',
        tension: 0.1,
      },
      {
        label: 'Active Routes',
        data: sortedData.map(item => item.routes),
        fill: false,
        borderColor: '#FF6384',
        backgroundColor: '#FF6384',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ActiveUsersRoutesChart;
