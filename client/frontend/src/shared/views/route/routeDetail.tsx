'use client';

import { useRouter } from 'next/navigation';
import { useGetRoute, useDeleteRoute, useUpdateRoute } from '../../../hooks/useRoute'; // Adjust path to your hooks
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Spinner } from "@nextui-org/react"; // Import the Spinner component

interface RouteDetailProps {
  routeId: number;
}

export default function RouteDetail({ routeId }: RouteDetailProps) {
  const router = useRouter();

  // Fetch the route details using the useGetRoute hook
  const { route, loading, error } = useGetRoute(routeId);

  // Hook for deleting a route
  const { handleDeleteRoute } = useDeleteRoute();

  // Hook for updating a route
  const { handleUpdateRoute } = useUpdateRoute();

  const handleDelete = async () => {
    try {
      await handleDeleteRoute(routeId);
      router.push('/');
    } catch (err) {
      console.error('Error deleting route:', err);
    }
  };

  const handleUpdate = () => {
    router.push(`/api/route/${routeId}/update`);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-600 items-center justify-center">
        <Spinner size="lg" label='Loading Route Detail'/>
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;
  if (!route) return <p>Route not found</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-8">
          <h4 className="mb-6 text-2xl font-bold text-gray-700 dark:text-gray-300">
            Route Information
          </h4>
          <div className="px-4 py-6 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-8">
            {/* Route Information */}
            <div className="space-y-4">
              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Route Name</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {route.name}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Start Location</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {route.startLocation}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">End Location</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {route.endLocation}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Distance (km)</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {route.distance} km
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => router.push('/')}
                className="text-blue-500 hover:underline font-semibold"
              >
                Back to Dashboard
              </button>

              <div className="flex space-x-4">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Update Route
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                >
                  Delete Route
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
