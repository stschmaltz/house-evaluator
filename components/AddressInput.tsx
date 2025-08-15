import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';

interface AddressInputProps {
  onSubmit: (addressData: {
    address: string;
    placeId?: string;
    location?: { lat: number; lng: number };
  }) => Promise<void>;
}

export function AddressInput({ onSubmit }: AddressInputProps) {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    placeId?: string;
    location?: { lat: number; lng: number };
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current =
      new window.google.maps.places.Autocomplete(
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
  }, []);

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
      </div>
    </div>
  );
}
