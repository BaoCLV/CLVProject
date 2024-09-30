"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetRoutes } from "../../../hooks/useRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import FilterButton from "../../../shared/components/FilterDropDown";
import { useGetAllUser } from '@/src/hooks/useUser';


const queryClient = new QueryClient();
function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;

  // Read page from the URL (or default to 1 if it's not set)
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  // State for filter criteria
  const [filterType, setFilterType] = useState<string>("name"); // Default filter is "name"
  const [filterQuery, setFilterQuery] = useState<string>("");

  // Sync currentPage state with URL query param
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // Function to update the URL without full page reload
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/?page=${newPage}`); // Update URL with new page, but don't reload the page
  };

  // Function to handle filtering
  const handleFilter = (type: string, query: string) => {
    setFilterType(type);
    setFilterQuery(query);
    setCurrentPage(1); // Reset to the first page when applying a new filter
    router.push(`/?filterType=${type}&filterQuery=${query}&page=1`); // Update URL with filter params
  };

  // Fetch filtered, paginated data based on currentPage, filterType, and filterQuery
  const {
    data,
    error,
    isFetching,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useGetAllUser(currentPage, itemsPerPage); // Pass filter to useGetRoutes

  if (error instanceof Error) return <p>Error: {error.message}</p>;

  // Aggregate all data from the pages into a single array
  const allRoutes = data?.pages.flatMap((page) => page) ?? [];
  console.log("allRoutes",allRoutes)

  return (
    <div className="dark  p-4">
      <h1 className="text-2xl font-bold mb-4 text-yellow-500">Dashboard</h1>

      {/* Filter Button Component */}
      {/* <FilterButton onFilter={handleFilter} /> Pass filter handler to the FilterButton */}

      <div className="w-full overflow-hidden  rounded-lg shadow-xs">
        
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap border-black bg-gray-900">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 dark:text-gray-400">
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Updated At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-blue-950">
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
                      className="text-blue-700 dark:text-gray-400"
                    >
                      <td className="px-4 py-3 text-sm">{route.name}</td>
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
        <div className="flex justify-between px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isFetchingPreviousPage}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 flex items-center"
          >
            {isFetchingPreviousPage ? (
              <>
                <Spinner className="mr-2" /> Loading...
              </>
            ) : (
              "Previous"
            )}
          </button>

          {/* Current Page Display */}
          <span>Showing page {currentPage}</span>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage || isFetchingNextPage}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 flex items-center"
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
  );
}

export default Dashboard;
