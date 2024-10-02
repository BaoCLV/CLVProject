"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import FilterButton from "../../components/FilterDropDown";
import { useGetAllUser } from '@/src/hooks/useUser';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';


const queryClient = new QueryClient();
function UserDashboard() {
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
  } = useGetAllUser(currentPage, itemsPerPage); // Pass filter to useGetAllUser

  if (error instanceof Error) return <p>Error: {error.message}</p>;

  // Aggregate all data from the pages into a single array
  const allUsers = data?.pages.flatMap((page) => page) ?? [];
  console.log("allUsers", allUsers)

  return (

    <div className="dark  p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">User List</h1>

      {/* Filter Button Component */}
      {/* <FilterButton onFilter={handleFilter} /> Pass filter handler to the FilterButton */}

      <div className="w-full overflow-hidden  rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap border-black bg-white">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left bg-white text-purple-700 uppercase border-b dark:border-black">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Detail</th>
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

              {allUsers.length > 0
                ? allUsers.map((user: any) => (
                  <tr
                    key={user.id}
                    className="text-blue-700 dark:text-black"
                  >
                    <td className="px-4 py-3 text-sm">{user.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm">{user.address}</td>
                    <td className="px-4 py-3 text-sm">{user.phone_number}</td>
                    <td className="px-4 py-3 text-sm">
                      <a
                        href={`/api/user/${user.id}`}
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
                      No user available
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between px-4 py-3 text-xs font-semibold tracking-wide text-purple-700 uppercase border-t ">
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
              "Previous"
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
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
