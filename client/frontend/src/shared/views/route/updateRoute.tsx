'use client';

import { useEffect, useState } from 'react';
import { useGetRoute, useUpdateRoute } from '../../../hooks/useRoute';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Loading from '../../components/Loading';
import ProfileSidebar from '../../components/pages/admin/ProfileSidebar';

// Custom marker icon
const customIcon = L.icon({
  iconUrl: '/img/map-marker.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

interface UpdateRouteForm {
  startLocation: string;
  endLocation: string;
  distance: number;
  price: number;
  status: string;
}

interface UpdateRouteProps {
  routeId: number;
}

export default function UpdateRoute({ routeId }: UpdateRouteProps) {
  const [form, setForm] = useState<UpdateRouteForm>({
    startLocation: '',
    endLocation: '',
    distance: 0, // Auto-calculated
    price: 0,    // Auto-calculated
    status: 'pending',
  });
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { route, loading, error: fetchError } = useGetRoute(routeId);
  const { handleUpdateRoute } = useUpdateRoute();

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  const PRICE_PER_KM = 1.5; // Example: price per kilometer

  useEffect(() => {
    if (route) {
      setForm({
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        distance: 0, // Reset distance for re-calculation
        price: 0,    // Reset price for re-calculation
        status: route.status || 'pending',
      });

      geocodeLocations(route.startLocation, route.endLocation);
    }
  }, [route]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Re-geocode and recalculate if start or end location changes
    if (name === 'startLocation' || name === 'endLocation') {
      geocodeLocations(
        name === 'startLocation' ? value : form.startLocation,
        name === 'endLocation' ? value : form.endLocation
      );
    }
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

      const distance = calculateDistance(startCoords, endCoords);
      const price = distance * PRICE_PER_KM;

      setForm((prev) => ({
        ...prev,
        distance,
        price,
      }));
    } catch (err) {
      console.error('Error geocoding locations:', err);
      setError('Failed to fetch coordinates for locations');
    }
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (coords1: [number, number], coords2: [number, number]): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coords2[0] - coords1[0]) * (Math.PI / 180);
    const dLng = (coords2[1] - coords1[1]) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coords1[0] * (Math.PI / 180)) * Math.cos(coords2[0] * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleUpdateRoute(routeId, {
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
        price: form.price,
        status: form.status,
      });

      setMessage('Route updated successfully.');
      setError('');
    } catch (err) {
      setError('Failed to update route.');
      setMessage('');
      console.error('Error updating route:', err);
    }
  };

  if (loading) return <Loading />;
  if (fetchError) return <p>Error: {fetchError.message}</p>;

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
    <div className="flex h-screen bg-gray-50">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        {/* <Header /> */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 py-16 px-8">
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
                readOnly
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 form-input bg-gray-200"
              />
            </label>

            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Price ($)</span>
              <input
                type="number"
                name="price"
                value={form.price}
                readOnly
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 form-input bg-gray-200"
              />
            </label>

            <label className="block text-lg">
              <span className="text-gray-900 dark:text-gray-100">Status</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-100 dark:focus:shadow-outline-gray form-select"
              >
                <option value="pending">Pending</option>
                <option value="delivering">Delivering</option>
                <option value="success">Success</option>
                <option value="cancel">Cancel</option>
              </select>
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
