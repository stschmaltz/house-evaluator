import Link from 'next/link';
import { UserObject } from '../types/user';
import { Header } from './Header';
import { AddressInput } from './AddressInput';
import { RouteResults } from './RouteResults';

interface RouteResult {
  destination: string;
  duration: string;
  distance: string;
  polyline?: string;
}

interface AuthenticatedHomeProps {
  currentUser: UserObject;
  onAddressSubmit: (addressData: {
    address: string;
    placeId?: string;
    location?: { lat: number; lng: number };
  }) => Promise<void>;
  routes?: RouteResult[];
  originAddress?: string;
  isCalculatingRoutes?: boolean;
}

export function AuthenticatedHome({
  currentUser,
  onAddressSubmit,
  routes = [],
  originAddress = '',
  isCalculatingRoutes = false,
}: AuthenticatedHomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header currentUser={currentUser} />

        <div className="flex flex-col gap-4">
          <AddressInput onSubmit={onAddressSubmit} />
          {(routes.length > 0 || isCalculatingRoutes) && (
            <RouteResults
              routes={routes}
              originAddress={originAddress}
              isLoading={isCalculatingRoutes}
            />
          )}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            href="/api/auth/logout"
            className="btn btn-ghost btn-sm hover:bg-error/10 hover:text-error transition-all duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}
