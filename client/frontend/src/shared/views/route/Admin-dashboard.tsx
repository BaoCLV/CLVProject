"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetRoutes } from "../../../hooks/useRoute"; // Assuming useGetRoutes is fetching the routes data
import { useTotalsUser } from "../../../hooks/useUser"; // Hook for fetching total users
import { useTotalsRoute } from "../../../hooks/useRoute"; // Hook for fetching total routes
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Card from "../../components/Card"; // Import the Card component
import { FaUsers, FaRoute } from "react-icons/fa"; // For icons

const queryClient = new QueryClient();

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;

  // Fetch total users and total routes using custom hooks
  //const { totalUsers, loading: loadingUsers, error: errorUsers } = useTotalsUser();
  const { totalRoutes, loading: loadingRoutes, error: errorRoutes } = useTotalsRoute();

  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/dashboard/?page=${newPage}`);
  };

  // const handleFilter = (type: string, query: string) => {
  //   setFilterType(type);
  //   setFilterQuery(query);
  //   setCurrentPage(1);
  //   router.push(`/?filterType=${type}&filterQuery=${query}&page=1`);
  // };

  const {
    data,
    error,
    isFetching,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useGetRoutes(currentPage, itemsPerPage);

  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const allRoutes = data?.pages.flatMap((page) => page) ?? [];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-200 border-black">
        <Header />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-black">Dashboard</h1>

          {/* Cards Section */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            {/* Card for Total Users
            {loadingUsers ? (
              <Spinner label="Loading Users..." />
            ) : errorUsers ? (
              <p>Error loading users: {errorUsers.message}</p>
            ) : (
              <Card
                icon={<FaUsers className="w-5 h-5" />}
                title="Total Users"
                value={totalUsers}
              />
            )} */}

            {/* Card for Total Routes */}
            {loadingRoutes ? (
              <Spinner label="Loading Routes..." />
            ) : errorRoutes ? (
              <p>Error loading routes: {errorRoutes.message}</p>
            ) : (
              <Card
                icon={<FaRoute className="w-5 h-5" />}
                title="Total Routes"
                value={totalRoutes}
              />
            )}
          </div>

          {/* Table Section */}
          <div className="w-full">
            <div className="w-full overflow-x-auto">
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
                  {isFetching && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <Spinner label="Loading..." />
                      </td>
                    </tr>
                  )}

                  {allRoutes.length > 0
                    ? allRoutes.map((route: any) => (
                        <tr
                          key={route.id}
                          className="text-blue-700 dark:text-black"
                        >
                          <td className="px-4 py-3 text-sm">{route.id}</td>
                          <td className="px-4 py-3 text-sm">
                            {route.startLocation}
                          </td>
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
                    : !isFetching && (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            No routes available
                          </td>
                        </tr>
                      )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between px-4 py-3 text-xs font-semibold tracking-wide text-purple-700 uppercase border-t">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isFetchingPreviousPage}
                className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center"
              >
                {isFetchingPreviousPage ? (
                  <>
                    <Spinner className="mr-2" /> Loading...
                  </>
                ) : (
                  "Previous"
                )}
              </button>

              <span>Showing page {currentPage}</span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || isFetchingNextPage}
                className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center"
              >
                {isFetchingNextPage ? (
                  <>
                    <Spinner className="mr-2" /> Loading...
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
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
