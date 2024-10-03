"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // To get URL query params and manipulate routes
import { useLazyQuery } from "@apollo/client";
import { GET_ROUTES_QUERY } from "@/src/graphql/route/Action/getRoutes.action";
import { Spinner } from "@nextui-org/react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
      <Sidebar />
      <div className="flex flex-col bg-gray-200  flex-1">
        <Header />
          <h1 className="p-4 text-2xl font-bold mb-2 text-black">Search Results</h1>

          <div className="p-2 w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap bg-white">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left bg-white text-purple-700 uppercase border-b dark:border-black">
                    <th className="px-4 py-3">Start Location</th>
                    <th className="px-4 py-3">End Location</th>
                    <th className="px-4 py-3">Distance (km)</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-white">
                  {routes.length > 0 ? (
                    routes.map((route: any) => (
                      <tr key={route.id} className="text-blue-700 dark:text-black">
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
                        No results found for {query}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between px-4 py-3 text-xs font-semibold tracking-wide text-purple-700 uppercase border-t bg-gray-50 dark:bg-gray-800">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center"
              >
                Previous
              </button>

              {/* Current Page Display */}
              <span>Showing page {currentPage}</span>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={routes.length < limit}
                className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

  );
}

// Wrapping this component with Suspense
export default function SearchResultsWithSuspense() {
  return (
    <Suspense fallback={<Spinner label="Loading search results..." />}>
      <SearchResults />
    </Suspense>
  );
}
