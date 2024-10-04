"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useCreateRoute } from "../../../hooks/useRoute";
import * as turf from "@turf/turf";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer";

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
}

export default function UserDashboard() {
  const [form, setForm] = useState<CreateRouteForm>({
    startLocation: "",
    endLocation: "",
    distance: 0,
  });

  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [error, setError] = useState<string | null>(null);
  const { handleCreateRoute } = useCreateRoute();
  const { user, loading } = useUser();

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

      const calculatedDistance = Math.round(
        calculateDistance(lat1, lng1, lat2, lng2)
      );

      setForm((prev) => ({
        ...prev,
        distance: calculatedDistance,
      }));

      setCoordinates([
        [lat1, lng1],
        [lat2, lng2],
      ]);
    } catch (error: any) {
      setError(error.message || "Error geocoding locations");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("User not logged in");
      return;
    }

    if (form.distance === 0) {
      setError("Please calculate the distance first.");
      return;
    }

    try {
      const createdRoute = await handleCreateRoute({
        userId: user.id,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
      });

      console.log("Route created:", createdRoute);
      toast.success("Order shipping successful!");
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
    }, [coordinates, map]);
    return null;
  }

  return (
    <div className="flex flex-col bg-gray-200 border-black">
      <Header />
      <div className="flex flex-row h-srceen p-8">
        {/* Form Section */}
        <div className="flex-1 h-full bg-white p-6 border border-gray-300 shadow-md">
          <h4 className="mb-6 text-2xl font-bold text-black">Create a Route</h4>

          <form className="space-y-4">
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
              onClick={handleCalculateDistance}
            >
              Calculate Distance
            </button>

            {form.distance > 0 && (
              <>
                <p className="mt-8 text-lg font-bold">
                  Distance: {form.distance} kilometers
                </p>
                <p className="mt-8 text-lg font-bold">
                  Price:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(form.distance * 10000)}
                </p>
              </>
            )}

            {form.distance > 0 && (
              <button
                type="submit"
                className="w-full py-2 mt-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handlePlaceOrder}
                disabled={form.distance === 0}
              >
                Place Order
              </button>
            )}
          </form>
        </div>

        {/* Map Section */}
        <div className="flex-1 h-screen ml-8">
          {coordinates.length === 2 && (
            <div className="h-[800px] w-full">
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
      <Footer />
      {/* ToastContainer for showing success message */}
      <ToastContainer />
    </div>
  );
}