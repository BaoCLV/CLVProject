"use client";

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner, user } from "@nextui-org/react";
import { getAllUserNoQuery, useGetAllUser, useUser } from '@/src/hooks/useUser';
import { useRoles } from '@/src/hooks/useRole'; // Import useRoles hook
import Header from '../../components/Header';
import ProfileSidebar from '../../components/pages/admin/ProfileSidebar';
import Loading from '../../components/Loading';
import { io } from 'socket.io-client';
import { useApproveRequestStatus, useGetAllRoute, useGetRequests, useGetRoute, useGetRoutes, useRejectRequestStatus } from '@/src/hooks/useRoute';
import toast from 'react-hot-toast';
import { useActiveUser } from '@/src/hooks/useActivateUser';
import SearchBar from '../../components/searchBar';

const queryClient = new QueryClient();

function PendingRequest() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemsPerPage = 10;

    // Fetch roles and requests using the respective hooks
    const { loading } = useActiveUser();

    const { loadingRoutes, errorRoutes, routes } = useGetAllRoute(); // Fetch routes here
    const { user, userLoading, userError } = getAllUserNoQuery(); // Fetch users here
    const approveRequestStatus = useApproveRequestStatus();
    const rejectRequestStatus = useRejectRequestStatus();



    // Handle pagination and filtering for users
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const [searchResults, setSearchResults] = useState<any[]>([]); // State for search results

    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [pageFromUrl]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`/admin/requestList/?page=${newPage}`);
    };

    // Fetch requests data
    const {
        data,
        error,
        isFetching,
        hasNextPage,
        hasPreviousPage,
        isFetchingNextPage,
        isFetchingPreviousPage,
    } = useGetRequests(currentPage, itemsPerPage);

    if (error instanceof Error) return <p>Error: {error.message}</p>;
    if (errorRoutes instanceof Error) return <p>Error: {errorRoutes.message}</p>;
    if (userError instanceof Error) return <p>Error: {userError.message}</p>;

    const allRequests = data?.pages.flatMap((page) => page) ?? [];
    const allUser = user.users

    // Search Handler
    const handleSearch = (query: string) => {
        if (query) {
            const filteredUsers = allUser.filter((user: any) => {
                return (
                    user.name.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase())
                );
            });
            setSearchResults(filteredUsers);
        } else {
            setSearchResults(allUser); // Reset search results if query is empty
        }
    };

    if (loading || loadingRoutes || userLoading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Main layout container */}
            <Header />
            <div className="flex flex-1">
                <ProfileSidebar />

                {/* Content */}
                <div className="flex flex-col flex-1 bg-gray-200 py-28 px-8 relative">
                    {/* Header with Search Bar and Create User Button */}
                    <div className="flex flex-wrap justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-600">Pending Request</h1>

                        {/* Search Bar */}
                        <div className="flex items-center gap-4">
                            <SearchBar getSearchResults={handleSearch} />
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full whitespace-no-wrap table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="text-xs font-semibold tracking-wide text-left text-blue-600 uppercase border-b border-gray-200 bg-gray-50">
                                        <th className="px-6 py-4">User Name</th>
                                        <th className="px-6 py-4">Route Start</th>
                                        <th className="px-6 py-4">Route End</th>
                                        <th className="px-6 py-4">Request Type</th>
                                        <th className="px-6 py-4">Created At</th>
                                        <th className="px-6 py-4">Action</th>
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

                                    {allRequests.length > 0
                                        ? allRequests
                                            .filter((request: any) => request.status === "pending") // Filter for pending requests
                                            .map((request: any) => {
                                                // Match request's routeId with fetched roles
                                                const matchedRoute = routes.find((r: any) => r.id === request.routeId);
                                                const requestRouteId = matchedRoute ? matchedRoute.id : "No route";

                                                const routeStart = matchedRoute ? matchedRoute.startLocation : "Unknown start";
                                                const routeEnd = matchedRoute ? matchedRoute.endLocation : "Unknown end";

                                                // Match request's routeId with fetched roles
                                                const matchedUser = allUser.find((u: any) => {
                                                    return u.id === request.userId;
                                                });
                                                const username = matchedUser ? matchedUser.name : "No user";

                                                return (
                                                    <tr key={request.id} className="hover:bg-blue-50 text-black transition-colors">
                                                        <td className="px-6 py-4 text-sm">{username}</td>
                                                        <td className="px-6 py-4 text-sm">{routeStart}</td>
                                                        <td className="px-6 py-4 text-sm">{routeEnd}</td>
                                                        <td className="px-6 py-4 text-sm">{request.requestType}</td>
                                                        <td className="px-6 py-4 text-sm">{request.createdAt}</td>
                                                        {/* <td className="px-6 py-4 text-sm">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleApproveStatus(request.id, "approved")}
                                                                    className="flex-1 px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center justify-center"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectStatus(request.id, "rejected")}
                                                                    className="flex-1 px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 flex items-center justify-center"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </td> */}
                                                        <td className="px-6 py-4 text-sm">
                                                            <a
                                                                href={`/admin/pendingRequest/${request.id}`}
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
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <PendingRequest />
        </QueryClientProvider>
    );
}

export default App;
