import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register required chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
  dailyRevenue: { date: string; revenue: number }[]; // Array of daily revenue objects
}

const BarChart: React.FC<BarChartProps> = ({ dailyRevenue }) => {
  // Sort the dailyRevenue array by date (ascending order)
  const sortedRevenue = [...dailyRevenue].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Extract labels (sorted dates) and data (sorted revenue values)
  const labels = sortedRevenue.map(item => item.date);
  const revenueData = sortedRevenue.map(item => item.revenue);

  const data = {
    labels, // Array of sorted dates
    datasets: [
      {
        label: 'Total Revenue ($)',
        data: revenueData, // Sorted revenue values
        backgroundColor: '#34d399',
        borderColor: '#10b981',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend if not needed
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `$${tooltipItem.raw.toFixed(2)}`; // Format revenue values
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
          text: 'Total Revenue ($)',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
