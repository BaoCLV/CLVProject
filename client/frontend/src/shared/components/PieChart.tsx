import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  routeData: {
    pending: number;
    delivering: number;
    success: number;
    cancel: number;
  };
}

const PieChart: React.FC<PieChartProps> = ({ routeData }) => {
  const data = {
    labels: ['Pending', 'Delivering', 'Success', 'Cancel'],
    datasets: [
      {
        label: '% of Routes',
        data: [
          routeData.pending,
          routeData.delivering,
          routeData.success,
          routeData.cancel,
        ],
        backgroundColor: ['#d1d5db', '#60a5fa', '#34d399', '#f87171'], // Colors for statuses
        hoverBackgroundColor: ['#9ca3af', '#3b82f6', '#10b981', '#ef4444'],
        borderColor: ['#e5e7eb', '#bfdbfe', '#6ee7b7', '#fecaca'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw;
            const total =
              routeData.pending +
              routeData.delivering +
              routeData.success +
              routeData.cancel;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
