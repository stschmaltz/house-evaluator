import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import SEO from '../next-seo.config';

import { CurrentUserProvider } from '../src/context/UserContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ProtectedLayout } from '../components/ProtectedLayout';
import '../src/app/globals.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const defaultLayout = (page: ReactElement) => (
    <UserProvider user={pageProps.user}>
      <ThemeProvider>
        <CurrentUserProvider>
          <ProtectedLayout>{page}</ProtectedLayout>
        </CurrentUserProvider>
      </ThemeProvider>
    </UserProvider>
  );

  const getLayout = Component.getLayout ?? defaultLayout;

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <title>Example App</title>
        <meta
          name="description"
          content="Example Next.js application with authentication and theming"
        />
      </Head>
      <DefaultSeo {...SEO} />
      {getLayout(<Component {...pageProps} />)}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
