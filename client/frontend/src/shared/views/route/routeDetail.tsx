'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated import

interface Route {
  id: number;
  name: string;
  start_location: string;
  end_location: string;
  distance: number;
  createdAt: string;
  updatedAt: string;
}

interface RouteDetailProps {
  routeId: string;
}

export default function RouteDetail({ routeId }: RouteDetailProps) {
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Updated useRouter

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/routes/${routeId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        router.push('/')
        throw new Error('Failed to delete the route');
      }
      router.push('/routes'); 
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdate = () => {
    router.push(`/routes/update/${routeId}`);
  };

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const res = await fetch(`/api/routes/${routeId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch route details');
        }
        const data: Route = await res.json();
        setRoute(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchRouteDetails();
    }
  }, [routeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!route) return <p>Route not found</p>;

  return (
    <div className="pt-[80px]">
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        {/* Card Header */}
        <div className="mb-4">
          <h4 className="text-3xl font-semibold text-gray-800">{route.name}</h4>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 mb-4" />

        {/* Card Body */}
        <div className="space-y-4">
          <p><span className="font-semibold">Start Location:</span> {route.start_location}</p>
          <p><span className="font-semibold">End Location:</span> {route.end_location}</p>
          <p><span className="font-semibold">Distance:</span> {route.distance} km</p>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 mt-6 mb-6" />

        {/* Card Footer with Action Buttons */}
        <div className="flex justify-between items-center">
          <a href="/" className="text-blue-500 hover:underline">Back to Routes</a>
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
