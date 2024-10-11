"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetRoutes, useTotalsRouteForMonth } from "../../../hooks/useRoute";
import { useTotalsUser, useTotalsUserForMonth } from "../../../hooks/useUser";
import { useTotalsRoute } from "../../../hooks/useRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import Header from "../../components/Header";
import { FaUsers, FaRoute, FaCalendarAlt } from "react-icons/fa";
import Card from "../../components/pages/admin/card";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import SalesMappingChart from "../../components/pages/admin/saleMap"; // Import your SalesMappingChart component
import Footer from "../../components/Footer";
import UserDashboard from "../../components/pages/admin/userTable";

const queryClient = new QueryClient();

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsPerPage = 10;

  // State for user pagination
  const pageFromUserUrl = parseInt(searchParams.get("userPage") || "1", 10);
  const [currentUserPage, setCurrentUserPage] = useState(pageFromUserUrl);

  // State for route pagination
  const pageFromRouteUrl = parseInt(searchParams.get("routePage") || "1", 10);
  const [currentRoutePage, setCurrentRoutePage] = useState(pageFromRouteUrl);

  // Get the current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are 0-based

  // Fetch total users and total routes using custom hooks
  const { totalUsers, loading: loadingUsers, error: errorUsers } = useTotalsUser();
  const { totalRoutes, loading: loadingRoutes, error: errorRoutes } = useTotalsRoute();
  const { totalUsersMonth, loading: loadingUsersThisMonth, error: errorUsersThisMonth } = useTotalsUserForMonth(currentYear, currentMonth);
  const { totalRoutesMonth, loading: loadingRoutesThisMonth, error: errorRoutesThisMonth } = useTotalsRouteForMonth(currentYear, currentMonth);

  // Fetch routes data (pagination for routes)
  const {
    data: routeData,
    error: routeError,
    isFetching: isFetchingRoutes,
    hasNextPage: hasNextRoutePage,
    hasPreviousPage: hasPreviousRoutePage,
    isFetchingNextPage: isFetchingNextRoutePage,
    isFetchingPreviousPage: isFetchingPreviousRoutePage,
  } = useGetRoutes(currentRoutePage, itemsPerPage);

  // Handle user pagination separately
  const handleUserPageChange = (newPage: number) => {
    setCurrentUserPage(newPage);
    router.push(`/admin/dashboard/?userPage=${newPage}`, {scroll:false});
  };

  // Handle route pagination separately
  const handleRoutePageChange = (newPage: number) => {
    setCurrentRoutePage(newPage);
    router.push(`/admin/dashboard/?routePage=${newPage}`,  {scroll:false});
  };

  useEffect(() => {
    setCurrentUserPage(pageFromUserUrl);
  }, [pageFromUserUrl]);

  useEffect(() => {
    setCurrentRoutePage(pageFromRouteUrl);
  }, [pageFromRouteUrl]);

  if (routeError instanceof Error) return <p>Error: {routeError.message}</p>;

  const allRoutes = routeData?.pages.flatMap((page) => page) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main layout container */}
      <div className="flex flex-1">

        <ProfileSidebar />

        {/* Content */}
        <div className="flex flex-col flex-1 bg-gray-200 py-16 px-8 relative">
          {/* Section Title */}
          <h2 className="text-2xl font-bold mb-4 text-left text-black">Overview</h2>

          {/* Cards Section */}
          <div className="flex justify-center items-center mb-8 bg-white rounded-lg shadow-md py-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {/* Card for Total Users */}
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
                />
              )}

              {/* Card for Total Routes */}
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
                />
              )}

              {/* Card for Total Users This Month */}
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
                />
              )}

              {/* Card for Total Routes This Month */}
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
                />
              )}
            </div>
          </div>

          {/* Section Title */}
          <h2 className="text-2xl font-bold mb-4 text-left text-black">Routes Table</h2>

          {/* Route Table Section */}
          <div className="w-full">
            <div className="w-full overflow-x-auto rounded-lg shadow-md">
              <table className="w-full whitespace-no-wrap border-black bg-white">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left bg-white text-purple-700 uppercase border-b dark:border-black">
                    <th className="px-4 py-3">Route ID</th>
                    <th className="px-4 py-3">Start Location</th>
                    <th className="px-4 py-3">End Location</th>
                    <th className="px-4 py-3">Distance (km)</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-white">
                  {isFetchingRoutes && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <Spinner label="Loading..." />
                      </td>
                    </tr>
                  )}

                  {allRoutes.length > 0
                    ? allRoutes.map((route: any) => (
                        <tr key={route.id} className="text-blue-700 dark:text-black">
                          <td className="px-4 py-3 text-sm">{route.id}</td>
                          <td className="px-4 py-3 text-sm">{route.startLocation}</td>
                          <td className="px-4 py-3 text-sm">{route.endLocation}</td>
                          <td className="px-4 py-3 text-sm">{route.distance}</td>
                          <td className="px-4 py-3 text-sm">
                            <a
                              href={`/api/route/${route.id}`}
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View Details
                            </a>
                          </td>
                        </tr>
                      ))
                    : !isFetchingRoutes && (
                        <tr>
                          <td colSpan={5} className="text-center py-4">No routes available</td>
                        </tr>
                      )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for Routes */}
            <div className="flex justify-between px-4 py-3 text-xs font-semibold tracking-wide text-purple-700 uppercase border-t">
              <button
                onClick={() => handleRoutePageChange(currentRoutePage - 1)}
                disabled={currentRoutePage <= 1 || isFetchingPreviousRoutePage}
                className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center"
              >
                {isFetchingPreviousRoutePage ? (
                  <>
                    <Spinner className="mr-2" /> Loading...
                  </>
                ) : (
                  "Previous"
                )}
              </button>

              <span>Showing page {currentRoutePage}</span>

              <button
                onClick={() => handleRoutePageChange(currentRoutePage + 1)}
                disabled={!hasNextRoutePage || isFetchingNextRoutePage}
                className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center"
              >
                {isFetchingNextRoutePage ? (
                  <>
                    <Spinner className="mr-2" /> Loading...
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </div>

            {/* User Dashboard with Independent Pagination */}
            <h2 className="text-2xl font-bold mb-4 mt-8 text-left text-black">User Dashboard</h2>
            <UserDashboard currentPage={currentUserPage} onPageChange={handleUserPageChange} />

            {/* Section Title */}
            <h2 className="text-2xl font-bold mb-4 mt-8 text-left text-black">Routes Map</h2>

            {/* Map Section */}
            <div className="mt-8 flex ">
              <div className="w-1/2 pr-4 bg-white rounded-lg shadow-md">
                <SalesMappingChart
                  routes={allRoutes.map((route: any) => ({
                    startLocation: route.startLocation,
                    endLocation: route.endLocation,
                  }))}
                  minZoomLevel={0.8}
                  maxZoomLevel={5}
                  style={{ height: 400, width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
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
