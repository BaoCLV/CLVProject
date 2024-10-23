"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useCreateRequest, useGetRoutes } from "../../../hooks/useRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react"; // Ensure you have the Spinner component installed
import Header from "../../components/Header";

import SearchBar from "../../components/searchBar";
import toast from "react-hot-toast";
import { useActiveUser } from "@/src/hooks/useActivateUser";
import Sidebar from "../../components/Sidebar";
import { FaPlus } from "react-icons/fa";
import Footer from "../../components/Footer";

const queryClient = new QueryClient();

function UserRoutesDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;

  const { activeUser, loading: userLoading } = useActiveUser();

  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const createRequest = useCreateRequest();

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

  if (userLoading || !activeUser) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <Spinner label="Loading User Data..." />
      </div>
    );
  }

  if (error instanceof Error) return <p>Error: {error.message}</p>;

  // Filter routes by the logged-in user's ID
  let userRoutes =
    data?.pages.flatMap((page) =>
      page.filter((route: any) => route.userId === activeUser.id)
    ) ?? [];

  // Utility function to return color classes based on route status
  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "delivering":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Delivering
          </span>
        );
      case "success":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Success
          </span>
        );
      case "cancel":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  // Sort function
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // If the same column is clicked again, toggle the sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If a different column is clicked, set it as the new sort column and reset direction to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Apply sorting to Routes
  if (sortColumn) {
    userRoutes = userRoutes.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Function to render the sort symbols for both ascending and descending
  const renderSortSymbols = (column: string) => {
    const active = sortColumn === column;

    return (
      <span className="ml-2">
        <span
          className={`${
            active && sortDirection === "asc"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        >
          ▲
        </span>
        <span
          className={`ml-1 ${
            active && sortDirection === "desc"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        >
          ▼
        </span>
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main layout container */}
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        {/* Content */}
        <div className="flex flex-col flex-1 bg-gray-200 py-28 px-8 relative">
          {/* Header with Search Bar and Create Route Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">My Route</h1>
          </div>
          <div className="w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-blue-600 uppercase border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4">Start Location</th>
                    <th className="px-6 py-4">End Location</th>
                    <th
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleSort("distance")}
                    >
                      Distance (km) {renderSortSymbols("distance")}
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      Price {renderSortSymbols("price")}
                    </th>
                    <th
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status {renderSortSymbols("status")}
                    </th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isFetching && (
                    <tr>
                      <td colSpan={6} className="text-center py-6">
                        <Spinner label="Loading..." />
                      </td>
                    </tr>
                  )}

                  {userRoutes.length > 0
                    ? userRoutes.map((route: any) => (
                        <tr
                          key={route.id}
                          className="hover:bg-blue-50 text-black transition-colors"
                        >
                          <td className="px-6 py-4 text-sm">
                            {route.startLocation}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {route.endLocation}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {route.distance.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm">{route.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm">
                            {getStatusLabel(route.status)}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            <a
                              href={`/api/route/${route.id}/update`}
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
                            colSpan={6}
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
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserRoutesDashboard />
    </QueryClientProvider>
  );
}

export default App;
