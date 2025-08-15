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

interface RouteResultsProps {
  routes: RouteResult[];
  originAddress: string;
  isLoading?: boolean;
}

function formatFare(fare?: {
  currencyCode: string;
  units: string;
  nanos?: number;
}): string {
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

function groupRoutesByLocation(routes: RouteResult[]) {
  const grouped: { [key: string]: { [key: string]: RouteResult[] } } = {};

  routes.forEach((route) => {
    // Group first by location, then by travel mode
    const baseName = route.destination.replace(/ \(Option \d+\)$/, '');
    if (!grouped[baseName]) {
      grouped[baseName] = {};
    }

    if (!grouped[baseName][route.travelMode]) {
      grouped[baseName][route.travelMode] = [];
    }
    grouped[baseName][route.travelMode].push(route);
  });

  return grouped;
}

function getTravelModeEmoji(mode: string): string {
  switch (mode) {
    case 'DRIVE':
      return '🚗';
    case 'TRANSIT':
      return '🚌';
    case 'WALK':
      return '🚶';
    case 'BICYCLE':
      return '🚴';
    default:
      return '🚗';
  }
}

function getTravelModeName(mode: string): string {
  switch (mode) {
    case 'DRIVE':
      return 'Driving';
    case 'TRANSIT':
      return 'Transit';
    case 'WALK':
      return 'Walking';
    case 'BICYCLE':
      return 'Biking';
    default:
      return mode;
  }
}

export function RouteResults({
  routes,
  originAddress,
  isLoading,
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
              Route Analysis
            </h2>
            <p className="text-base-content/60 text-sm">
              From: {originAddress}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupRoutesByLocation(routes)).map(
            ([locationName, travelModeGroups], locationIndex) => (
              <div key={locationName} className="space-y-3">
                <h2 className="font-bold text-xl text-base-content flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-focus rounded-full flex items-center justify-center text-primary-content font-bold text-sm">
                    {locationIndex + 1}
                  </div>
                  <span>{locationName}</span>
                </h2>

                <div className="space-y-3 ml-6">
                  {Object.entries(travelModeGroups)
                    .sort(
                      ([, aRoutes], [, bRoutes]) =>
                        getShortestDuration(aRoutes) -
                        getShortestDuration(bRoutes),
                    )
                    .map(([travelMode, modeRoutes]) => (
                      <div key={travelMode}>
                        {modeRoutes
                          .sort(
                            (a, b) =>
                              parseDurationToMinutes(a.duration) -
                              parseDurationToMinutes(b.duration),
                          )
                          .map((route, routeIndex) => (
                          <div
                            key={routeIndex}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-base-200/30 hover:bg-base-200/50 transition-colors border-l-4 border-primary/30"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-lg">
                                {getTravelModeEmoji(travelMode)}
                              </span>

                              <div className="flex items-center gap-4 min-w-0 flex-1">
                                <span className="font-medium text-sm">
                                  {getTravelModeName(travelMode)}
                                </span>
                                <span className="font-medium text-sm text-primary">
                                  {route.duration}
                                </span>
                                <span className="text-sm text-base-content/60">
                                  {route.distance}
                                </span>

                                {route.travelMode === 'TRANSIT' &&
                                  route.transitDetails && (
                                    <div className="flex items-center gap-2 text-xs">
                                      {route.transitDetails
                                        .totalWalkingTime && (
                                        <span className="bg-secondary/15 text-secondary px-1.5 py-0.5 rounded text-xs">
                                          🚶{' '}
                                          {
                                            route.transitDetails
                                              .totalWalkingTime
                                          }
                                        </span>
                                      )}
                                      {route.transitDetails
                                        .numberOfTransfers !== undefined && (
                                        <span className="bg-warning/15 text-warning px-1.5 py-0.5 rounded text-xs">
                                          🔄{' '}
                                          {
                                            route.transitDetails
                                              .numberOfTransfers
                                          }
                                        </span>
                                      )}
                                      {route.transitDetails.transitFare && (
                                        <span className="bg-accent/15 text-accent px-1.5 py-0.5 rounded text-xs">
                                          💰{' '}
                                          {formatFare(
                                            route.transitDetails.transitFare,
                                          )}
                                        </span>
                                      )}
                                      {route.transitDetails.transitSteps &&
                                        route.transitDetails.transitSteps
                                          .length > 0 && (
                                          <details className="group inline">
                                            <summary className="bg-info/15 text-info px-1.5 py-0.5 rounded cursor-pointer hover:bg-info/25 transition-colors text-xs inline">
                                              📋{' '}
                                              {
                                                route.transitDetails
                                                  .transitSteps.length
                                              }
                                            </summary>
                                            <div className="absolute z-10 mt-1 p-2 bg-base-100 rounded-lg shadow-lg border text-xs min-w-64">
                                              <div className="space-y-1">
                                                {route.transitDetails.transitSteps.map(
                                                  (step, stepIndex) => (
                                                    <div
                                                      key={stepIndex}
                                                      className="flex items-center justify-between"
                                                    >
                                                      <span>
                                                        {step.mode === 'WALKING'
                                                          ? '🚶'
                                                          : getTransitEmoji(
                                                              step
                                                                .transitLineInfo
                                                                ?.vehicle,
                                                            )}{' '}
                                                        {step.mode === 'WALKING'
                                                          ? 'Walk'
                                                          : step.transitLineInfo
                                                              ?.lineName ||
                                                            'Transit'}
                                                        {step.transitLineInfo
                                                          ?.vehicle &&
                                                          ` (${step.transitLineInfo.vehicle})`}
                                                      </span>
                                                      <span className="text-base-content/60">
                                                        {step.duration}
                                                      </span>
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            </div>
                                          </details>
                                        )}
                                    </div>
                                  )}
                              </div>
                            </div>

                            {modeRoutes.length > 1 && (
                              <div className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold ml-2">
                                {routeIndex + 1}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ),
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
