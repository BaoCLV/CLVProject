'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetRoute, useDeleteRoute, useUpdateRoute } from '../../../hooks/useRoute'; // Adjust path to your hooks
import { useUser } from '../../../hooks/useUser'; // Import the useUser hook
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Spinner } from "@nextui-org/react"; // Import the Spinner component
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'; // Import Leaflet components
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

// Define your custom marker icon
const customIcon = L.icon({
  iconUrl: "/img/map-marker.png", // Replace this with your custom marker image
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

interface RouteDetailProps {
  routeId: number;
}

export default function RouteDetail({ routeId }: RouteDetailProps) {
  const router = useRouter();

  // Fetch the route details using the useGetRoute hook
  const { route, loading: routeLoading, error } = useGetRoute(routeId);

  // Fetch the user details using the useUser hook
  const { user, loading: userLoading } = useUser();

  // Hook for deleting a route
  const { handleDeleteRoute } = useDeleteRoute();

  // Hook for updating a route
  const { handleUpdateRoute } = useUpdateRoute();

  // State to store the coordinates for the map
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  // Geocode location (city name) to get lat/lng using OpenCage
  const geocodeLocation = async (location: string): Promise<[number, number]> => {
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
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (route) {
        try {
          setIsGeocoding(true);
          const [startLat, startLng] = await geocodeLocation(route.startLocation);
          const [endLat, endLng] = await geocodeLocation(route.endLocation);

          // Update coordinates for the map
          setCoordinates([
            [startLat, startLng], // Start location
            [endLat, endLng],     // End location
          ]);
          setIsGeocoding(false);
        } catch (error: any) {
          setGeocodeError(error.message || 'Error geocoding locations');
          setIsGeocoding(false);
        }
      }
    };

    fetchCoordinates();
  }, [route]);

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

  // Handle loading states for both route and user
  if (routeLoading || userLoading || isGeocoding) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-600 items-center justify-center">
        <Spinner size="lg" label="Loading Route Detail..." />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;
  if (geocodeError) return <p>Error: {geocodeError}</p>;
  if (!route) return <p>Route not found</p>;

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
      <div className="flex flex-col z-50 flex-1">
        <Header />
        <div className="flex-1 bg-gray-100 dark:bg-gray-600 p-8">
          <h4 className="mb-6 text-2xl font-bold text-gray-700 dark:text-gray-300">
            Route Information
          </h4>
          <div className="px-4 py-6 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-8">
            {/* Route Information */}
            <div className="space-y-4">
              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Route ID</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {route.id}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Start Location</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {route.startLocation}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">End Location</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {route.endLocation}
                </p>
              </div>

              <div className="block text-lg">
                <span className="text-gray-900 dark:text-gray-100">Distance (km)</span>
                <p className="block w-full mt-2 p-4 text-lg dark:border-gray-600 dark:bg-gray-700 text-white rounded-lg">
                  {route.distance} km
                </p>
              </div>
            </div>

            {/* Map Display */}
            {coordinates.length === 2 && (
              <div className="mt-8 h-[400px] w-full">
                <MapContainer
                  center={coordinates[0]} // Center the map on the start location
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

            {/* Actions */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => router.push('/')}
                className="text-blue-500 hover:underline font-semibold"
              >
                Back to Dashboard
              </button>

              {/* Conditionally show the buttons based on the user's role */}
              {user?.roles?.includes('admin') && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Update Route
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Delete Route
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
