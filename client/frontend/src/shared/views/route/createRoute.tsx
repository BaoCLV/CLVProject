'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRoute } from '../../../hooks/useRoute'; // Ensure the correct path to your hook
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

// Define the form state interface
interface CreateRouteForm {
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
}

export default function CreateRoute() {
  const router = useRouter();

  const [form, setForm] = useState<CreateRouteForm>({
    name: '',
    startLocation: '',
    endLocation: '',
    distance: 0,
  });

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Use the create route hook
  const { handleCreateRoute } = useCreateRoute();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'distance' ? Number(value) : value, // Convert distance to a number
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use the create route mutation
      await handleCreateRoute({
        name: form.name,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
      });
      router.push('/');
      setMessage('Route created successfully.');
      setError('');
      setForm({ name: '', startLocation: '', endLocation: '', distance: 0 }); // Reset form on success
    } catch (err) {
      setError('Failed to create route.');
      setMessage('');
      console.error('Error creating route:', err);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar/>
      <div className="flex flex-col flex-1">
        <Header />
    <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-4">
      <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
        Create New Route
      </h4>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="text-gray-700 dark:text-gray-400">Route Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Route Name"
              required
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700 dark:text-gray-400">Start Location</span>
            <input
              type="text"
              name="startLocation"
              value={form.startLocation}
              onChange={handleChange}
              placeholder="Enter Start Location"
              required
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700 dark:text-gray-400">End Location</span>
            <input
              type="text"
              name="endLocation"
              value={form.endLocation}
              onChange={handleChange}
              placeholder="Enter End Location"
              required
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700 dark:text-gray-400">Distance (km)</span>
            <input
              type="number"
              name="distance"
              value={form.distance}
              onChange={handleChange}
              placeholder="Enter Distance"
              required
              min={0}
              step={0.01}
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Create Route
          </button>
          {message && <p className="mt-2 text-sm text-green-500">{message}</p>}
          {error && <p className="mt-2 text-sm text-red-500">Error: {error}</p>}
        </form>
      </div>
    </div>
    </div>
    </div>
  );
}
