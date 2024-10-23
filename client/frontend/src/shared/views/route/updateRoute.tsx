'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { useUser } from '@/src/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useCreateRequest, useGetRoute } from '@/src/hooks/useRoute';
import Loading from '@/src/app/loading';
import Header from '../../components/Header';
import ProfileSidebar from '../../components/pages/admin/ProfileSidebar';
import Footer from '../../components/Footer';
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
  const { user, loading } = useUser();
  const { route, loading: routeLoading, error: fetchError } = useGetRoute(routeId);
  const router = useRouter();
  const createRequest = useCreateRequest();

  const OPEN_CAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  const PRICE_PER_KM = 1.5;

  useEffect(() => {
    if (route) {
      setForm({
        startLocation: route.startLocation,
        endLocation: route.endLocation,
        distance: 0,
        price: 0,
        status: route.status || 'pending',
      });

      geocodeLocations(route.startLocation, route.endLocation);
    }
  }, [route]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'startLocation' || name === 'endLocation') {
      geocodeLocations(
        name === 'startLocation' ? value : form.startLocation,
        name === 'endLocation' ? value : form.endLocation
      );
    }
  };

  const geocodeLocation = async (location: string): Promise<[number, number]> => {
    if (!OPEN_CAGE_API_KEY) throw new Error('OpenCage API key is missing');

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=${OPEN_CAGE_API_KEY}`
    );
    const data = await response.json();

    if (data.results.length === 0) throw new Error('Location not found');

    const { lat, lng } = data.results[0].geometry;
    return [lat, lng];
  };

  const geocodeLocations = async (startLocation: string, endLocation: string) => {
    try {
      const startCoords = await geocodeLocation(startLocation);
      const endCoords = await geocodeLocation(endLocation);

      setCoordinates([startCoords, endCoords]);

      const distance = calculateDistance(startCoords, endCoords);
      const price = distance * PRICE_PER_KM;

      setForm((prev) => ({
        ...prev,
        distance: Math.round(distance),
        price: Math.round(price),
      }));
    } catch (err) {
      setError('Error fetching coordinates or calculating distance');
    }
  };

  const calculateDistance = (coords1: [number, number], coords2: [number, number]): number => {
    const R = 6371;
    const dLat = (coords2[0] - coords1[0]) * (Math.PI / 180);
    const dLng = (coords2[1] - coords1[1]) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coords1[0] * (Math.PI / 180)) * Math.cos(coords2[0] * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userId = user.id;
      const requestType = 'update';
      const proposedChanges = {
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        distance: form.distance,
      };

      await createRequest(userId, routeId, requestType, proposedChanges);
      setMessage('Request route update successfully.');
      setError('');

      router.push(`/api/route/request/${userId}`);
    } catch (err) {
      setError('Failed to make a request route update.');
      setMessage('');
    }
  };

  if (loading || routeLoading) return <Loading />;
  if (fetchError) return <p>Error: {fetchError.message}</p>;

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

        <div className="flex flex-1 bg-gray-50 py-16 px-8">
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold pb-8 text-blue-600">Update Route</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <button type="submit" className="w-full py-4 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Update Route
              </button>
            </form>
            {message && <p className="mt-4 text-lg text-green-500">{message}</p>}
            {error && <p className="mt-4 text-lg text-red-500">{error}</p>}
          </div>

          <div className="w-1/2 h-[800px] rounded-lg shadow-lg overflow-hidden">
            {coordinates.length === 2 && (
              <MapContainer center={coordinates[0]} zoom={10} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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