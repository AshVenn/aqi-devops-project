import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coordinates } from '@/types/aqi';
import { sanitizeCoordinates } from '@/lib/coordinates';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

const primaryIcon = createCustomIcon('hsl(174, 62%, 35%)');
interface MapPanelProps {
  marker: Coordinates | null;
  onMapClick: (coords: Coordinates) => void;
}

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (coords: Coordinates) => void }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      const coords = sanitizeCoordinates({ lat: e.latlng.lat, lon: e.latlng.lng });
      onMapClick(coords);
    },
  });
  return null;
}

// Component to update map view
function MapViewUpdater({ center }: { center?: Coordinates | null }) {
  const map = useMap();
  const initialRef = useRef(true);
  
  useEffect(() => {
    if (center && initialRef.current) {
      map.flyTo([center.lat, center.lon], 12, { duration: 0.5 });
      initialRef.current = false;
    }
  }, [center, map]);
  
  return null;
}

export function MapPanel({
  marker,
  onMapClick,
}: MapPanelProps) {
  // Morocco default center
  const defaultCenter: [number, number] = [31.7917, -7.0926];
  const defaultZoom = 6;

  return (
    <div className="map-container h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onMapClick} />
        
        <MapViewUpdater center={marker} />
        
        {/* AQI prediction marker */}
        {marker && <Marker position={[marker.lat, marker.lon]} icon={primaryIcon} />}
      </MapContainer>
      
      {/* Map instruction overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-sm text-muted-foreground">
        <span>Click on the map to select a location</span>
      </div>
    </div>
  );
}
