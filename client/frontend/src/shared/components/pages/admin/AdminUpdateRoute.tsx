'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useRouter } from 'next/navigation';
import { useActiveUser } from '@/src/hooks/useActivateUser';
import { useGetRoute, useUpdateRoute } from '@/src/hooks/useRoute';
import Loading from '@/src/app/loading';
import Header from '../../Header';
import ProfileSidebar from './ProfileSidebar';
import Footer from '../../Footer';

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
  routeId: string;
}

// Constant values
const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
const PRICE_PER_KM = 1.5; // Example: price per kilometer

export default function UpdateRoute({ routeId }: UpdateRouteProps) {
  const [form, setForm] = useState<UpdateRouteForm>({
    startLocation: '',
    endLocation: '',
    distance: 0,
    price: 0,
    status: 'pending',
  });
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { activeUser, loading } = useActiveUser();
  const { route, loading: routeLoading, error: fetchError } = useGetRoute(routeId);
  const router = useRouter();
  const { handleUpdateRoute } = useUpdateRoute();  // Using the new hook

  // Geocode location using OpenCage API
  const geocodeLocation = useCallback(async (location: string): Promise<[number, number]> => {
    if (!OPEN_CAGE_API_KEY) {
      throw new Error('OpenCage API key is missing');
    }

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPEN_CAGE_API_KEY}`
    );
    const data = await response.json();

    if (data.results.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lng } = data.results[0].geometry;
    return [lat, lng];
  }, []);

  // Geocode both locations and calculate distance and price
  const geocodeLocations = useCallback(async (startLocation: string, endLocation: string) => {
    try {
      const startCoords = await geocodeLocation(startLocation);
      const endCoords = await geocodeLocation(endLocation);

      setCoordinates([startCoords, endCoords]);

      const distance = calculateDistance(startCoords, endCoords);
      const price = distance * PRICE_PER_KM;

      setForm((prev) => ({
        ...prev,
        distance: Math.round(distance * 100) / 100, // round to 2 decimal places
        price: Math.round(price * 100) / 100,
      }));
    } catch (err) {
      setError('Error fetching coordinates or calculating distance');
    }
  }, [geocodeLocation]);

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
    return R * c;
  };

  // Update form and set initial map coordinates when route is loaded
  useEffect(() => {
    if (route) {
      setForm({
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        distance: 0,
        price: 0,
        status: route.status || 'pending',
      });

      // Geocode and set initial map coordinates with the original data
      geocodeLocations(route.startLocation, route.endLocation);
    }
  }, [route, geocodeLocations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Trigger geocoding and distance calculation only when "Calculate" button is clicked
  const handleCalculate = async () => {
    try {
      await geocodeLocations(form.startLocation, form.endLocation);
      setMessage('Distance and price calculated successfully.');
    } catch (err) {
      setError('Failed to calculate distance and price.');
      setMessage('');
    }
  };

  // Submit the form and update the route
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Use handleUpdateRoute instead of createRequest
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
      setError('Failed to update the route.');
      setMessage('');
      console.error('Error updating the route:', err);
    }
  };

  if (loading || routeLoading) return <Loading />;
  if (fetchError) return <p>Error: {fetchError?.message || 'An error occurred'}</p>;

  function AutoZoom() {
    const map = useMap();
    useEffect(() => {
      if (coordinates.length === 2) {
        map.fitBounds(coordinates);
      }
    }, [map, coordinates]);
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1">
        <ProfileSidebar />

        <div className="flex flex-1 bg-gray-50 py-28 px-8">
            {/* Update Form Section */}
            <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-4xl font-bold pb-8 text-blue-600">Update Route</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <label className="block text-lg">
                  <span className="text-gray-900 font-bold">Start Location</span>
                  <input
                    type="text"
                    name="startLocation"
                    value={form.startLocation}
                    onChange={handleChange}
                    placeholder="Enter Start Location"
                    required
                    className="block w-full mt-2 p-4 text-lg bg-gray-200 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>

                <label className="block text-lg">
                  <span className="text-gray-900 font-bold">End Location</span>
                  <input
                    type="text"
                    name="endLocation"
                    value={form.endLocation}
                    onChange={handleChange}
                    placeholder="Enter End Location"
                    required
                    className="block w-full mt-2 p-4 text-lg bg-gray-200 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>

                <label className="block text-lg">
                  <span className="text-gray-900 font-bold">Distance (km)</span>
                  <input
                    type="number"
                    name="distance"
                    value={form.distance}
                    readOnly
                    className="block w-full mt-2 p-4 text-lg border-gray-300 rounded-md bg-white"
                  />
                </label>

                <label className="block text-lg">
                  <span className="text-gray-900 font-bold">Price ($)</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    readOnly
                    className="block w-full mt-2 p-4 text-lg border-gray-300 rounded-md bg-white"
                  />
                </label>

                <label className="block text-lg">
                  <span className="text-gray-900 font-bold">Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="block w-full mt-2 p-4 bg-gray-200 text-lg border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="delivering">Delivering</option>
                    <option value="success">Success</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </label>

                {/* New Button to Calculate Distance and Price */}
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full py-4 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Calculate Distance and Price
                </button>

                {/* Update Button */}
                <button
                  type="submit"
                  className="w-full py-4 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </form>
              {message && <p className="mt-4 text-lg text-green-500">{message}</p>}
              {error && <p className="mt-4 text-lg text-red-500">{error}</p>}
            </div>

            {/* Map Display Section */}
            <div className="w-1/2 h-[800px] rounded-lg shadow-lg overflow-hidden">
              {coordinates.length === 2 && (
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
              )}
            </div>
          </div>
      
    </div>
    <Footer />
  </div>
  );
}
