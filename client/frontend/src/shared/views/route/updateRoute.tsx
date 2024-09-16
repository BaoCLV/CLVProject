'use client';

import { useEffect, useState } from 'react';
import { useGetRoute, useUpdateRoute } from '../../../hooks/useRoute'; // Ensure the correct path to your hooks

interface UpdateRouteForm {
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
}

interface UpdateRouteProps {
  routeId: string;
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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Route Name"
        className="p-2 border border-gray-300 text-white rounded"
        required
      />
      <input
        type="text"
        name="startLocation"
        value={form.startLocation}
        onChange={handleChange}
        placeholder="Start Location"
        className="p-2 border border-white-300 text-white rounded"
        required
      />
      <input
        type="text"
        name="endLocation"
        value={form.endLocation}
        onChange={handleChange}
        placeholder="End Location"
        className="p-2 border border-gray-300 text-white rounded"
        required
      />
      <input
        type="number"
        name="distance"
        value={form.distance}
        onChange={handleChange}
        placeholder="Distance"
        className="p-2 border border-gray-300 text-white rounded"
        required
        min="0"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Update Route
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
    </form>
  );
}
