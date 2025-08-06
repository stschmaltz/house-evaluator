import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useUserSignIn } from '../src/hooks/use-user-sign-in.hook';

export default function Home() {
  const { user, isLoading, error } = useUser();
  const [isSigningIn, currentUser, setCurrentUser] = useUserSignIn();

  if (isLoading || isSigningIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">
          {isLoading ? 'Loading...' : 'Signing in...'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Welcome to Example Template
          </h1>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {user.picture && (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-gray-600">{user.email}</p>
                {currentUser && (
                  <p className="text-sm text-green-600">
                    ✓ Saved to database (ID: {currentUser._id.slice(-6)})
                  </p>
                )}
              </div>
            </div>
            <div className="pt-4 border-t">
              <Link
                href="/api/auth/logout"
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors block text-center"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Example Template
        </h1>
        <p className="text-gray-600 mb-8">
          A Next.js template with GraphQL, Auth0 authentication, and MongoDB
          integration
        </p>
        <Link
          href="/api/auth/login"
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold block"
        >
          Login with Auth0
        </Link>
      </div>
    </div>
  );
}
