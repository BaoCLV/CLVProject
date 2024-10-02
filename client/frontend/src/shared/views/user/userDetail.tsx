'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useGetRoute, useDeleteRoute, useUpdateRoute } from '../../../hooks/useRoute'; // Adjust path to your hooks
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Spinner } from "@nextui-org/react"; // Import the Spinner component
import 'leaflet/dist/leaflet.css';
import { useDeleteUser, useGetUserById } from '@/src/hooks/useUser';
import toast from 'react-hot-toast';

interface UserDetailProps {
    userId: string;
}

export default function UserDetail({ userId }: UserDetailProps) {
    const router = useRouter();

    // Fetch the user details using the useGetRoute hook
    const { user, loading, error } = useGetUserById(userId);

    // Hook for deleting a user
    const { handleDeleteUser } = useDeleteUser();

    const handleDelete = async () => {
        try {
            await handleDeleteUser(userId);
            router.push('/api/user');
            toast.success(`Delete User ID: ${userId} successfully`);
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const handleUpdate = () => {
        router.push(`/api/user/${userId}/update`);
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100 dark:bg-gray-600 items-center justify-center">
                <Spinner size="lg" label="Loading User Detail..." />
            </div>
        );
    }

    if (error) return <p>Error: {error.message}</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-8">
                    <h4 className="mb-6 text-2xl font-bold text-gray-700 dark:text-gray-300">
                        User Information
                    </h4>
                    <div className="px-4 py-6 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-8">
                        {/* User Information */}
                        <div className="space-y-4">
                            <div className="block text-lg">
                                <span className="text-gray-900 dark:text-gray-100">ID</span>
                                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                                    {user.id}
                                </p>
                            </div>

                            <div className="block text-lg">
                                <span className="text-gray-900 dark:text-gray-100">Name</span>
                                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                                    {user.name}
                                </p>
                            </div>

                            <div className="block text-lg">
                                <span className="text-gray-900 dark:text-gray-100">Email</span>
                                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                                    {user.email}
                                </p>
                            </div>

                            <div className="block text-lg">
                                <span className="text-gray-900 dark:text-gray-100">Address</span>
                                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                                    {user.address}
                                </p>
                            </div>

                            <div className="block text-lg">
                                <span className="text-gray-900 dark:text-gray-100">Phone Number</span>
                                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                                    {user.phone_number}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={() => router.push('/api/user')}
                                className="text-blue-500 hover:underline font-semibold"
                            >
                                Back to User Dashboard
                            </button>

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    Update User
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
