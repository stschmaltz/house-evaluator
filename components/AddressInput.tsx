import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { useGoogleMaps } from '../context/GoogleMapsContext';

interface RecentSearch {
  address: string;
  placeId?: string;
  location?: { lat: number; lng: number };
  timestamp: number;
}

interface AddressInputProps {
  onSubmit: (addressData: {
    address: string;
    placeId?: string;
    location?: { lat: number; lng: number };
  }) => Promise<void>;
  recentSearches?: RecentSearch[];
}

export function AddressInput({
  onSubmit,
  recentSearches = [],
}: AddressInputProps) {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    placeId?: string;
    location?: { lat: number; lng: number };
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (!inputRef.current || !isLoaded || !window.google?.maps?.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'ca' },
        fields: ['place_id', 'formatted_address', 'geometry.location'],
      },
    ) as unknown as google.maps.places.Autocomplete;

    const handlePlaceSelect = () => {
      const place = autocompleteRef.current?.getPlace();
      if (place && place.formatted_address) {
        setAddress(place.formatted_address);
        setSelectedPlace({
          placeId: place.place_id,
          location: place.geometry?.location
            ? {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }
            : undefined,
        });
      }
    };

    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current,
        );
      }
    };
  }, [isLoaded]);

  const handleSubmit = async () => {
    if (!address.trim()) return;

    setIsSearching(true);
    try {
      await onSubmit({
        address,
        placeId: selectedPlace?.placeId,
        location: selectedPlace?.location,
      });
      setAddress('');
      setSelectedPlace(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecentSearchClick = async (recentSearch: RecentSearch) => {
    setAddress(recentSearch.address);
    setSelectedPlace({
      placeId: recentSearch.placeId,
      location: recentSearch.location,
    });

    setIsSearching(true);
    try {
      await onSubmit({
        address: recentSearch.address,
        placeId: recentSearch.placeId,
        location: recentSearch.location,
      });
      setAddress('');
      setSelectedPlace(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="card from-primary/10 via-accent/5 to-secondary/10 shadow-2xl border border-primary/20">
      <div className="card-body p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-focus rounded-lg flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-primary-content"
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
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Evaluate New Address
          </h2>
        </div>

        <form className="form">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base">
                Enter Address
              </span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Start typing an address..."
                className="input input-bordered w-full text-lg h-14 pl-12 bg-gradient-to-r from-base-100/80 to-primary/5  border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSearching}
              />
              <svg
                className="w-5 h-5 text-base-content/40 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <Button
            label={isSearching ? 'Evaluating...' : 'Evaluate Address'}
            variant="primary"
            disabled={isSearching || !address.trim()}
            loading={isSearching}
            onClick={handleSubmit}
          />
        </form>

        {recentSearches.length > 0 && (
          <div className="mt-6 pt-6 border-t border-base-300">
            <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recent Searches
            </h3>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {recentSearches.map((search, index) => (
                <button
                  key={`${search.address}-${search.timestamp}`}
                  onClick={() => handleRecentSearchClick(search)}
                  disabled={isSearching}
                  className="text-left p-3 rounded-lg border border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base-content group-hover:text-primary text-sm font-medium truncate pr-2">
                      {search.address}
                    </span>
                    <svg
                      className="w-4 h-4 text-base-content/40 group-hover:text-primary shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
