import { AddressMap } from './AddressMap';

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
      lineShortName?: string;
      lineColor?: string;
    };
  }>;
}

type TravelMode = 'DRIVE' | 'TRANSIT' | 'WALK' | 'BICYCLE';

interface RouteResult {
  destination: string;
  duration: string;
  distance: string;
  polyline?: string;
  travelMode: TravelMode;
  transitDetails?: TransitDetails;
}

interface RouteResultsProps {
  routes: RouteResult[];
  originAddress: string;
  originLocation?: { lat: number; lng: number };
  destinations?: Array<{
    name: string;
    location: { lat: number; lng: number };
  }>;
  isLoading?: boolean;
  error?: string | null;
}

function formatFare(fare?: {
  currencyCode: string;
  units: string;
  nanos?: number;
}): string {
  console.log(fare);
  if (!fare) return '';

  const amount = parseFloat(fare.units) + (fare.nanos || 0) / 1000000000;
  return `${fare.currencyCode} ${amount.toFixed(2)}`;
}

function parseDurationToMinutes(duration: string): number {
  if (!duration) return Number.POSITIVE_INFINITY;
  const hoursMatch = duration.match(/(\d+)h/);
  const minutesMatch = duration.match(/(\d+)m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  if (!hoursMatch && !minutesMatch) return Number.POSITIVE_INFINITY;
  return hours * 60 + minutes;
}

function getShortestDuration(routes: RouteResult[]): number {
  return Math.min(...routes.map((r) => parseDurationToMinutes(r.duration)));
}

function getTransitEmoji(vehicleType?: string): string {
  if (!vehicleType) return '🚌';

  const type = vehicleType.toLowerCase();
  if (type.includes('bus')) return '🚌';
  if (type.includes('subway') || type.includes('metro')) return '🚇';
  if (type.includes('train') || type.includes('rail')) return '🚆';
  if (type.includes('tram') || type.includes('light_rail')) return '🚋';
  if (type.includes('ferry')) return '⛴️';

  return '🚌'; // Default to bus
}

function groupRoutesByLocation(
  routes: RouteResult[],
): Record<string, Map<TravelMode, RouteResult[]>> {
  const grouped: Record<string, Map<TravelMode, RouteResult[]>> = {};

  for (const route of routes) {
    const baseName = route.destination.replace(/ \(Option \d+\)$/, '');

    if (!grouped[baseName]) {
      grouped[baseName] = new Map();
    }

    if (!grouped[baseName].has(route.travelMode)) {
      grouped[baseName].set(route.travelMode, []);
    }

    grouped[baseName].get(route.travelMode)!.push(route);
  }

  return grouped;
}

const TRAVEL_MODE_EMOJI: Record<TravelMode, string> = {
  DRIVE: '🚗',
  TRANSIT: '🚌',
  WALK: '🚶',
  BICYCLE: '🚴',
};

function getTravelModeEmoji(mode: TravelMode): string {
  return TRAVEL_MODE_EMOJI[mode] ?? '🚗';
}

const TRAVEL_MODE_NAME: Record<TravelMode, string> = {
  DRIVE: 'Driving',
  TRANSIT: 'Transit',
  WALK: 'Walking',
  BICYCLE: 'Biking',
};

function getTravelModeName(mode: TravelMode): string {
  return TRAVEL_MODE_NAME[mode] ?? mode;
}

export function RouteResults({
  routes,
  originAddress,
  originLocation,
  destinations,
  isLoading,
  error,
}: RouteResultsProps) {
  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl border border-primary/20">
        <div className="card-body p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-focus rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-secondary-content animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-base-content">
              Calculating Routes...
            </h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-base-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return null;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl border border-primary/20">
      <div className="card-body p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-focus rounded-lg flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-secondary-content"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              House Evaluation
            </h2>
            <p className="text-base-content/60 text-sm">
              From: {originAddress}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {originLocation && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-base-content mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Location Overview
              </h3>
              <AddressMap
                originLocation={originLocation}
                originAddress={originAddress}
                destinations={destinations}
                className="mb-4"
              />
            </div>
          )}

          {Object.entries(groupRoutesByLocation(routes)).map(
            ([locationName, travelModeGroups], locationIndex) => (
              <div key={locationName} className="space-y-2">
                <h2 className="font-bold text-xl text-base-content flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-focus rounded-full flex items-center justify-center text-primary-content font-bold text-sm">
                    {locationIndex + 1}
                  </div>
                  <span>{locationName}</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Personal Transport Group */}
                  <div className="bg-gradient-to-br from-base-50 to-base-100 rounded-xl p-4 border-2 border-base-200">
                    <div className="space-y-3">
                      {(['DRIVE', 'BICYCLE', 'WALK'] as TravelMode[])
                        .filter((mode) => travelModeGroups.has(mode))
                        .map((travelMode) => {
                          const modeRoutes = travelModeGroups.get(travelMode)!;
                          return (
                            <div key={travelMode}>
                              <div className="flex items-center gap-2 font-semibold text-base-content mb-1">
                                <span className="text-lg">
                                  {getTravelModeEmoji(travelMode)}
                                </span>
                                <span className="text-sm">
                                  {getTravelModeName(travelMode)}
                                </span>
                              </div>

                              {modeRoutes
                                .sort(
                                  (a, b) =>
                                    parseDurationToMinutes(a.duration) -
                                    parseDurationToMinutes(b.duration),
                                )
                                .slice(0, 1)
                                .map((route, routeIndex) => {
                                  const durationMinutes =
                                    parseDurationToMinutes(route.duration);
                                  const isQuick = durationMinutes <= 30;
                                  const isMedium = durationMinutes <= 45;
                                  return (
                                    <div
                                      key={routeIndex}
                                      className="bg-white border border-base-300 rounded-lg p-2 hover:shadow-sm transition-shadow"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span
                                          className={`font-bold text-lg ${
                                            isQuick
                                              ? 'text-success'
                                              : isMedium
                                                ? 'text-warning'
                                                : 'text-error'
                                          }`}
                                        >
                                          {route.duration}
                                        </span>
                                      </div>
                                      <div className="text-sm text-base-content/70 mt-1">
                                        {route.distance}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Transit Group */}
                  {travelModeGroups.has('TRANSIT') && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                      <div className="flex items-center gap-2 font-semibold text-base-content mb-3">
                        <span className="text-lg">🚌</span>
                        <span className="text-sm">Transit</span>
                      </div>

                      <div className="space-y-2">
                        {travelModeGroups
                          .get('TRANSIT')!
                          .sort(
                            (a, b) =>
                              parseDurationToMinutes(a.duration) -
                              parseDurationToMinutes(b.duration),
                          )
                          .slice(0, 3)
                          .map((route, routeIndex) => {
                            const durationMinutes = parseDurationToMinutes(
                              route.duration,
                            );
                            const isQuick = durationMinutes <= 30;
                            const isMedium = durationMinutes <= 45;

                            return (
                              <div
                                key={routeIndex}
                                className="bg-white border border-blue-300 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-bold text-lg ${
                                        isQuick
                                          ? 'text-success'
                                          : isMedium
                                            ? 'text-warning'
                                            : 'text-error'
                                      }`}
                                    >
                                      {route.duration}
                                    </span>
                                    <span className="text-sm text-base-content/60">
                                      {route.distance}
                                    </span>
                                  </div>

                                  <div className="w-6 h-6 bg-blue-500/20 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                                    {routeIndex + 1}
                                  </div>
                                </div>

                                {route.transitDetails && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {route.transitDetails.totalWalkingTime && (
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                                        🚶{' '}
                                        {route.transitDetails.totalWalkingTime}
                                      </span>
                                    )}
                                    {route.transitDetails.numberOfTransfers !==
                                      undefined && (
                                      <span className="bg-warning/15 text-warning px-2 py-1 rounded text-sm font-medium">
                                        🔄{' '}
                                        {route.transitDetails.numberOfTransfers}
                                      </span>
                                    )}
                                    {route.transitDetails.transitFare && (
                                      <span className="bg-accent/15 text-accent px-2 py-1 rounded text-sm font-medium">
                                        💰{' '}
                                        {formatFare(
                                          route.transitDetails.transitFare,
                                        )}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {route.transitDetails?.transitSteps && (
                                  <details className="group">
                                    <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium">
                                      <span className="inline-flex items-center gap-2 py-1">
                                        <span>📋</span>
                                        <span>
                                          Steps (
                                          {
                                            route.transitDetails.transitSteps
                                              .length
                                          }
                                          )
                                        </span>
                                        <svg
                                          className="w-4 h-4 transition-transform group-open:rotate-180"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                          />
                                        </svg>
                                      </span>
                                    </summary>
                                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                      {route.transitDetails.transitSteps.map(
                                        (step, stepIndex) => (
                                          <div
                                            key={stepIndex}
                                            className="flex items-center justify-between text-xs bg-blue-50 rounded-lg px-3 py-2"
                                          >
                                            <span className="flex items-center gap-2">
                                              <span className="text-sm">
                                                {step.mode === 'WALKING'
                                                  ? '🚶'
                                                  : getTransitEmoji(
                                                      step.transitLineInfo
                                                        ?.vehicle,
                                                    )}
                                              </span>
                                              <span className="font-medium">
                                                {step.mode === 'WALKING'
                                                  ? 'Walk'
                                                  : step.transitLineInfo
                                                      ?.lineShortName ||
                                                    step.transitLineInfo
                                                      ?.lineName ||
                                                    'Transit'}
                                              </span>
                                            </span>
                                            <span className="text-base-content/70 font-medium">
                                              {step.duration}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </details>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
