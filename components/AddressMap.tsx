import { useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../context/GoogleMapsContext';

interface AddressMapProps {
  originLocation?: { lat: number; lng: number };
  originAddress?: string;
  destinations?: Array<{
    name: string;
    location: { lat: number; lng: number };
  }>;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  scrollwheel: true,
  gestureHandling: 'greedy' as const,
};

export function AddressMap({
  originLocation,
  originAddress,
  destinations = [],
  className = '',
}: AddressMapProps) {
  const { isLoaded } = useGoogleMaps();

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
  }, []);

  if (!isLoaded || !originLocation) {
    return (
      <div
        className={`w-full h-96 rounded-lg overflow-hidden border border-primary/20 ${className} flex items-center justify-center bg-base-200`}
      >
        <div className="text-base-content/60">
          {!isLoaded ? 'Loading map...' : 'No location provided'}
        </div>
      </div>
    );
  }

  const originIcon =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ff0010"/>
    </svg>
  `);

  const destinationIcon =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3B82F6"/>
    </svg>
  `);

  return (
    <div
      className={`w-full h-96 rounded-lg overflow-hidden border border-primary/20 ${className}`}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={originLocation}
        zoom={13}
        options={mapOptions}
        onLoad={onLoad}
      >
        <Marker
          position={originLocation}
          title={originAddress || 'Your Address'}
          icon={originIcon}
        />
        {destinations.map((destination, index) => (
          <Marker
            key={`destination-${index}`}
            position={destination.location}
            title={destination.name}
            icon={destinationIcon}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
