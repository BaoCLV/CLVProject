import { useState, useEffect } from "react";
import * as turf from "@turf/turf";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AuthScreen from "../screens/AuthScreen"; // Assuming this is the Login/Signup modal
import { toast, ToastContainer } from "react-toastify"; // Import Toast components
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles

// Define your custom marker icon
const customIcon = L.icon({
  iconUrl: "/img/map-marker.png", // Ensure this image is in the public/img folder
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

interface CreateRouteFormProps {
  onSubmit: (startLocation: string, endLocation: string, distance: number) => void;
  user: any; // The current authenticated user, if available
}

const CreateRouteForm = ({ onSubmit, user }: CreateRouteFormProps) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false); // Modal state for authentication

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  // Geocode location (city name) to get lat/lng using OpenCage
  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    if (!location) return null; // No location input yet
    if (!OPEN_CAGE_API_KEY) throw new Error("OpenCage API key is missing");

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPEN_CAGE_API_KEY}`
    );
    const data = await response.json();

    if (data.results.length === 0) return null; // Location not found

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

  // Handle route submission with authentication check
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      // Show a toast message instead of the Auth Modal
      toast.info("Please login or sign up to continue");
      setShowAuthModal(true); // You can also show the auth modal if you want
    } else if (distance !== null) {
      // User is authenticated, proceed with creating the route
      onSubmit(startLocation, endLocation, distance);
    }
  };

  return (
    <div className="relative flex">
      {/* Form Section */}
      <div className="w-1/2 p-4">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Location</label>
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md"
              placeholder="Enter start location"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">End Location</label>
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md"
              placeholder="Enter end location"
              required
            />
          </div>

          {error && <p className="mt-4 text-red-500">Error: {error}</p>}

          {distance !== null && (
            <>
              <p className="mt-8 text-lg font-bold">Distance: {distance} kilometers</p>
              <p className="mt-8 text-lg font-bold">
                Price:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(distance * 10000)}
              </p>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg mt-4"
              >
                Place Order
              </button>
            </>
          )}
        </form>
      </div>

      {/* Map Section */}
      <div className="w-1/2 h-[500px] p-4 z-10">
        <MapContainer
          center={coordinates.length === 2 ? coordinates[0] : [51.505, -0.09]} // Default to London
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full z-10"
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
