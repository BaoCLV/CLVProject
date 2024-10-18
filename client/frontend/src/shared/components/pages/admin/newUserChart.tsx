import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register required chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface NewUsersChartProps {
  userGrowthData: { date: string; users: number }[];  // Updated to receive users count by date
}

const NewUsersChart: React.FC<NewUsersChartProps> = ({ userGrowthData }) => {
  // Sort data by date
  const sortedData = [...userGrowthData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const data = {
    labels: sortedData.map(item => item.date),  // X-axis sorted dates
    datasets: [
      {
        label: 'New Users',
        data: sortedData.map(item => item.users),  // Y-axis user count
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
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
          label: function (tooltipItem: any) {
            return `${tooltipItem.raw} new users`;
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
          text: 'New Users',
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default NewUsersChart;
