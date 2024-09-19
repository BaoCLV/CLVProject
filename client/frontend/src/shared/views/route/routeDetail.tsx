'use client';

import { useRouter } from 'next/navigation';
import { useGetRoute, useDeleteRoute, useUpdateRoute } from '../../../hooks/useRoute'; // Adjust path to your hooks
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!route) return <p>Route not found</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-10 bg-[#121212]">
          <h1 className="text-3xl font-semibold text-yellow-500 mb-8">Route Information</h1>
          <div className="bg-[#1E1E2F] p-8 rounded-lg shadow-lg">
            {/* Route Information */}
            <div className="space-y-4 mb-6">
              <div className="col-span-full text-xl font-semibold text-white bg-purple-800 p-2 rounded-t-lg">
                Route Information
              </div>
              <div className="text-white">
                <h3 className="text-gray-400">Start Location</h3>
                <p className="bg-gray-800 p-3 rounded">{route.startLocation}</p>
              </div>
              <div className="text-white">
                <h3 className="text-gray-400">End Location</h3>
                <p className="bg-gray-800 p-3 rounded">{route.endLocation}</p>
              </div>
              <div className="text-white">
                <h3 className="text-gray-400">Distance</h3>
                <p className="bg-gray-800 p-3 rounded">{route.distance} km</p>
              </div>
              <div className="text-white">
                <h3 className="text-gray-400">Route Name</h3>
                <p className="bg-gray-800 p-3 rounded">{route.name}</p>
              </div>
            </div>

            <hr className="border-t border-gray-200 mb-6" />

            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
              <a href="/" className="text-blue-500 hover:underline font-semibold">
                Back to Dashboard
              </a>
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          
        </main>
        <Footer />
      </div>
    </div>
    
  );
}
