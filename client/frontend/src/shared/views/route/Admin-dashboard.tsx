"use client";

import { useState, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetRoutes, useTotalsRouteForMonth } from "../../../hooks/useRoute";
import { useTotalsUser, useTotalsUserForMonth } from "../../../hooks/useUser";
import { useTotalsRoute } from "../../../hooks/useRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { FaUsers, FaRoute, FaCalendarAlt } from "react-icons/fa";
import Card from "../../components/pages/admin/card";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import SalesMappingChart from "../../components/pages/admin/saleMap"; // Import your SalesMappingChart component
import Footer from "../../components/Footer";
import PieChart from "../../components/pages/admin/routePieChart";
import BarChart from "../../components/pages/admin/barChart";
import Header from "../../components/Header";
import EChartsReactCore from "echarts-for-react/lib/core";

const queryClient = new QueryClient();

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = 1;
  const itemsPerPage = 1000;

  // State for user pagination
  const pageFromUserUrl = parseInt(searchParams.get("userPage") || "1", 10);
  const [currentUserPage, setCurrentUserPage] = useState(pageFromUserUrl);
  const { data, isFetching, error } = useGetRoutes(currentPage, itemsPerPage);
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
  const [totalRevenue, setTotalRevenue] = useState(0);

  const { data: routeData } = useGetRoutes(currentRoutePage, itemsPerPage);

  useEffect(() => {
    setCurrentUserPage(pageFromUserUrl);
  }, [pageFromUserUrl]);

  useEffect(() => {
    setCurrentRoutePage(pageFromRouteUrl);
  }, [pageFromRouteUrl]);

  useEffect(() => {
    if (data) {
      let total = 0;
      data.pages.flatMap((page: any) => page).forEach((route: any) => {
        total += route.price;
      });
      setTotalRevenue(total);
    }
  }, [data]);

  const allRoutes = routeData?.pages.flatMap((page) => page) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <ProfileSidebar />
        <div className="flex flex-col flex-1 bg-gray-100 py-8 px-6">
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
              <h3 className="text-xl font-semibold mb-4">Total Revenue</h3>
              <BarChart totalRevenue={totalRevenue} />
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
