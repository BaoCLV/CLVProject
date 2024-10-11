"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetRoutes } from "@/src/hooks/useRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react"; // Ensure you have the Spinner component installed
import { useUser } from "@/src/hooks/useUser";
import Header from "../../Header";

import SearchBar from "../../searchBar";
import ProfileSidebar from "./ProfileSidebar";
import Footer from "../../Footer";

const queryClient = new QueryClient();

function RoutePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;

  const { user, loading: userLoading } = useUser();

  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchResults = (results: any) => {
    setSearchResults(results);
    console.log("Search Results:", results);
  };

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // Function to update the URL without full page reload
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/dashboard/?page=${newPage}`);
  };

  // Fetch filtered, paginated data based on currentPage
  const {
    data,
    error,
    isFetching,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useGetRoutes(currentPage, itemsPerPage);

  if (userLoading || !user) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <Spinner label="Loading User Data..." />
      </div>
    );
  }

  if (error instanceof Error) return <p>Error: {error.message}</p>;

  // Filter routes by the logged-in user's ID
  const Routes =
    data?.pages.flatMap((page) =>page) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main layout container */}
      <div className="flex flex-1">

        <ProfileSidebar />

        {/* Content */}
        <div className="flex flex-col flex-1 bg-gray-200 py-16 px-8 relative">
          {/* Header and Search Bar */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Route Page</h1>

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
                    <th className="px-6 py-4">Route ID</th>
                    <th className="px-6 py-4">Start Location</th>
                    <th className="px-6 py-4">End Location</th>
                    <th className="px-6 py-4">Distance (km)</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isFetching && (
                    <tr>
                      <td colSpan={5} className="text-center py-6">
                        <Spinner label="Loading..." />
                      </td>
                    </tr>
                  )}

                  {Routes.length > 0
                    ? Routes.map((route: any) => (
                        <tr
                          key={route.id}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm">{route.id}</td>
                          <td className="px-6 py-4 text-sm">
                            {route.startLocation}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {route.endLocation}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {route.distance}
                          </td>
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
                    : !isFetching && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-6 text-gray-600"
                          >
                            No routes available for this user
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
                disabled={currentPage <= 1 || isFetchingPreviousPage}
                className={`px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 ${
                  isFetchingPreviousPage ? "cursor-wait" : ""
                }`}
              >
                {isFetchingPreviousPage ? "Loading..." : "Previous"}
              </button>

              {/* Current Page Display */}
              <span className="text-gray-600">Page {currentPage}</span>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || isFetchingNextPage}
                className={`px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 ${
                  isFetchingNextPage ? "cursor-wait" : ""
                }`}
              >
                {isFetchingNextPage ? "Loading..." : "Next"}
              </button>
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
      <RoutePage />
    </QueryClientProvider>
  );
}

export default App;
