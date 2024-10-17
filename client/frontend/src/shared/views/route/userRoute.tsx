"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useCreateRequest, useGetRoutes } from "../../../hooks/useRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react"; // Ensure you have the Spinner component installed
import { useUser } from "../../../hooks/useUser";
import Header from "../../components/Header";

import SearchBar from "../../components/searchBar";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import toast from "react-hot-toast";

const queryClient = new QueryClient();

function UserRoutesDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;
  // const proposedChanges = {
  //   startLocation,
  //   endLocation,
  //   distance
  // }

  const { user, loading: userLoading } = useUser();

  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const createRequest = useCreateRequest();

  const handleSearchResults = (results: any) => {
    setSearchResults(results);
    console.log("Search Results:", results);
  };

  const handleCreateRequest = async (userId: string, routeId: string, requestType: string, proposedChanges: Object) => {
    try {
      console.log("userId", userId)
      console.log("routeId", routeId)
      console.log("requestType", requestType)
      console.log("proposedChanges", proposedChanges)

      await createRequest(userId, routeId, requestType, proposedChanges)
      toast.success("Create Request Successfully");
      window.location.reload(); // Reload the page
    } catch (err) {
      console.error('Error updating request:', err);
    }
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
  const userRoutes =
    data?.pages.flatMap((page) =>
      page.filter((route: any) => route.userId === user.id)
    ) ?? [];

  return (
    <div className="flex h-screen bg-gray-50">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 px-4 py-6 md:px-8 bg-white rounded-xl shadow-lg mt-6">
          {/* Header and Search Bar */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">My Routes</h1>

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

                  {userRoutes.length > 0
                    ? userRoutes.map((route: any) => (
                      <tr
                        key={route.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-black">
                          {route.startLocation}
                        </td>
                        <td className="px-6 py-4 text-sm text-black">
                          {route.endLocation}
                        </td>
                        <td className="px-6 py-4 text-sm text-black">
                          {route.distance}
                        </td>
                        {/* <td className="px-6 py-4 text-sm text-black">
                          <div className="flex space-x-2 ">
                            <button
                              onClick={() => handleCreateRequest(user.id, route.id, "update")}
                              className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center justify-center"
                            >
                              Request Update
                            </button>
                          </div>
                        </td> */}

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
                className={`px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 ${isFetchingPreviousPage ? "cursor-wait" : ""
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
                className={`px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 ${isFetchingNextPage ? "cursor-wait" : ""
                  }`}
              >
                {isFetchingNextPage ? "Loading..." : "Next"}
              </button>
            </div>
          </div>
        </main>
      </div>
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
