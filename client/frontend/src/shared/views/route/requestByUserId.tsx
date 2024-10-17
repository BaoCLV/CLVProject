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
import { useGetAllRoute, useGetRequests, useGetRoute, useGetRoutes } from '@/src/hooks/useRoute';

const queryClient = new QueryClient();
interface UserDetailProps {
    userId: string;
}

export default function RequestByUserId({ userId }: UserDetailProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemsPerPage = 10;

    // Fetch roles and requests using the respective hooks
    const { loading: loadingUsers } = useUser();
    const { loadingRoutes, errorRoutes, routes } = useGetAllRoute(); // Fetch routes here
    const { user, userLoading, userError } = getAllUserNoQuery(); // Fetch users here

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
        router.push(`/api/route/request/${userId}/?page=${newPage}`);
    };

    const handleApprove = () => {

    }

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
    } = useGetRequests(currentPage, itemsPerPage);

    if (error instanceof Error) return <p>Error: {error.message}</p>;
    if (errorRoutes instanceof Error) return <p>Error: {errorRoutes.message}</p>;
    if (userError instanceof Error) return <p>Error: {userError.message}</p>;

    const allRequests = data?.pages.flatMap((page) => page) ?? [];
    const allUser = user.users

    if (loadingUsers || loadingRoutes || userLoading) {
        return <Loading />;
    }

    console.log('Fetched routes:', routes); // Debugging: log roles
    console.log('Fetched requests:', allRequests); // Debugging: log requests
    console.log('Fetched users:', allUser); // Debugging: log requests

    return (
        <div className="flex min-h-screen bg-gray-50">
            <ProfileSidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="dark p-4 mt-16">
                    <h1 className="text-2xl font-bold mb-4 text-black">My Requests</h1>
                    <div className="w-full overflow-hidden rounded-lg shadow-xs">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full whitespace-no-wrap border-black bg-white">
                                <thead>
                                    <tr className="text-xs font-semibold tracking-wide text-left bg-white text-purple-700 uppercase border-b dark:border-black">
                                        <th className="px-4 py-3">Route Start</th>
                                        <th className="px-4 py-3">Route End</th>
                                        <th className="px-4 py-3">Request</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Created At</th>
                                        <th className="px-4 py-3">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-white">
                                    {isFetching && (
                                        <tr>
                                            <td colSpan={8} className="text-center py-4">
                                                <Spinner label="Loading..." />
                                            </td>
                                        </tr>
                                    )}

                                    {allRequests.length > 0
                                        ? allRequests
                                        .filter((request: any) => request.userId === userId)
                                        .map((request: any) => {
                                            // Match request's routeId with fetched routes
                                            const matchedRoute = routes.find((r: any) => r.id === request.routeId);

                                            const routeStart = matchedRoute ? matchedRoute.startLocation : "Unknown start";
                                            const routeEnd = matchedRoute ? matchedRoute.endLocation : "Unknown end";

                                            // Match request's routeId with fetched roles
                                            const matchedUser = allUser.find((u: any) => {
                                                return u.id === request.userId;
                                            });
                                            const username = matchedUser ? matchedUser.name : "No user";

                                            return (
                                                <tr key={request.id} className="text-blue-700 dark:text-black">
                                                    <td className="px-4 py-3 text-sm">"{routeStart}" - "{request.proposedChanges?.startLocation}"</td>
                                                    <td className="px-4 py-3 text-sm">"{routeEnd}" - "{request.proposedChanges?.endLocation}"</td>
                                                    <td className="px-4 py-3 text-sm">{request.requestType}</td>
                                                    <td className="px-4 py-3 text-sm">{request.status}</td>
                                                    <td className="px-4 py-3 text-sm">{request.createdAt}</td>
                                                    <td className="px-4 py-3 text-sm">{request.updatedAt}</td>
                                                </tr>
                                            );
                                        })
                                        : !isFetching && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-4">
                                                    No Request Available
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