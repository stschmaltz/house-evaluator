interface ErrorStateProps {
  error: Error;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-error/10 via-base-100 to-warning/10 flex items-center justify-center">
      <div className="card bg-gradient-to-br from-error/10 to-warning/10 shadow-2xl border border-error/30">
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-error to-error-focus rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-error-content"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-error mb-2">
            Authentication Error
          </h2>
          <p className="text-error/80">{error.message}</p>
        </div>
      </div>
    </div>
  );
}
