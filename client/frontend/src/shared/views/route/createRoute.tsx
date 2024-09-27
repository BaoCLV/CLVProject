'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRoute } from '../../../hooks/useRoute'; // Ensure the correct path to your hook
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

// Define the form state interface
interface CreateRouteForm {
  id: number; // This will now come from the database
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
}

export default function CreateRoute() {
  const router = useRouter();

  const [form, setForm] = useState<CreateRouteForm>({
    id: 0, // Initialize with placeholder
    name: '',
    startLocation: '',
    endLocation: '',
    distance: 0,
  });

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [createdRoutes, setCreatedRoutes] = useState<CreateRouteForm[]>([]); // State to track created routes

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
      const createdRoute = await handleCreateRoute({
        name: form.name,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
      });

      // Ensure the createdRoute object contains the 'id' returned from the database
      if (createdRoute?.id) {
        // Update the list of created routes with the real ID from the database
        setCreatedRoutes((prevRoutes) => [
          ...prevRoutes,
          { id: createdRoute.id, name: createdRoute.name, startLocation: createdRoute.startLocation, endLocation: createdRoute.endLocation, distance: createdRoute.distance },
        ]);

        setMessage('Route created successfully.');
        setError('');
        setForm({ id: 0, name: '', startLocation: '', endLocation: '', distance: 0 }); // Reset form on success
      } else {
        throw new Error('Route creation failed: no ID returned.');
      }
    } catch (err) {
      setError('Failed to create route.');
      setMessage('');
      console.error('Error creating route:', err);
    }
  };

  // Handle viewing route details
  const handleViewDetails = (routeId: number) => {
    router.push(`/api/route/${routeId}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-200 p-8"> {/* Larger padding */}
          <h4 className="mb-6 text-2xl font-bold text-black">Create New Route</h4>

          <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased spacing between form fields */}
            <label className="block text-lg"> {/* Larger text size */}
              <span className="text-black font-bold">Route Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Route Name"
                required
                className="block w-full mt-2 p-4 text-lg bg-white text-black border border-gray-300 rounded focus:border-purple-500 focus:ring-purple-500 focus:outline-none" // White background, black text, purple border on focus
              />
            </label>

            <label className="block text-lg">
              <span className="text-black font-bold">Start Location</span>
              <input
                type="text"
                name="startLocation"
                value={form.startLocation}
                onChange={handleChange}
                placeholder="Enter Start Location"
                required
                className="block w-full mt-2 p-4 text-lg bg-white text-black border border-gray-300 rounded focus:border-purple-500 focus:ring-purple-500 focus:outline-none" // White background, black text, purple border on focus
              />
            </label>

            <label className="block text-lg">
              <span className="text-black font-bold">End Location</span>
              <input
                type="text"
                name="endLocation"
                value={form.endLocation}
                onChange={handleChange}
                placeholder="Enter End Location"
                required
                className="block w-full mt-2 p-4 text-lg bg-white text-black border border-gray-300 rounded focus:border-purple-500 focus:ring-purple-500 focus:outline-none" // White background, black text, purple border on focus
              />
            </label>

            <label className="block text-lg">
              <span className="text-black font-bold">Distance (km)</span>
              <input
                type="number"
                name="distance"
                value={form.distance}
                onChange={handleChange}
                placeholder="Enter Distance"
                required
                min={0}
                step={0.01}
                className="block w-full mt-2 p-4 text-lg bg-white text-black border border-gray-300 rounded focus:border-purple-500 focus:ring-purple-500 focus:outline-none" // White background, black text, purple border on focus
              />
            </label>

            <button
              type="submit"
              className="w-full py-4 text-lg font-semibold text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Create Route
            </button>
            {message && <p className="mt-4 text-lg text-green-500">{message}</p>}
            {error && <p className="mt-4 text-lg text-red-500">Error: {error}</p>}
          </form>

          {/* Display newly created routes */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-black mb-4">Created Routes</h4>
            {createdRoutes.length > 0 ? (
              <ul className="space-y-4">
                {createdRoutes.map((route) => (
                  <li key={route.id} className="p-4 bg-gray-300 rounded-lg">
                    <p><strong>Name:</strong> {route.name}</p>
                    <p><strong>Start Location:</strong> {route.startLocation}</p>
                    <p><strong>End Location:</strong> {route.endLocation}</p>
                    <p><strong>Distance:</strong> {route.distance} km</p>
                    <button
                      onClick={() => handleViewDetails(route.id)}
                      className="mt-2 text-purple-600 hover:underline dark:text-purple-400"
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-900">No routes created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
