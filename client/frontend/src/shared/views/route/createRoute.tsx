'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRoute } from '../../../hooks/useRoute'; // Ensure the correct path to your hook

// Define the form state interface
interface CreateRouteForm {
  name: string;
  start_location: string;
  end_location: string;
  distance: number;
}

export default function CreateRoute() {
  const router = useRouter();

  const [form, setForm] = useState<CreateRouteForm>({
    name: '',
    start_location: '',
    end_location: '',
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
        start_location: form.start_location,
        end_location: form.end_location,
        distance: form.distance,
      });
      router.push('/');
      setMessage('Route created successfully.');
      setError('');
      setForm({ name: '', start_location: '', end_location: '', distance: 0 }); // Reset form on success
    } catch (err) {
      setError('Failed to create route.');
      setMessage('');
      console.error('Error creating route:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Route Name"
        required
        className="p-2 border border-gray-300 text-white rounded"
      />
      <input
        type="text"
        name="start_location"
        value={form.start_location}
        onChange={handleChange}
        placeholder="Start Location"
        required
        className="p-2 border border-gray-300 text-white rounded"
      />
      <input
        type="text"
        name="end_location"
        value={form.end_location}
        onChange={handleChange}
        placeholder="End Location"
        required
        className="p-2 border border-gray-300 text-white rounded"
      />
      <input
        type="number"
        name="distance"
        value={form.distance}
        onChange={handleChange}
        placeholder="Distance"
        required
        min={0}
        step={0.01}
        className="p-2 border border-gray-300 text-white rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Route
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
    </form>
  );
}
