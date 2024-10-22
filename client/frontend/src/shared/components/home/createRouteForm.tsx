'use client'

import { useState, useEffect } from "react";
import * as turf from "@turf/turf";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AuthScreen from "../../screens/AuthScreen"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { useUser } from "../../../hooks/useUser"; 
import { useActiveUser } from "@/src/hooks/useActivateUser";

const customIcon = L.icon({
  iconUrl: "/img/map-marker.png", 
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

interface CreateRouteFormProps {
  onSubmit: (startLocation: string, endLocation: string, distance: number) => void;
}

const CreateRouteForm = ({ onSubmit }: CreateRouteFormProps) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { activeUser, loading } = useActiveUser(); 

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;


  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    if (!location) return null;
    if (!OPEN_CAGE_API_KEY) throw new Error("OpenCage API key is missing");

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPEN_CAGE_API_KEY}`
    );
    const data = await response.json();

    if (data.results.length === 0) return null;

    const { lat, lng } = data.results[0].geometry;
    return [lat, lng];
  };

  // Calculate distance using Turf.js
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const point1 = turf.point([lng1, lat1]);
    const point2 = turf.point([lng2, lat2]);
    return turf.distance(point1, point2, { units: "kilometers" });
  };

  // Update map and calculate distance dynamically
  const updateMapAndDistance = async () => {
    try {
      const [lat1, lng1] = (await geocodeLocation(startLocation)) || [null, null];
      const [lat2, lng2] = (await geocodeLocation(endLocation)) || [null, null];

      if (lat1 && lng1 && lat2 && lng2) {
        const calculatedDistance = Math.round(calculateDistance(lat1, lng1, lat2, lng2));
        setDistance(calculatedDistance);
        setCoordinates([[lat1, lng1], [lat2, lng2]]);
      }
    } catch (error: any) {
      setError("Error geocoding locations");
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateMapAndDistance, 500);
    return () => clearTimeout(timer);
  }, [startLocation, endLocation]);

  function AutoZoom() {
    const map = useMap();
    useEffect(() => {
      if (coordinates.length === 2) {
        map.fitBounds(coordinates);
      }
    }, [coordinates, map]);
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      toast.info("Please wait, checking authentication...");
      return;
    }

    // Check if the user is logged in
    if (!activeUser) {
      toast.info("Please login or sign up to continue.");
      setShowAuthModal(true); 
    } else if (distance !== null) {
      onSubmit(startLocation, endLocation, distance);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row h-[600px] bg-gray-50">
      {/* Form Section */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-top bg-white shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create a Route</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Location</label>
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="mt-1 block w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter start location"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Location</label>
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              className="mt-1 block w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter end location"
              required
            />
          </div>

          {error && <p className="text-red-500 mt-2">Error: {error}</p>}

          {distance !== null && (
            <div className="mt-6 space-y-4">
              <p className="text-lg font-bold">Distance: {distance} kilometers</p>
              <p className="text-lg font-bold">
                Price:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(distance * 10000)}
              </p>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Place Order
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Map Section */}
      <div className="w-full md:w-1/2 h-96 md:h-full p-4">
        <MapContainer
          center={coordinates.length === 2 ? coordinates[0] : [51.505, -0.09]} // Default to London
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full rounded-lg shadow-md"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coordinates.length === 2 && (
            <>
              <Marker position={coordinates[0]} icon={customIcon} />
              <Marker position={coordinates[1]} icon={customIcon} />
              <Polyline positions={coordinates} />
              <AutoZoom />
            </>
          )}
        </MapContainer>
      </div>

      {/* Auth Modal for Login/Signup */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-50 p-8 rounded-lg shadow-lg max-w-lg w-full">
            <AuthScreen setOpen={setShowAuthModal} /> {/* Login/Signup form */}
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default CreateRouteForm;