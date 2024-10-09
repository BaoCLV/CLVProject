"use client";

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { useGetAllUser, useUser } from '@/src/hooks/useUser';
import { useRoles } from '@/src/hooks/useRole'; // Import useRoles hook
import Header from '../../components/Header';
import ProfileSidebar from '../../components/pages/admin/ProfileSidebar';
import Loading from '../../components/Loading';

const queryClient = new QueryClient();

function UserDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;

  // Fetch roles and users using the respective hooks
  const { loadingRoles, errorRoles, roles } = useRoles(); // Fetch roles here
  const { loading: loadingUsers } = useUser();

  // Handle pagination and filtering for users
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [filterType, setFilterType] = useState<string>("name");
  const [filterQuery, setFilterQuery] = useState<string>("");

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/?page=${newPage}`);
  };

  const handleFilter = (type: string, query: string) => {
    setFilterType(type);
    setFilterQuery(query);
    setCurrentPage(1);
    router.push(`/?filterType=${type}&filterQuery=${query}&page=1`);
  };

  // Fetch users data
  const {
    data,
    error,
    isFetching,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useGetAllUser(currentPage, itemsPerPage);

  if (error instanceof Error) return <p>Error: {error.message}</p>;
  if (errorRoles instanceof Error) return <p>Error: {errorRoles.message}</p>;

  const allUsers = data?.pages.flatMap((page) => page) ?? [];

  if (loadingUsers || loadingRoles) {
    return <Loading />;
  }

  console.log('Fetched roles:', roles); // Debugging: log roles
  console.log('Fetched users:', allUsers); // Debugging: log users

  return (
    <div className="flex h-screen bg-gray-50">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="dark p-4">
          <h1 className="text-2xl font-bold mb-4 text-black">User List</h1>
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap border-black bg-white">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left bg-white text-purple-700 uppercase border-b dark:border-black">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Phone Number</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Detail</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-white">
                  {isFetching && (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        <Spinner label="Loading..." />
                      </td>
                    </tr>
                  )}

                  {allUsers.length > 0
                    ? allUsers.map((user: any) => {
                        // Debugging: log user roleId and matched roles
                        console.log(`User: ${user.name}, RoleId: ${user.roleId}`);

                        // Match user's roleId with fetched roles
                        const userRoleName = roles.find((r) => r.id === user.roleId)?.name || "No role";

                        console.log(`Matched role for ${user.name}: ${userRoleName}`); // Debugging

                        return (
                          <tr key={user.id} className="text-blue-700 dark:text-black">
                            <td className="px-4 py-3 text-sm">{user.name}</td>
                            <td className="px-4 py-3 text-sm">{user.email}</td>
                            <td className="px-4 py-3 text-sm">{user.address}</td>
                            <td className="px-4 py-3 text-sm">{user.phone_number}</td>
                            <td className="px-4 py-3 text-sm">{userRoleName}</td>
                            <td className="px-4 py-3 text-sm">
                              <a
                                href={`/admin/update/${user.id}`}
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                View Details
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    : !isFetching && (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No users available
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
      <UserDashboard />
    </QueryClientProvider>
  );
}

export default App;
