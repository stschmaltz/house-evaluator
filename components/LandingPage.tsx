import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/15 via-accent/5 to-secondary/15 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        {/* Logo/Icon Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/25">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2">
            House Evaluator
          </h1>
          <p className="text-lg text-base-content/70">Find your perfect home</p>
        </div>

        {/* Main Card */}
        <div className="card bg-gradient-to-br from-base-100/90 via-primary/5 to-accent/5 backdrop-blur-lg shadow-2xl border border-primary/20">
          <div className="card-body p-8 text-center">
            <h2 className="text-2xl font-bold text-base-content mb-4">
              Welcome to Your Home Search
            </h2>
            <p className="text-base-content/70 mb-8 leading-relaxed">
              Automate commute and amenity checks for potential properties to
              speed up your home-buying process.
            </p>

            <Link
              href="/api/auth/login"
              className="btn bg-gradient-to-r from-primary via-accent to-secondary hover:from-secondary hover:to-primary border-0 text-white btn-lg w-full text-lg shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Get Started
            </Link>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-base-content/50 text-sm mt-6">
          Secure authentication powered by Auth0
        </p>
      </div>
    </div>
  );
}
