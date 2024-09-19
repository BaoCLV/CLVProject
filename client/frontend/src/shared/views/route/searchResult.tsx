"use client";

import { useSearchParams, useRouter } from "next/navigation"; // To get URL query params and manipulate routes
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ROUTES_QUERY } from "@/src/graphql/route/Action/getRoutes.action";
import { Spinner } from "@nextui-org/react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function SearchResults() {
  const searchParams = useSearchParams(); // Hook to read URL query params
  const router = useRouter(); // For updating the query params in the URL
  const query = searchParams.get("query") || ""; // Get query from URL
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Get limit from URL
  const offset = parseInt(searchParams.get("offset") || "0", 10); // Get offset from URL

  const [currentPage, setCurrentPage] = useState(1);

  // Use LazyQuery to fetch data when search params change
  const [fetchRoutes, { loading, data, error }] = useLazyQuery(GET_ROUTES_QUERY, {
    fetchPolicy: "network-only", // Always fetch from server to avoid stale data
  });

  useEffect(() => {
    if (query) {
      fetchRoutes({
        variables: {
          query,
          limit,
          offset,
        },
      });
    }
  }, [query, limit, offset, fetchRoutes]);

  // Function to handle page navigation (pagination)
  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * limit;
    setCurrentPage(newPage);
    router.push(`?query=${query}&limit=${limit}&offset=${newOffset}`);
  };

  if (loading) return <Spinner label="Loading..." />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const routes = data?.routes || []; // Ensure results are fetched

  return (
    <div className="flex h-screen">
    <Sidebar/>
    <div className="flex flex-col bg-gray-100 dark:bg-gray-600 flex-1">
      <Header />
    <div className="dark w-flex  h-flex p-4">
      <h1 className="text-2xl font-bold mb-4 text-yellow-500">Search results</h1>

      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap bg-gray-900">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 dark:text-gray-400">
                <th className="px-4 py-3">Route Name</th>
                <th className="px-4 py-3">Start Location</th>
                <th className="px-4 py-3">End Location</th>
                <th className="px-4 py-3">Distance (km)</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-blue-950">
              {routes.length > 0 ? (
                routes.map((route: any) => (
                  <tr key={route.id} className="text-blue-700 dark:text-gray-400">
                    <td className="px-4 py-3 text-sm">{route.name}</td>
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
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No results found for "{query}".
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
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 flex items-center"
          >
            Previous
          </button>

          {/* Current Page Display */}
          <span>Showing page {currentPage}</span>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={routes.length < limit}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 flex items-center"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
