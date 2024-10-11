"use client";

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { useGetAllUser, useUser } from '@/src/hooks/useUser';
import { useRoles } from '@/src/hooks/useRole'; 
import Header from '../../components/Header';
import ProfileSidebar from '../../components/pages/admin/ProfileSidebar';
import Footer from '../../components/Footer';

const queryClient = new QueryClient();

function UserDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 20;

  const { loadingRoles, errorRoles, roles } = useRoles();
  const { loading: loadingUsers } = useUser();

  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/?page=${newPage}`);
  };

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
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <Spinner label="Loading User Data..." />
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-blue-600">User List</h1>
          </div>

          <div className="w-full">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-blue-600 uppercase border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">Role</th>
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

                  {allUsers.length > 0
                    ? allUsers.map((user: any) => {
                        const userRoleName = roles.find((r: { id: any; }) => r.id === user.roleId)?.name || "No role";

                        return (
                          <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 text-sm">{user.name}</td>
                            <td className="px-6 py-4 text-sm">{user.email}</td>
                            <td className="px-6 py-4 text-sm">{user.address}</td>
                            <td className="px-6 py-4 text-sm">{user.phone_number}</td>
                            <td className="px-6 py-4 text-sm">{userRoleName}</td>
                            <td className="px-6 py-4 text-sm">
                              <a
                                href={`/admin/update/${user.id}`}
                                className="text-blue-600 hover:text-blue-500 hover:underline transition"
                              >
                                View Details
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    : !isFetching && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-gray-600">
                            No users available
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
      <UserDashboard />
    </QueryClientProvider>
  );
}

export default App;
