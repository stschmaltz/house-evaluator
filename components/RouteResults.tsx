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
  travelMode: 'DRIVE' | 'TRANSIT';
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
  const grouped: { [key: string]: RouteResult[] } = {};
  
  routes.forEach(route => {
    // Extract base destination name (remove "(Option X)" part)
    const baseName = route.destination.replace(/ \(Option \d+\)$/, '');
    if (!grouped[baseName]) {
      grouped[baseName] = [];
    }
    grouped[baseName].push(route);
  });
  
  return grouped;
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

        <div className="space-y-4">
          {Object.entries(groupRoutesByLocation(routes)).map(([locationName, locationRoutes], locationIndex) => (
            <div key={locationName} className="space-y-2">
              <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-focus rounded-full flex items-center justify-center text-primary-content font-bold text-sm">
                  {locationIndex + 1}
                </div>
                {locationName}
              </h3>
              <div className="space-y-2 ml-10">
                {locationRoutes.map((route, routeIndex) => (
                  <div
                    key={routeIndex}
                    className="bg-gradient-to-r from-base-200/50 to-base-300/30 rounded-lg p-3 border border-base-300/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-sm text-base-content/70 mb-2">
                          <span className="font-medium">{route.duration}</span>
                          <span className="font-medium">{route.distance}</span>
                          <span className="text-xs uppercase font-medium">
                            {route.travelMode === 'TRANSIT' ? 'Transit' : 'Driving'}
                          </span>
                        </div>

                        {route.travelMode === 'TRANSIT' && route.transitDetails && (
                          <div className="flex flex-wrap gap-3 text-xs">
                            {route.transitDetails.totalWalkingTime && (
                              <span className="bg-secondary/20 text-secondary px-2 py-1 rounded">
                                🚶 {route.transitDetails.totalWalkingTime}
                              </span>
                            )}
                            {route.transitDetails.numberOfTransfers !== undefined && (
                              <span className="bg-warning/20 text-warning px-2 py-1 rounded">
                                🔄 {route.transitDetails.numberOfTransfers} transfer
                                {route.transitDetails.numberOfTransfers !== 1
                                  ? 's'
                                  : ''}
                              </span>
                            )}
                            {route.transitDetails.transitFare && (
                              <span className="bg-accent/20 text-accent px-2 py-1 rounded">
                                💰 {formatFare(route.transitDetails.transitFare)}
                              </span>
                            )}
                            {route.transitDetails.transitSteps &&
                              route.transitDetails.transitSteps.length > 0 && (
                                <details className="group">
                                  <summary className="bg-info/20 text-info px-2 py-1 rounded cursor-pointer hover:bg-info/30 transition-colors">
                                    📋 Steps (
                                    {route.transitDetails.transitSteps.length})
                                  </summary>
                                  <div className="mt-2 p-2 bg-base-100/50 rounded text-xs space-y-1">
                                    {route.transitDetails.transitSteps.map(
                                      (step, stepIndex) => (
                                        <div
                                          key={stepIndex}
                                          className="flex items-center justify-between"
                                        >
                                          <span>
                                            {step.mode === 'WALKING' ? '🚶' : getTransitEmoji(step.transitLineInfo?.vehicle)} {' '}
                                            {step.mode === 'WALKING'
                                              ? 'Walk'
                                              : step.transitLineInfo?.lineName ||
                                                'Transit'}
                                            {step.transitLineInfo?.vehicle &&
                                              ` (${step.transitLineInfo.vehicle})`}
                                          </span>
                                          <span className="text-base-content/60">
                                            {step.duration}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </details>
                              )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center ml-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-accent to-accent-focus rounded-full flex items-center justify-center text-accent-content font-bold text-sm">
                          {routeIndex + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
