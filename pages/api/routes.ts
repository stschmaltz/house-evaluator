import { NextApiRequest, NextApiResponse } from 'next';

interface RouteRequest {
  origin: {
    address?: string;
    placeId?: string;
    location?: { lat: number; lng: number };
  };
  destinations: Array<{
    address?: string;
    placeId?: string;
    location?: { lat: number; lng: number };
    name?: string;
  }>;
}

interface RouteResponse {
  routes: Array<{
    destination: string;
    duration: string;
    distance: string;
    polyline?: string;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RouteResponse | { error: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { origin, destinations }: RouteRequest = req.body;

    if (!origin || !destinations || destinations.length === 0) {
      return res.status(400).json({ error: 'Missing origin or destinations' });
    }

    // Use Google Directions API for individual route calculations
    const routes: Array<{
      destination: string;
      duration: string;
      distance: string;
      polyline?: string;
    }> = [];

    // Calculate routes to each destination individually
    for (const [index, destination] of destinations.entries()) {
      try {
        let originParam = '';
        let destParam = '';

        // Format origin
        if (origin.location) {
          originParam = `${origin.location.lat},${origin.location.lng}`;
        } else if (origin.placeId) {
          originParam = `place_id:${origin.placeId}`;
        } else if (origin.address) {
          originParam = encodeURIComponent(origin.address);
        }

        // Format destination
        if (destination.location) {
          destParam = `${destination.location.lat},${destination.location.lng}`;
        } else if (destination.placeId) {
          destParam = `place_id:${destination.placeId}`;
        } else if (destination.address) {
          destParam = encodeURIComponent(destination.address);
        }

        const directionsUrl = new URL(
          'https://maps.googleapis.com/maps/api/directions/json',
        );
        directionsUrl.searchParams.set('origin', originParam);
        directionsUrl.searchParams.set('destination', destParam);
        directionsUrl.searchParams.set('key', process.env.GOOGLE_MAPS_API_KEY!);
        directionsUrl.searchParams.set('mode', 'driving');
        directionsUrl.searchParams.set('departure_time', 'now');

        const response = await fetch(directionsUrl.toString());

        if (!response.ok) {
          throw new Error(`Directions API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'OK' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const leg = route.legs[0];

          routes.push({
            destination:
              destination.name || destination.address || 'Unknown destination',
            duration: leg.duration?.text || 'Unknown',
            distance: leg.distance?.text || 'Unknown',
            polyline: route.overview_polyline?.points,
          });
        } else {
          routes.push({
            destination:
              destination.name || destination.address || 'Unknown destination',
            duration: 'Unable to calculate',
            distance: 'Unable to calculate',
          });
        }
      } catch (error) {
        console.error(`Error calculating route to ${destination.name}:`, error);
        routes.push({
          destination:
            destination.name || destination.address || 'Unknown destination',
          duration: 'Error calculating',
          distance: 'Error calculating',
        });
      }
    }

    res.status(200).json({ routes });
  } catch (error) {
    console.error('Routes API error:', error);
    res.status(500).json({ error: 'Failed to calculate routes' });
  }
}
