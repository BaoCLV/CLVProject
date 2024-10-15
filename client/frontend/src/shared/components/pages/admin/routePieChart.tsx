import { useGetRoutes } from '@/src/hooks/useRoute';
import { Spinner } from '@nextui-org/react'; // Or any loading spinner component
import PieChart from '../../PieChart';
import { useEffect, useState } from 'react';

const RoutePieChart = () => {
  const { data, isFetching, error } = useGetRoutes();
  
  const [routeStatusCount, setRouteStatusCount] = useState({
    pending: 0,
    delivering: 0,
    success: 0,
    cancel: 0,
  });

  useEffect(() => {
    if (data) {
      const statusCount = {
        pending: 0,
        delivering: 0,
        success: 0,
        cancel: 0,
      };

      // Loop through all the routes and count their statuses
      data.pages.flatMap((page: any) => page).forEach((route: any) => {
        if (route.status === 'pending') {
          statusCount.pending += 1;
        } else if (route.status === 'delivering') {
          statusCount.delivering += 1;
        } else if (route.status === 'success') {
          statusCount.success += 1;
        } else if (route.status === 'cancel') {
          statusCount.cancel += 1;
        }
      });

      setRouteStatusCount(statusCount);
    }
  }, [data]);

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner label="Loading routes..." />
      </div>
    );
  }

  if (error) {
    return <p>Error loading routes: {error.message}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Route Status Breakdown</h1>

      {/* Pie Chart */}
      <div className="w-[400px] h-[400px] mx-auto">
        <PieChart routeData={routeStatusCount} />
      </div>
    </div>
  );
};

export default RoutePieChart;
