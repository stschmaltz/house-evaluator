interface LoadingStateProps {
  isLoading: boolean;
  isSigningIn: boolean;
}

export function LoadingState({ isLoading, isSigningIn }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-info/10 via-base-100 to-accent/10 flex items-center justify-center">
      <div className="card bg-gradient-to-br from-info/10 to-accent/10 shadow-xl border border-info/20">
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-info to-info-focus rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="loading loading-spinner loading-lg text-info-content"></span>
          </div>
          <h2 className="text-xl font-semibold text-info">
            {isLoading ? 'Loading...' : 'Signing in...'}
          </h2>
        </div>
      </div>
    </div>
  );
}
