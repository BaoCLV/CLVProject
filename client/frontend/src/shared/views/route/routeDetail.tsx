"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetRoute,
  useDeleteRoute,
  useUpdateRoute,
} from "../../../hooks/useRoute";
import { useUser } from "../../../hooks/useUser";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { Spinner } from "@nextui-org/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../components/Loading";

const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

// Define your custom marker icon
const customIcon = L.icon({
  iconUrl: "/img/map-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

interface RouteDetailProps {
  routeId: number;
}

export default function RouteDetail({ routeId }: RouteDetailProps) {
  const router = useRouter();

  const { route, loading: routeLoading, error } = useGetRoute(routeId);
  const { user, loading: userLoading } = useUser();
  const { handleDeleteRoute } = useDeleteRoute();
  const { handleUpdateRoute } = useUpdateRoute();

  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  // Geocode location to lat/lng using OpenCage API
  const geocodeLocation = async (
    location: string
  ): Promise<[number, number]> => {
    if (!OPEN_CAGE_API_KEY) {
      throw new Error("OpenCage API key is missing");
    }

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=${OPEN_CAGE_API_KEY}`
    );
    const data = await response.json();

    if (data.results.length === 0) {
      throw new Error("Location not found");
    }

    const { lat, lng } = data.results[0].geometry;
    return [lat, lng];
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (route) {
        try {
          setIsGeocoding(true);
          const [startLat, startLng] = await geocodeLocation(
            route.startLocation
          );
          const [endLat, endLng] = await geocodeLocation(route.endLocation);

          setCoordinates([
            [startLat, startLng],
            [endLat, endLng],
          ]);
          setIsGeocoding(false);
        } catch (error: any) {
          setGeocodeError(error.message || "Error geocoding locations");
          setIsGeocoding(false);
        }
      }
    };

    fetchCoordinates();
  }, [route]);

  const handleDelete = async () => {
    try {
      await handleDeleteRoute(routeId);
      router.push("/");
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  const handleUpdate = () => {
    router.push(`/api/route/${routeId}/update`);
  };

  if (routeLoading || userLoading || isGeocoding) {
    return <Loading />;
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
    <div className="flex flex-col flex-1">
      <Header />
      <div className="flex-1 h-screen p-24">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Title */}
          <h2 className="text-4xl font-bold text-center text-blue-600">
            Route Details
          </h2>

          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <span className="block text-gray-700 text-lg font-semibold">
                Route ID
              </span>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {route.id}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <span className="block text-gray-700 text-lg font-semibold">
                Start Location
              </span>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {route.startLocation}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <span className="block text-gray-700 text-lg font-semibold">
                End Location
              </span>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {route.endLocation}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <span className="block text-gray-700 text-lg font-semibold">
                Distance (km)
              </span>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {route.distance} km
              </p>
            </div>
          </div>

          {/* Map Display */}
          {coordinates.length === 2 && (
            <div className="mt-8 h-[400px] w-full rounded-lg shadow-lg overflow-hidden">
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

          {/* Actions */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 font-bold hover:underline"
            >
              Back to Dashboard
            </button>

            {user?.roles?.includes("admin") && (
              <div className="space-x-4">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Update Route
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
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
  );
}
