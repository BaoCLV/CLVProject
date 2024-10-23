"use client";

import { useState, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetRoutes, useTotalsRouteForMonth } from "../../../hooks/useRoute";
import { useTotalsUser, useTotalsUserForMonth, useGetAllUser } from "../../../hooks/useUser";
import { useTotalsRoute } from "../../../hooks/useRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { FaUsers, FaRoute, FaCalendarAlt } from "react-icons/fa";
import Card from "../../components/pages/admin/card";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import SalesMappingChart from "../../components/pages/admin/saleMap"; // Import your SalesMappingChart component
import Footer from "../../components/Footer";
import PieChart from "../../components/pages/admin/routePieChart";
import BarChart from "../../components/pages/admin/barChart"; // Already built to display revenue by day
import Header from "../../components/Header";
import ActiveUsersRoutesChart from "../../components/pages/admin/ActiveuserRouteChart";
import NewUsersChart from "../../components/pages/admin/newUserChart";
import TopRoutesChart from "../../components/pages/admin/ToprouteChart";
import EChartsReactCore from "echarts-for-react/lib/core";

const queryClient = new QueryClient();

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsPerPage = 1000;

  // State for user pagination
  const pageFromUserUrl = parseInt(searchParams.get("userPage") || "1", 10);
  const [currentUserPage, setCurrentUserPage] = useState(pageFromUserUrl);

  const { data, isFetching, error } = useGetRoutes();
  const { data: usersData } = useGetAllUser(currentUserPage, itemsPerPage);

  // State for route pagination
  const pageFromRouteUrl = parseInt(searchParams.get("routePage") || "1", 10);
  const [currentRoutePage, setCurrentRoutePage] = useState(pageFromRouteUrl);
  const salesMappingChartRef = useRef<EChartsReactCore | null>(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const { totalUsers, loading: loadingUsers, error: errorUsers } = useTotalsUser();
  const { totalRoutes, loading: loadingRoutes, error: errorRoutes } = useTotalsRoute();
  const { totalUsersMonth, loading: loadingUsersThisMonth, error: errorUsersThisMonth } = useTotalsUserForMonth(currentYear, currentMonth);
  const { totalRoutesMonth, loading: loadingRoutesThisMonth, error: errorRoutesThisMonth } = useTotalsRouteForMonth(currentYear, currentMonth);
  
  const [dailyRevenue, setDailyRevenue] = useState<{ date: string; revenue: number }[]>([]);
  const [userRouteData, setUserRouteData] = useState<{ date: string, users: number, routes: number }[]>([]);
  const [topRoutesData, setTopRoutesData] = useState<{ route: string, revenue: number }[]>([]);
  const [newUsersData, setNewUsersData] = useState<{ date: string, users: number }[]>([]);

  // Fetch routes data (pagination for routes)
  const {
    data: routeData,
    error: routeError,
    isFetching: isFetchingRoutes,
    hasNextPage: hasNextRoutePage,
    hasPreviousPage: hasPreviousRoutePage,
    isFetchingNextPage: isFetchingNextRoutePage,
    isFetchingPreviousPage: isFetchingPreviousPage,
  } = useGetRoutes(currentRoutePage, itemsPerPage);

  // Handle user pagination separately
  const handleUserPageChange = (newPage: number) => {
    setCurrentUserPage(newPage);
    router.push(`/admin/dashboard/?userPage=${newPage}`, { scroll: false });
  };

  // Handle route pagination separately
  const handleRoutePageChange = (newPage: number) => {
    setCurrentRoutePage(newPage);
    router.push(`/admin/dashboard/?routePage=${newPage}`, { scroll: false });
  };

  useEffect(() => {
    setCurrentUserPage(pageFromUserUrl);
  }, [pageFromUserUrl]);

  useEffect(() => {
    setCurrentRoutePage(pageFromRouteUrl);
  }, [pageFromRouteUrl]);

  // Utility to group routes by date and calculate total revenue per day
  const groupRoutesByDate = (routes: any[]) => {
    const revenueByDay: { [key: string]: number } = {};

    routes.forEach((route) => {
      const date = new Date(route.createdAt).toISOString().split('T')[0];   
      if (!revenueByDay[date]) {
        revenueByDay[date] = 0;
      }
      revenueByDay[date] += route.price;
    });

    return Object.keys(revenueByDay).map((date) => ({
      date,
      revenue: revenueByDay[date],
    }));
  };

  const groupUsersAndRoutesByDate = (users: any[], routes: any[]) => {
    const result: { [key: string]: { users: number, routes: number } } = {};
  
    // Count users by date
    users.forEach(user => {
      const date = new Date(user.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!result[date]) result[date] = { users: 0, routes: 0 };
      result[date].users += 1;
    });
  
    // Count active routes (pending or delivering) by date
    routes.forEach(route => {
      const date = new Date(route.createdAt).toISOString().split('T')[0];
  
      // Only count routes with status 'pending' or 'delivering'
      if (route.status === 'pending' || route.status === 'delivering') {
        if (!result[date]) result[date] = { users: 0, routes: 0 };
        result[date].routes += 1;
      }
    });
  
    // Convert result object into an array of objects
    return Object.keys(result).map(date => ({
      date,
      users: result[date].users,
      routes: result[date].routes,
    }));
  };

  const groupUsersByDate = (users: { createdAt: string }[]) => {
    const usersByDay: { [key: string]: number } = {};
  
    users.forEach((user) => {
      const date = new Date(user.createdAt).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      if (!usersByDay[date]) {
        usersByDay[date] = 0;
      }
      usersByDay[date] += 1;
    });
  
    return Object.keys(usersByDay).map((date) => ({
      date,
      users: usersByDay[date],
    }));
  };

  // Process data for charts when data is available
  useEffect(() => {
    if (data && usersData) {
      const allRoutes = data.pages.flatMap((page: any) => page);
      
      const allUsers = usersData.pages.flatMap((page: any) => page);
      console.log(allUsers)
      console.log(usersData.pages)
      
      // Process daily revenue for BarChart
      const dailyRevenueData = groupRoutesByDate(allRoutes);
      setDailyRevenue(dailyRevenueData);

      // Process users and routes for ActiveUsersRoutesChart
      const userRouteData = groupUsersAndRoutesByDate(allUsers, allRoutes);
      setUserRouteData(userRouteData);

      const newUsersData = groupUsersByDate(allUsers);
      setNewUsersData(newUsersData);

      // Process top routes for TopRoutesChart
      const topRoutesData = allRoutes.map(route => ({
        route: route.startLocation,
        revenue: route.price,
      }));
      setTopRoutesData(topRoutesData);
    }
  }, [data, usersData]);

  if (routeError instanceof Error) return <p>Error: {routeError.message}</p>;

  const allRoutes = routeData?.pages.flatMap((page) => page) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main layout container */}
      <Header />
      <div className="flex flex-1">
        <ProfileSidebar />
        <div className="flex flex-col flex-1 bg-gray-100 py-28 px-6">
          <h2 className="text-3xl font-bold mb-6 text-left text-gray-800">Overview</h2>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-2 xl:grid-cols-4 mb-8 bg-white rounded-lg shadow-md py-6 px-4">
            {loadingUsers ? (
              <Spinner label="Loading Users..." />
            ) : errorUsers ? (
              <p>Error loading users: {errorUsers.message}</p>
            ) : (
              <Card
                icon={<FaUsers className="w-5 h-5 text-white" />}
                title="Total Users"
                value={totalUsers}
                color="bg-pink-200"
                iconBgColor="bg-red-500"
                onClick={() => router.push("/admin/userlist")}
              />
            )}
            {loadingRoutes ? (
              <Spinner label="Loading Routes..." />
            ) : errorRoutes ? (
              <p>Error loading routes: {errorRoutes.message}</p>
            ) : (
              <Card
                icon={<FaRoute className="w-5 h-5 text-white" />}
                title="Total Routes"
                value={totalRoutes}
                color="bg-orange-200"
                iconBgColor="bg-orange-500"
                onClick={() => router.push("/admin/route")}
              />
            )}
            {loadingUsersThisMonth ? (
              <Spinner label="Loading Monthly Users..." />
            ) : errorUsersThisMonth ? (
              <p>Error loading monthly users: {errorUsersThisMonth.message}</p>
            ) : (
              <Card
                icon={<FaCalendarAlt className="w-5 h-5 text-white" />}
                title="Users This Month"
                value={totalUsersMonth}
                color="bg-green-200"
                iconBgColor="bg-green-500"
                onClick={() => router.push("/admin/userlist")}
              />
            )}
            {loadingRoutesThisMonth ? (
              <Spinner label="Loading Monthly Routes..." />
            ) : errorRoutesThisMonth ? (
              <p>Error loading monthly routes: {errorRoutesThisMonth.message}</p>
            ) : (
              <Card
                icon={<FaCalendarAlt className="w-5 h-5 text-white" />}
                title="Routes This Month"
                value={totalRoutesMonth}
                color="bg-purple-200"
                iconBgColor="bg-purple-500"
                onClick={() => router.push("/admin/route")}
              />
            )}
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Route Distribution</h3>
              <PieChart />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Total Revenue by Day</h3>
              <BarChart dailyRevenue={dailyRevenue} /> {/* Pass dailyRevenue data */}
            </div>
          </div>

          {/* New Charts Section */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
            {/* Active Users and Routes Over Time */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Active Users and Routes Over Time</h3>
              <ActiveUsersRoutesChart data={userRouteData} /> {/* Pass user and route data */}
            </div>

            {/* New Users Over Time */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">New Users Over Time</h3>
              <NewUsersChart userGrowthData={newUsersData} /> {/* Pass new users data */}
            </div>

            {/* Top Routes by Revenue */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Top Routes by Revenue</h3>
              <TopRoutesChart routesData={topRoutesData} /> {/* Pass top routes data */}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <h3 className="text-xl font-semibold mb-4">Routes Map</h3>
            <div className="w-full h-[400px]">
            <SalesMappingChart
          salesMappingChartRef={salesMappingChartRef} // Pass the ref here
          routes={allRoutes.map((route: any) => ({
            startLocation: route.startLocation,
            endLocation: route.endLocation,
          }))}
          minZoomLevel={0.8}
          maxZoomLevel={5}
          style={{ height: 400, width: '100%' }}
        />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
