'use client';

import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import Header from "../../components/Header";
import { useCreateRoute } from "../../../hooks/useRoute";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer"; 
import dynamic from "next/dynamic";
import { useActiveUser } from "@/src/hooks/useActivateUser";
import L from 'leaflet';
import { useMap } from "react-leaflet";

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((module) => module.Polyline), { ssr: false });

// Custom marker icon
const customIcon = L.icon({
  iconUrl: '/img/map-marker.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

// Define the form state interface
interface CreateRouteForm {
  startLocation: string;
  endLocation: string;
  distance: number;
  price: number;
  status: string;
}

const PRICE_PER_KM = 1.5; // Price per kilometer

export default function CreateRoute() {
  const [form, setForm] = useState<CreateRouteForm>({
    startLocation: "",
    endLocation: "",
    distance: 0,
    price: 0,
    status: ""
  });

  const [routeDetails, setRouteDetails] = useState<CreateRouteForm | null>(null); // Store created route details
  const [coordinates, setCoordinates] = useState<[number, number][]>([]); // For LeafletMap
  const [error, setError] = useState<string | null>(null);
  const { handleCreateRoute } = useCreateRoute(); // Mutation to create the route
  const { activeUser, loading, GGUserData } = useActiveUser();

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Geocode location (city name) to get lat/lng using OpenCage
  const geocodeLocation = async (location: string): Promise<[number, number]> => {
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

  // Geocode both locations and calculate distance and price
  const geocodeLocations = async (startLocation: string, endLocation: string) => {
    try {
      const startCoords = await geocodeLocation(startLocation);
      const endCoords = await geocodeLocation(endLocation);

      setCoordinates([startCoords, endCoords]);

      const distance = calculateDistance(startCoords, endCoords);
      const price = distance * PRICE_PER_KM;

      setForm((prev) => ({
        ...prev,
        distance: Math.round(distance), // round to nearest km
        price: Math.round(price), // round to nearest unit
      }));
    } catch (err) {
      setError("Error fetching coordinates or calculating distance");
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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!activeUser) {
      setError("User not logged in");
      return;
    }

    if (form.distance === 0 || form.price === 0) {
      setError("Please calculate the distance and price first.");
      return;
    }

    try {
      const createdRoute = await handleCreateRoute({
        userId: activeUser.id,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
        price: form.price,
      });

      // Store route details to display in table
      setRouteDetails({
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
        price: form.price,
        status: form.status || "pending"
      });

      // Mark route as created successfully
      toast.success("Route created successfully!");
    } catch (error: any) {
      setError(error.message || "Error creating route");
    }
  };

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
        <div className="flex-1 bg-gray-200 py-28 px-6">
          <h4 className="mb-6 text-3xl font-bold text-blue-600">Create Route</h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handlePlaceOrder} className="space-y-8 bg-white p-6 rounded-lg shadow-lg">
              <div>
                <label
                  htmlFor="startLocation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Location
                </label>
                <input
                  type="text"
                  name="startLocation"
                  value={form.startLocation}
                  onChange={handleChange}
                  placeholder="Enter city name"
                  className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="endLocation"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Location
                </label>
                <input
                  type="text"
                  name="endLocation"
                  value={form.endLocation}
                  onChange={handleChange}
                  placeholder="Enter city name"
                  className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <p className="mt-8 text-lg font-bold">
                Distance: {form.distance.toFixed(2)} km
              </p>

              <p className="text-lg font-bold">
                Price: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(form.price)}
              </p>

              <button
                type="submit"
                className="w-full py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Place Order
              </button>
            </form>

            {/* Always Show the Map using LeafletMap component */}
            {/* Map Display Section */}
            <div className="w-full h-[800px] rounded-lg shadow-lg overflow-hidden">
              {coordinates.length === 2 && (
                <MapContainer
                center={coordinates.length === 2 ? coordinates[0] : [51.505, -0.09]}
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
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
}
