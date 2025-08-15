interface TravelModeSelectorProps {
  departureTime?: string;
  onDepartureTimeChange?: (time: string) => void;
}

export function TravelModeSelector({
  departureTime,
  onDepartureTimeChange,
}: TravelModeSelectorProps) {
  // Generate current time as default
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const displayTime = departureTime || currentTime;

  return (
    <div className="card bg-base-100 shadow-xl border border-primary/20">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-focus rounded-lg flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-accent-content"
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
          <h2 className="text-lg font-bold text-base-content">Route Options</h2>
        </div>

        <div className="p-3 bg-info/10 rounded-lg border border-info/20 mb-4">
          <div className="flex items-center gap-2 text-info text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              We&apos;ll show routes for driving 🚗, transit 🚌, walking 🚶, and
              biking 🚴 all at once!
            </span>
          </div>
        </div>

        {onDepartureTimeChange && (
          <div className="p-3 bg-base-200/50 rounded-lg border border-base-300/50">
            <div className="flex items-center gap-3">
              <svg
                className="w-4 h-4 text-base-content/70"
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
              <label className="text-sm font-medium text-base-content/80">
                Departure Time:
              </label>
              <input
                type="time"
                value={displayTime}
                onChange={(e) => onDepartureTimeChange(e.target.value)}
                className="input input-sm input-bordered bg-base-100"
              />
              <button
                onClick={() => onDepartureTimeChange(currentTime)}
                className="btn btn-xs btn-ghost"
              >
                Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
