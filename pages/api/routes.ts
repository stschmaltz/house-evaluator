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
  departureTime?: string;
}

interface TransitStep {
  mode: 'WALKING' | 'TRANSIT';
  duration: string;
  transitLineInfo?: {
    vehicle: string;
    lineName: string;
    lineColor?: string;
  };
}

interface TransitDetails {
  totalWalkingTime?: string;
  numberOfTransfers?: number;
  transitFare?: {
    currencyCode: string;
    units: string;
    nanos?: number;
  };
  transitSteps?: TransitStep[];
}

interface CalculatedRoute {
  duration: string;
  distance: string;
  polyline?: string;
  transitDetails?: TransitDetails;
}

interface LegStep {
  travelMode?: 'WALK' | 'TRANSIT';
  staticDuration?: string;
  duration?: string;
  transitDetails?: {
    transitLine?: {
      vehicle?: { type?: string };
      name?: string;
      color?: string;
    };
  };
}

interface Leg {
  steps?: LegStep[];
}

interface TravelAdvisory {
  transitFare?: {
    currencyCode: string;
    units: string;
    nanos?: number;
  };
}

interface GoogleRoute {
  duration?: string;
  distanceMeters?: number;
  polyline?: { encodedPolyline?: string };
  legs?: Leg[];
  travelAdvisory?: TravelAdvisory;
}

interface RouteResponse {
  routes: Array<{
    destination: string;
    duration: string;
    distance: string;
    polyline?: string;
    travelMode: 'DRIVE' | 'TRANSIT' | 'WALK' | 'BICYCLE';
    transitDetails?: TransitDetails;
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
    const { origin, destinations, departureTime }: RouteRequest = req.body;

    if (!origin || !destinations || destinations.length === 0) {
      return res.status(400).json({ error: 'Missing origin or destinations' });
    }

    const routes: Array<{
      destination: string;
      duration: string;
      distance: string;
      polyline?: string;
      travelMode: 'DRIVE' | 'TRANSIT' | 'WALK' | 'BICYCLE';
      transitDetails?: TransitDetails;
    }> = [];

    // Calculate all travel modes in parallel for each destination
    const travelModes: ('DRIVE' | 'TRANSIT' | 'WALK' | 'BICYCLE')[] = [
      'DRIVE',
      'TRANSIT',
      'WALK',
      'BICYCLE',
    ];

    for (const destination of destinations) {
      const modePromises = travelModes.map(async (travelMode) => {
        try {
          const routeResponse = await calculateRoute(
            origin,
            destination,
            travelMode,
            departureTime,
          );

          if (routeResponse.multipleRoutes) {
            // For transit with multiple route options
            return routeResponse.multipleRoutes.map(
              (route: CalculatedRoute, index: number) => ({
                destination: `${destination.name || destination.address || 'Unknown destination'}${routeResponse.multipleRoutes.length > 1 ? ` (Option ${index + 1})` : ''}`,
                duration: route.duration,
                distance: route.distance,
                polyline: route.polyline,
                travelMode,
                transitDetails: route.transitDetails,
              }),
            );
          } else {
            // For single route (driving, walking, biking)
            return [
              {
                destination:
                  destination.name ||
                  destination.address ||
                  'Unknown destination',
                duration: routeResponse.duration || 'Unknown',
                distance: routeResponse.distance || 'Unknown',
                polyline: routeResponse.polyline,
                travelMode,
                transitDetails:
                  'transitDetails' in routeResponse
                    ? (routeResponse.transitDetails as TransitDetails)
                    : undefined,
              },
            ];
          }
        } catch (error) {
          console.error(
            `Error calculating ${travelMode} route to ${destination.name}:`,
            error,
          );
          return [
            {
              destination:
                destination.name ||
                destination.address ||
                'Unknown destination',
              duration: 'Error calculating',
              distance: 'Error calculating',
              travelMode,
            },
          ];
        }
      });

      // Wait for all travel modes to complete for this destination
      const modeResults = await Promise.all(modePromises);
      routes.push(...modeResults.flat());
    }

    res.status(200).json({ routes });
  } catch (error) {
    console.error('Routes API error:', error);
    res.status(500).json({ error: 'Failed to calculate routes' });
  }
}

async function calculateRoute(
  origin: RouteRequest['origin'],
  destination: RouteRequest['destinations'][0],
  travelMode: 'DRIVE' | 'TRANSIT' | 'WALK' | 'BICYCLE',
  departureTime?: string,
) {
  const requestBody: Record<string, unknown> = {
    origin: formatWaypoint(origin),
    destination: formatWaypoint(destination),
    travelMode,
  };

  if (travelMode === 'DRIVE') {
    requestBody.routingPreference = 'TRAFFIC_AWARE';
  }

  if (travelMode === 'TRANSIT') {
    requestBody.transitPreferences = {
      allowedTravelModes: ['BUS', 'SUBWAY', 'TRAIN', 'LIGHT_RAIL'],
    };

    // Use provided departure time or current time
    const timeToUse = departureTime
      ? parseTimeToISO(departureTime)
      : new Date().toISOString();
    requestBody.departureTime = timeToUse;

    // Request up to 3 alternative routes for transit
    requestBody.computeAlternativeRoutes = true;
  }

  // For walking and biking, we can also set departure time for consistency
  if ((travelMode === 'WALK' || travelMode === 'BICYCLE') && departureTime) {
    requestBody.departureTime = parseTimeToISO(departureTime);
  }

  const fieldMask =
    travelMode === 'TRANSIT'
      ? 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.steps.transitDetails,routes.legs.steps.travelMode,routes.legs.steps.staticDuration,routes.travelAdvisory.transitFare'
      : 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline';

  const response = await fetch(
    'https://routes.googleapis.com/directions/v2:computeRoutes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY!,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Routes API error details:', {
      status: response.status,
      statusText: response.statusText,
      body: errorData,
      requestBody,
    });
    throw new Error(`Routes API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();

  if (data.routes && data.routes.length > 0) {
    if (travelMode === 'TRANSIT') {
      // Return up to 3 transit route alternatives
      const routes = (data.routes as GoogleRoute[])
        .slice(0, 3)
        .map((route: GoogleRoute) => ({
          duration: formatDuration(route.duration) || 'Unknown',
          distance: route.distanceMeters
            ? `${(route.distanceMeters / 1000).toFixed(1)} km`
            : 'Unknown',
          polyline: route.polyline?.encodedPolyline,
          transitDetails:
            route.legs && route.legs.length > 0
              ? parseTransitDetails(route.legs[0], route.travelAdvisory)
              : undefined,
        }));

      // Deduplicate routes based on key characteristics
      const uniqueRoutes = deduplicateRoutes(routes);
      return { multipleRoutes: uniqueRoutes };
    } else {
      // For driving, return single route as before
      const route = data.routes[0];

      return {
        duration: formatDuration(route.duration) || 'Unknown',
        distance: route.distanceMeters
          ? `${(route.distanceMeters / 1000).toFixed(1)} km`
          : 'Unknown',
        polyline: route.polyline?.encodedPolyline,
      };
    }
  } else {
    return {
      duration: 'Unable to calculate',
      distance: 'Unable to calculate',
    };
  }
}

function formatDuration(duration?: string): string {
  if (!duration) return 'Unknown';

  // Parse duration string like "1202s" to seconds
  const seconds = parseInt(duration.replace('s', ''));
  if (isNaN(seconds)) return duration;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

function formatWaypoint(location: {
  address?: string;
  placeId?: string;
  location?: { lat: number; lng: number };
}) {
  if (location.location) {
    return {
      location: {
        latLng: {
          latitude: location.location.lat,
          longitude: location.location.lng,
        },
      },
    };
  } else if (location.placeId) {
    return {
      placeId: location.placeId,
    };
  } else if (location.address) {
    return {
      address: location.address,
    };
  }
  throw new Error('Invalid waypoint format');
}

function parseTransitDetails(
  leg: Leg,
  travelAdvisory?: TravelAdvisory,
): TransitDetails {
  const transitDetails: TransitDetails = {};

  if (travelAdvisory?.transitFare) {
    transitDetails.transitFare = travelAdvisory.transitFare;
  }

  if (leg.steps) {
    let walkingTime = 0;
    let transfers = 0;
    const transitSteps: TransitStep[] = [];

    // Merge consecutive walking steps
    let currentWalkingDuration = 0;

    for (let i = 0; i < leg.steps.length; i++) {
      const step = leg.steps[i];

      if (step.travelMode === 'WALK') {
        const stepDuration = parseInt(
          step.staticDuration?.replace('s', '') ||
            step.duration?.replace('s', '') ||
            '0',
        );
        walkingTime += stepDuration;
        currentWalkingDuration += stepDuration;

        // Check if next step is also walking
        const nextStep = leg.steps[i + 1];
        const isLastStep = i === leg.steps.length - 1;
        const nextIsWalking = nextStep && nextStep.travelMode === 'WALK';

        // Only add walking step if this is the last walking step in a sequence
        if (!nextIsWalking || isLastStep) {
          if (currentWalkingDuration > 0) {
            transitSteps.push({
              mode: 'WALKING',
              duration: formatDuration(`${currentWalkingDuration}s`),
            });
          }
          currentWalkingDuration = 0;
        }
      } else if (step.travelMode === 'TRANSIT') {
        transfers++;
        transitSteps.push({
          mode: 'TRANSIT',
          duration: formatDuration(
            step.staticDuration || step.duration || '0s',
          ),
          transitLineInfo: step.transitDetails
            ? {
                vehicle:
                  step.transitDetails.transitLine?.vehicle?.type || 'Unknown',
                lineName: step.transitDetails.transitLine?.name || 'Unknown',
                lineColor: step.transitDetails.transitLine?.color,
              }
            : undefined,
        });
      }
    }

    if (walkingTime > 0) {
      transitDetails.totalWalkingTime = formatDuration(`${walkingTime}s`);
    }

    if (transfers > 0) {
      transitDetails.numberOfTransfers = Math.max(0, transfers - 1); // First transit doesn't count as transfer
    }

    transitDetails.transitSteps = transitSteps;
  }

  return transitDetails;
}

function parseTimeToISO(timeString: string): string {
  const today = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);

  today.setHours(hours, minutes, 0, 0);

  return today.toISOString();
}

function deduplicateRoutes(routes: CalculatedRoute[]): CalculatedRoute[] {
  const seen = new Set<string>();

  return routes.filter((route) => {
    // Create a signature based on key characteristics
    const signature = [
      route.duration,
      route.transitDetails?.totalWalkingTime || '',
      route.transitDetails?.numberOfTransfers || 0,
      route.transitDetails?.transitSteps
        ?.map((step: TransitStep) =>
          step.mode === 'WALKING' ? 'WALK' : step.transitLineInfo?.lineName,
        )
        .join('|') || '',
    ].join('::');

    if (seen.has(signature)) {
      return false; // Duplicate found
    }

    seen.add(signature);
    return true;
  });
}
