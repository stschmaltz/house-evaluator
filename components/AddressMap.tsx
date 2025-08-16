import { useEffect, useRef } from 'react';

interface AddressMapProps {
  originLocation?: { lat: number; lng: number };
  originAddress?: string;
  destinations?: Array<{
    name: string;
    location: { lat: number; lng: number };
  }>;
  className?: string;
}

export function AddressMap({
  originLocation,
  originAddress,
  destinations = [],
  className = '',
}: AddressMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps || !originLocation) return;

    const initializeMap = async () => {
      try {
        const { Map } = (await window.google.maps.importLibrary(
          'maps',
        )) as unknown as google.maps.MapsLibrary;
        const { Marker } = (await window.google.maps.importLibrary(
          'marker',
        )) as google.maps.MarkerLibrary;

        const map = new Map(mapRef.current!, {
          center: originLocation,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          scrollwheel: true,
          gestureHandling: 'greedy',
        });

        mapInstanceRef.current = map;

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const originMarker = new Marker({
          position: originLocation,
          map: map,
          title: originAddress || 'Your Address',
          icon: {
            url:
              'data:image/svg+xml;charset=UTF-8,' +
              encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ff0010"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32),
          },
        });

        markersRef.current.push(originMarker);

        destinations.forEach((destination) => {
          const destinationMarker = new Marker({
            position: destination.location,
            map: map,
            title: destination.name,
            icon: {
              url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3B82F6"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 32),
            },
          });

          markersRef.current.push(destinationMarker);
        });

        map.setCenter(originLocation);
        map.setZoom(13);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [originLocation, originAddress, destinations]);

  if (!originLocation) {
    return null;
  }

  return (
    <div
      className={`w-full h-96 rounded-lg overflow-hidden border border-primary/20 ${className}`}
    >
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
