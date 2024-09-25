'use client';

import { useEffect, useState } from 'react';
import { useGetRoute, useUpdateRoute } from '../../../hooks/useRoute'; // Ensure the correct path to your hooks
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

interface UpdateRouteForm {
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
}

interface UpdateRouteProps {
  routeId: number;
}

export default function UpdateRoute({ routeId }: UpdateRouteProps) {
  const [form, setForm] = useState<UpdateRouteForm>({
    name: '',
    startLocation: '',
    endLocation: '',
    distance: 0,
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Fetch the existing route details to pre-fill the form
  const { route, loading, error: fetchError } = useGetRoute(routeId);

  // Use the update route hook
  const { handleUpdateRoute } = useUpdateRoute();

  useEffect(() => {
    if (route) {
      setForm({
        name: route.name,
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        distance: route.distance,
      });
    }
  }, [route]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'distance' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use the update route mutation with routeId
      await handleUpdateRoute(routeId, {
        name: form.name,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
      });

      setMessage('Route updated successfully.');
      setError('');
    } catch (err) {
      setError('Failed to update route.');
      setMessage('');
      console.error('Error updating route:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (fetchError) return <p>Error: {fetchError.message}</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-8"> {/* Increased padding */}
          <h4 className="mb-6 text-2xl font-bold text-gray-700 dark:text-gray-300">
            Update Route
          </h4>
          <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased space between fields */}
            <label className="block text-lg"> {/* Made the text larger */}
              <span className="text-gray-900 dark:text-gray-100">Route Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Route Name"
                required
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-100 dark:focus:shadow-outline-gray form-input"
              />
            </label>
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Start Location</span>
              <input
                type="text"
                name="startLocation"
                value={form.startLocation}
                onChange={handleChange}
                placeholder="Enter Start Location"
                required
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-100 dark:focus:shadow-outline-gray form-input"
              />
            </label>
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">End Location</span>
              <input
                type="text"
                name="endLocation"
                value={form.endLocation}
                onChange={handleChange}
                placeholder="Enter End Location"
                required
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-100 dark:focus:shadow-outline-gray form-input"
              />
            </label>
            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Distance (km)</span>
              <input
                type="number"
                name="distance"
                value={form.distance}
                onChange={handleChange}
                placeholder="Enter Distance"
                required
                min={0}
                step={0.01}
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-100 dark:focus:shadow-outline-gray form-input"
              />
            </label>
            <button
              type="submit"
              className="w-full py-4 text-lg font-semibold text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Update Route
            </button>
            {message && <p className="mt-4 text-lg text-green-500">{message}</p>}
            {error && <p className="mt-4 text-lg text-red-500">Error: {error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
