import { useState, useEffect, useCallback } from "react";
// Lazy load Leaflet to prevent window-related issues during SSR
const LeafletMap = dynamic(() => import("../leafletMap"), { ssr: false }); // Disable SSR for the map component

import AuthScreen from "../../screens/AuthScreen";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../../hooks/useUser";
import dynamic from "next/dynamic";

interface CreateRouteFormProps {
  onSubmit: (startLocation: string, endLocation: string, distance: number, price: number) => void;
}

const CreateRouteForm = ({ onSubmit }: CreateRouteFormProps) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, loading } = useUser();

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

  const geocodeLocation = useCallback(async (location: string): Promise<[number, number]> => {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPEN_CAGE_API_KEY}`
    );
    const data = await response.json();
  
    if (data.results.length === 0) {
      throw new Error('Location not found');
    }
  
    const { lat, lng } = data.results[0].geometry;
    return [lat, lng];
  }, [OPEN_CAGE_API_KEY]);

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

  const updateMapAndDistance = useCallback(async () => {
    try {
      const [lat1, lng1] = (await geocodeLocation(startLocation)) || [null, null];
      const [lat2, lng2] = (await geocodeLocation(endLocation)) || [null, null];
  
      if (lat1 && lng1 && lat2 && lng2) {
        const calculatedDistance = Math.round(calculateDistance([lat1, lng1], [lat2, lng2]));
        setDistance(calculatedDistance);
        setPrice(calculatedDistance*100)
        setCoordinates([[lat1, lng1], [lat2, lng2]]);
      }
    } catch (error) {
      setError("Error geocoding locations");
    }
  }, [startLocation, endLocation]);

  useEffect(() => {
    const timer = setTimeout(updateMapAndDistance, 500);
    return () => clearTimeout(timer);
  }, [startLocation, endLocation, updateMapAndDistance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (loading) {
      toast.info("Please wait, checking authentication...");
      return;
    }
  
    if (!user) {
      toast.info("Please login or sign up to continue.");
      setShowAuthModal(true);
    } else if (distance !== null && price !== null) {
      onSubmit(startLocation, endLocation, distance, price);
    } else {
      toast.error("Failed to calculate distance or price. Please try again.");
    }
  };
  return (
    <div className="relative flex flex-col md:flex-row h-[600px] bg-gray-50">
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-top bg-white shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create a Route</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Location</label>
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="mt-1 block w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
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
              className="mt-1 block w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter end location"
              required
            />
          </div>
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
          {distance !== null && (
            <div className="mt-6 space-y-4">
              <p className="text-lg font-bold">Distance: {distance} kilometers</p>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Place Order
              </button>
            </div>
          )}
        </form>
      </div>
      {/* Map section is dynamically loaded on client side */}
      <div className="w-full md:w-1/2 h-96 md:h-full p-4">
        { <LeafletMap coordinates={coordinates} />}
      </div>
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-50 p-8 rounded-lg shadow-lg max-w-lg w-full">
            <AuthScreen setOpen={setShowAuthModal} />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CreateRouteForm;
