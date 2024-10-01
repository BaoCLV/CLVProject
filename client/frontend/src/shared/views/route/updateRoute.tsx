'use client';

import { useEffect, useState } from 'react';
import { useGetRoute, useUpdateRoute } from '../../../hooks/useRoute'; // Ensure the correct path to your hooks
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const customIcon = L.icon({
  iconUrl: '/img/map-marker.png', // Place the image in the public folder
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

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
  const [coordinates, setCoordinates] = useState<[number, number][]>([]); // Store coordinates of start and end locations
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { route, loading, error: fetchError } = useGetRoute(routeId);
  const { handleUpdateRoute } = useUpdateRoute();

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  useEffect(() => {
    if (route) {
      setForm({
        name: route.name,
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        distance: route.distance,
      });

      // Geocode start and end locations
      geocodeLocations(route.startLocation, route.endLocation);
    }
  }, [route]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'distance' ? Number(value) : value }));
  };

  const geocodeLocation = async (location: string): Promise<[number, number]> => {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPEN_CAGE_API_KEY}`
    );
    const data = await response.json();

    if (data.results.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lng } = data.results[0].geometry;
    return [lat, lng];
  };

  const geocodeLocations = async (startLocation: string, endLocation: string) => {
    try {
      const startCoords = await geocodeLocation(startLocation);
      const endCoords = await geocodeLocation(endLocation);
      setCoordinates([startCoords, endCoords]);
    } catch (err) {
      console.error('Error geocoding locations:', err);
      setError('Failed to fetch coordinates for locations');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleUpdateRoute(routeId, {
        name: form.name,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
      });

      setMessage('Route updated successfully.');
      setError('');
      await geocodeLocations(form.startLocation, form.endLocation); // Geocode again after update
    } catch (err) {
      setError('Failed to update route.');
      setMessage('');
      console.error('Error updating route:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (fetchError) return <p>Error: {fetchError.message}</p>;

  // Fit the map bounds to show both markers using the useMap hook
  function AutoZoom() {
    const map = useMap();
    useEffect(() => {
      if (coordinates.length === 2) {
        map.fitBounds(coordinates);
      }
    }, [coordinates, map]);
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-8">
          <h4 className="mb-6 text-2xl font-bold text-gray-700 dark:text-gray-300">
            Update Route
          </h4>
          <form onSubmit={handleSubmit} className="space-y-8">
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

          {/* Display Map */}
          {coordinates.length === 2 && (
            <div className="h-[400px] w-full mt-8">
              <MapContainer
                center={coordinates[0]}
                zoom={10}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={coordinates[0]} icon={customIcon} />
                <Marker position={coordinates[1]} icon={customIcon} />
                <Polyline positions={coordinates} />
                <AutoZoom />
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
