"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetRoute,
  useDeleteRoute,
  useUpdateRoute,
} from "../../../hooks/useRoute";
import { useUser } from "../../../hooks/useUser";
import { useRoles } from "../../../hooks/useRole";
import Header from "../../components/Header";
import ProfileSidebar from "../../components/pages/admin/ProfileSidebar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

// Custom marker icon
const customIcon = L.icon({
  iconUrl: "/img/map-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

interface RouteDetailProps {
  routeId: string
}

export default function RouteDetail({ routeId }: RouteDetailProps) {
  const router = useRouter();
  const { route, loading: routeLoading, error } = useGetRoute(routeId);
  const { user, loading: userLoading } = useUser();
  const { loadingRoles, roles } = useRoles();
  const { handleDeleteRoute } = useDeleteRoute();
  const { handleUpdateRoute } = useUpdateRoute();
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

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
          const [startLat, startLng] = await geocodeLocation(route.startLocation);
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
      router.push("/admin/route");
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  const handleUpdate = () => {
    router.push(`/admin/updateRoute/${routeId}`);
  };

  if (routeLoading || userLoading || isGeocoding || loadingRoles) {
    return <Loading />;
  }

  if (error) return <p>Error: {error.message}</p>;
  if (geocodeError) return <p>Error: {geocodeError}</p>;
  if (!route) return <p>Route not found</p>;

  const role = roles.find((role: { id: any }) => role.id === user.roleId);
  const roleName = role?.name || "No role";

  const hasUpdatePermission = role?.permissions
    .map((perm: any) => perm.name)
    .includes("update");

  const hasDeletePermission = role?.permissions
    .map((perm: any) => perm.name)
    .includes("delete");

  function AutoZoom() {
    const map = useMap();
    useEffect(() => {
      if (coordinates.length === 2) {
        map.fitBounds(coordinates);
      }
    }, [ map]);
    return null;
  }

  return (
<div className="flex flex-col h-screen bg-gradient-to-r from-blue-100 to-blue-300">
  <Header />

  <div className="flex flex-1">
    <ProfileSidebar />

    <div className="flex flex-1 bg-gray-50 py-16 px-8">
      <div className="w-full flex flex-col space-y-8">
        <div className="flex space-x-8">
          <div className="w-1/2 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold pb-8 text-blue-700 text-center border-b-4 border-blue-500">
              Route Details
            </h2>
            <div className="grid grid-cols-1 gap-8 mt-4">
              {[
                { label: "Route ID", value: route.id },
                { label: "Start Location", value: route.startLocation },
                { label: "End Location", value: route.endLocation },
                { label: "Distance (km)", value: `${route.distance.toFixed(2)} km` },
                { label: "Price", value: `${route.price.toFixed(2)} $` },
                { label: "Status", value: route.status },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 bg-gray-100 rounded-lg transition hover:shadow-xl">
                  <span className="block text-gray-800 text-lg font-semibold">
                    {label}
                  </span>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

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

        <div className="flex justify-end items-center mt-8 space-x-4">
          {hasUpdatePermission && (
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              Update Route
            </button>
          )}

          {hasDeletePermission && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
            >
              Delete Route
            </button>
          )}
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div>
  );
}