import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register required chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
  totalRevenue: number;
}

const BarChart: React.FC<BarChartProps> = ({ totalRevenue }) => {
  const data = {
    labels: ['Total Revenue'], // Single label
    datasets: [
      {
        label: 'Total Revenue ($)',
        data: [totalRevenue], // Single data point
        backgroundColor: '#34d399', // Green color for revenue
        borderColor: '#10b981',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend since there's only one bar
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `$${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Revenue ($)',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
