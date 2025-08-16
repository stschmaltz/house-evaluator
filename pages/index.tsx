import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useState } from 'react';
import { useUserSignIn } from '../hooks/use-user-sign-in.hook';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { AuthenticatedHome } from '../components/AuthenticatedHome';
import { LandingPage } from '../components/LandingPage';

interface TransitDetails {
  totalWalkingTime?: string;
  numberOfTransfers?: number;
  transitFare?: {
    currencyCode: string;
    units: string;
    nanos?: number;
  };
  transitSteps?: Array<{
    mode: 'WALKING' | 'TRANSIT';
    duration: string;
    transitLineInfo?: {
      vehicle: string;
      lineName: string;
      lineColor?: string;
    };
  }>;
}

interface RouteResult {
  destination: string;
  duration: string;
  distance: string;
  polyline?: string;
  travelMode: 'DRIVE' | 'TRANSIT' | 'WALK' | 'BICYCLE';
  transitDetails?: TransitDetails;
}

function parseDurationToMinutes(duration: string): number {
  const hourMatch = duration.match(/(\d+)h/);
  const minuteMatch = duration.match(/(\d+)m/);
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  if (!hourMatch && !minuteMatch) {
    return 0;
  }
  return hours * 60 + minutes;
}

const DEFAULT_DESTINATIONS = [
  {
    name: 'Foothills',
    location: { lat: 51.06541940356553, lng: -114.13378879331637 },
  },
  {
    name: 'Downtown',
    location: { lat: 51.04544058941334, lng: -114.07071098625774 },
  },
  {
    name: 'Winston Churchill Aquatic',
    location: { lat: 51.09689344709322, lng: -114.13761782760777 },
  },
  {
    name: 'Killarney Aquatic',
    location: { lat: 51.03728728673486, lng: -114.13022860194634 },
  },
  {
    name: 'Sushi',
    location: { lat: 51.03728728673486, lng: -114.13022860194634 },
  },
];

export default function Home() {
  const { error: authError } = useUser();
  const [isSigningIn, currentUser] = useUserSignIn();
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [originAddress, setOriginAddress] = useState('');
  const [originLocation, setOriginLocation] = useState<
    { lat: number; lng: number } | undefined
  >();
  const [isCalculatingRoutes, setIsCalculatingRoutes] = useState(false);
  const [error, setError] = useState<string | null>(authError?.message || null);

  const handleAddressSubmit = async (addressData: {
    address: string;
    placeId?: string;
    location?: { lat: number; lng: number };
  }) => {
    if (!addressData.address.trim()) return;

    setIsCalculatingRoutes(true);
    setOriginAddress(addressData.address);
    setOriginLocation(addressData.location);
    setRoutes([]);
    setError(null);

    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: addressData,
          destinations: DEFAULT_DESTINATIONS,
        }),
      });

      if (!response.ok) {
        setRoutes([]);
        setError('Failed to calculate routes');
      }

      const data = await response.json();
      const filteredRoutes = (data.routes || []).filter(
        (route: RouteResult) => parseDurationToMinutes(route.duration) <= 60,
      );
      setRoutes(filteredRoutes);
      setError(null);
    } catch (error) {
      console.error('Error calculating routes:', error);
      setRoutes([]);
      setError('Failed to calculate routes');
    } finally {
      setIsCalculatingRoutes(false);
    }
  };

  if (isSigningIn) {
    return <LoadingState isLoading={false} />;
  }

  if (error) {
    return <ErrorState error={new Error(error)} />;
  }

  if (currentUser) {
    return (
      <AuthenticatedHome
        currentUser={currentUser}
        onAddressSubmit={handleAddressSubmit}
        routes={routes}
        originAddress={originAddress}
        originLocation={originLocation}
        destinations={DEFAULT_DESTINATIONS}
        isCalculatingRoutes={isCalculatingRoutes}
        error={error}
      />
    );
  }

  return <LandingPage />;
}
