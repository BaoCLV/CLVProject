"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLazyQuery } from "@apollo/client";
import { GET_ROUTES_QUERY } from "@/src/graphql/route/Action/getRoutes.action";
import { Spinner } from "@nextui-org/react";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import Header from "../../components/Header";
import SearchBar from "../../components/searchBar"; // Import your SearchBar component

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<any[]>([]); // To store search results

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

  useEffect(() => {
    if (data) {
      setSearchResults(data.routes || []);
    }
  }, [data]);

  // Function to handle page navigation (pagination)
  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * limit;
    setCurrentPage(newPage);
    router.push(`?query=${query}&limit=${limit}&offset=${newOffset}`);
  };

  // Function to handle new search queries from SearchBar
  const handleSearchResults = (searchQuery: string) => {
    setCurrentPage(1); // Reset to first page when a new search is made
    router.push(`?query=${searchQuery}&limit=${limit}&offset=0`);
  };

  if (loading) return <Spinner label="Loading..." />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const routes = searchResults || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 px-4 py-6 md:px-8 bg-white rounded-xl shadow-lg mt-6">
          {/* Header and Search Bar */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Search Results for "{query}"</h1>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs">
              <SearchBar getSearchResults={handleSearchResults} />
            </div>
          </div>

          <div className="w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-blue-600 uppercase border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Start Location</th>
                    <th className="px-6 py-4">End Location</th>
                    <th className="px-6 py-4">Distance (km)</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {routes.length > 0 ? (
                    routes.map((route: any) => (
                      <tr key={route.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 text-sm">{route.id}</td>
                        <td className="px-6 py-4 text-sm">{route.startLocation}</td>
                        <td className="px-6 py-4 text-sm">{route.endLocation}</td>
                        <td className="px-6 py-4 text-sm">{route.distance}</td>
                        <td className="px-6 py-4 text-sm">
                          <a
                            href={`/api/route/${route.id}`}
                            className="text-blue-600 hover:text-blue-500 hover:underline transition"
                          >
                            View Details
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-600">
                        No results found for "{query}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center py-6 px-4 mt-4 border-t border-gray-200">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
              >
                Previous
              </button>

              {/* Current Page Display */}
              <span className="text-gray-600">Page {currentPage}</span>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={routes.length < limit}
                className="px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
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
