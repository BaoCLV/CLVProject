import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const customIcon = L.icon({
  iconUrl: "/img/map-marker.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

interface LeafletMapProps {
  coordinates: [number, number][];
}

const LeafletMap = ({ coordinates }: LeafletMapProps) => {
  useEffect(() => {
    if (!coordinates.length) return;
    // Do any additional side-effects for map on client-side
  }, [coordinates]);

  return (
    <MapContainer
      center={coordinates.length ? coordinates[0] : [51.505, -0.09]}
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
        </>
      )}
    </MapContainer>
  );
};

export default LeafletMap;
