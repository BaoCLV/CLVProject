"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import Header from "../../components/Header";
import { useCreateRoute } from "../../../hooks/useRoute";
import * as turf from "@turf/turf";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define your custom marker icon
const customIcon = L.icon({
  iconUrl: "/img/map-marker.png", // Make sure to place the image in the public folder
  iconSize: [38, 38], // size of the icon
  iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -30], // point from which the popup should open relative to the iconAnchor
});

// Define the form state interface
interface CreateRouteForm {
  startLocation: string;
  endLocation: string;
  distance: number;
  price: number;
}

export default function CreateRoute() {
  const [form, setForm] = useState<CreateRouteForm>({
    startLocation: "",
    endLocation: "",
    distance: 0,
    price: 0,
  });

  const [coordinates, setCoordinates] = useState<[number, number][]>([]); // To store the lat/lng of the start and end locations
  const [error, setError] = useState<string | null>(null);
  const { handleCreateRoute } = useCreateRoute(); // Mutation to create the route
  const { user, loading } = useUser(); // Get user and loading state from the useUser hook

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value, // Ensure price is a number
    }));
  };

  // Calculate distance using Turf.js
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const point1 = turf.point([lng1, lat1]);
    const point2 = turf.point([lng2, lat2]);
    const distance = turf.distance(point1, point2, { units: "kilometers" });
    return distance;
  };

  // Geocode location (city name) to get lat/lng using OpenCage
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

  // Handle distance calculation
  const handleCalculateDistance = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loading) {
      setError("Loading user data...");
      return;
    }

    if (!user) {
      setError("User not logged in");
      return;
    }

    try {
      const [lat1, lng1] = await geocodeLocation(form.startLocation);
      const [lat2, lng2] = await geocodeLocation(form.endLocation);

      // Calculate the distance between the two geocoded locations
      const calculatedDistance = Math.round(
        calculateDistance(lat1, lng1, lat2, lng2)
      );

      // Update form state to include the calculated distance
      setForm((prev) => ({
        ...prev,
        distance: calculatedDistance,
        price: calculatedDistance * 10000, // Set default price based on distance
      }));

      // Update coordinates for the map
      setCoordinates([
        [lat1, lng1],
        [lat2, lng2],
      ]);

    } catch (error: any) {
      setError(error.message || "Error geocoding locations");
    }
  };

  // Handle place order (create route)
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("User not logged in");
      return;
    }

    if (form.distance === 0 || form.price === 0) {
      setError("Please calculate the distance and price first.");
      return;
    }

    try {
      // Send the route data to the server
      const createdRoute = await handleCreateRoute({
        userId: user.id,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
        price: form.price, // Include price when creating the route
      });

      console.log("Route created:", createdRoute);

      // Show success notification
      toast.success("Route created successfully!");
    } catch (error: any) {
      setError(error.message || "Error creating route");
    }
  };

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
    <div className="flex h-screen bg-gray-200">
      <ProfileSidebar />
      <div className="flex flex-col flex-1">
        {/* <Header /> */}
        <div className="flex-1 bg-gray-200 py-16 px-8">
          <h4 className="mb-6 text-3xl font-bold text-black">Create Route</h4>

          {/* Form for creating a route */}
          <form onSubmit={handleCalculateDistance} className="space-y-8 bg-white px-8 pb-8 rounded-lg shadow-lg">
            <div>
              <label
                htmlFor="startLocation"
                className="block text-sm font-medium text-gray-700"
              >
                Start Location (City Name)
              </label>
              <input
                type="text"
                name="startLocation"
                value={form.startLocation}
                onChange={handleChange}
                placeholder="Enter city name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="endLocation"
                className="block text-sm font-medium text-gray-700"
              >
                End Location (City Name)
              </label>
              <input
                type="text"
                name="endLocation"
                value={form.endLocation}
                onChange={handleChange}
                placeholder="Enter city name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Calculate Distance
            </button>

            {form.distance > 0 && (
              <>
                <p className="mt-8 text-lg font-bold">
                  Distance: {form.distance} kilometers
                </p>

                {/* Display Map */}
                {coordinates.length === 2 && (
                  <div className="h-[400px] w-full mt-4">
                    <MapContainer
                      center={coordinates[0]}
                      zoom={10}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={coordinates[0]} icon={customIcon} />
                      <Marker position={coordinates[1]} icon={customIcon} />
                      <Polyline positions={coordinates} />
                      <AutoZoom />
                    </MapContainer>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mt-4"
                  >
                    Price (VND)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>

                <p className="mt-8 text-lg font-bold">
                  Price:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(form.price)}
                </p>
              </>
            )}

            {/* Place Order Button */}
            {form.distance > 0 && (
              <button
                type="button"
                className="w-full py-2 mt-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ToastContainer for showing success message */}
      <ToastContainer />
    </div>
  );
}
