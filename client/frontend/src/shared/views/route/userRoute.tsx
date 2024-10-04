'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useGetRoutes } from '../../../hooks/useRoute';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@nextui-org/react'; // Ensure you have the Spinner component installed
import { useUser } from '../../../hooks/useUser'; // Import your hook to get logged-in user data
import Header from '../../components/Header';
import ProfileSidebar from '../../components/ProfileSidebar';

const queryClient = new QueryClient();

function UserRoutesDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;

  // Fetch logged-in user
  const { user, loading: userLoading } = useUser();

  // Read page from the URL (or default to 1 if it's not set)
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  // State for filter criteria
  const [filterType, setFilterType] = useState<string>('name'); // Default filter is "name"
  const [filterQuery, setFilterQuery] = useState<string>('');

  // Sync currentPage state with URL query param
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  // Function to update the URL without full page reload
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/dashboard/?page=${newPage}`); // Update URL with new page, but don't reload the page
  };

  // Function to handle filtering (not used in this example but can be expanded)
  const handleFilter = (type: string, query: string) => {
    setFilterType(type);
    setFilterQuery(query);
    setCurrentPage(1); // Reset to the first page when applying a new filter
    router.push(`/?filterType=${type}&filterQuery=${query}&page=1`); // Update URL with filter params
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
      <div className="flex h-screen bg-gray-100 dark:bg-gray-600 items-center justify-center">
        <Spinner label="Loading User Data..." />
      </div>
    );
  }

  if (error instanceof Error) return <p>Error: {error.message}</p>;

  // Filter routes by the logged-in user's ID
  const userRoutes = data?.pages.flatMap((page) => page.filter((route: any) => route.userId === user.id)) ?? [];

  return (

        <div className="dark p-4">
          <h1 className="text-2xl font-bold mb-4 text-black">My Routes</h1>

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

                  {userRoutes.length > 0
                    ? userRoutes.map((route: any) => (
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
                    : !isFetching && (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            No routes available for this user
                          </td>
                        </tr>
                      )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between px-4 py-3 text-xs font-semibold tracking-wide text-purple-700 uppercase border-t">
              {/* Previous Button */}
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
                  'Previous'
                )}
              </button>

              {/* Current Page Display */}
              <span>Showing page {currentPage}</span>

              {/* Next Button */}
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
                  'Next'
                )}
              </button>
            </div>
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
