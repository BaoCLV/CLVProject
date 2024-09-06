'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetRoute, useDeleteRoute, useUpdateRoute } from '../../../hooks/useRoute'; // Adjust path to your hooks

interface RouteDetailProps {
  routeId: string;
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!route) return <p>Route not found</p>;

  return (
    <div className="pt-[80px]">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <h4 className="text-3xl font-semibold text-gray-800">{route.name}</h4>
          </div>
          <hr className="border-t border-gray-300 mb-4" />
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Start Location:</span> {route.start_location}
            </p>
            <p>
              <span className="font-semibold">End Location:</span> {route.end_location}
            </p>
            <p>
              <span className="font-semibold">Distance:</span> {route.distance} km
            </p>
          </div>
          <hr className="border-t border-gray-300 mt-6 mb-6" />
          <div className="flex justify-between items-center">
            <a href="/" className="text-blue-500 hover:underline">
              Back to Routes
            </a>
            <div className="flex space-x-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
