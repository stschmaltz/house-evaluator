import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { Layout } from './layout';

const PUBLIC_PATHS = [
  '/',
  '/api/auth/login',
  '/api/auth/callback',
  '/api/auth/logout',
  '/404',
  '/_offline',
  '/_error',
];

interface ProtectedLayoutProps {
  children: ReactNode;
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const isPublicPath =
    PUBLIC_PATHS.includes(router.pathname) ||
    router.pathname.startsWith('/api/') ||
    router.pathname === '/404' ||
    router.pathname === '/_offline';

  useEffect(() => {
    if (!isLoading && !user && !isPublicPath) {
      router.replace(
        `/api/auth/login?returnTo=${encodeURIComponent(router.asPath)}`,
      );
    }
  }, [isLoading, user, router, isPublicPath]);

  if (!isPublicPath && (isLoading || (!user && !isLoading))) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </Layout>
    );
  }

  return <Layout>{children}</Layout>;
};
