import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NavBar } from './ui/NavBar';

import { BottomNav } from './ui/BottomNav';
import AccountMenu from './AccountMenu';
import { useUserSignIn } from '../src/hooks/use-user-sign-in.hook';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [isLoading, currentUser] = useUserSignIn();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Head>
        <title>Example App</title>
        <meta
          name="description"
          content="Example Next.js application with authentication and theming."
          key="desc"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta property="og:type" content="website" key="ogtype" />
        <meta property="og:title" content="Example App" key="ogtitle" />
        <meta
          property="og:description"
          content="Example Next.js application with authentication and theming."
          key="ogdesc"
        />
        <meta property="og:image" content="/og-image.png" key="ogimage" />
        <meta property="og:site_name" content="Example App" key="ogsitename" />

        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta name="twitter:title" content="Example App" key="twtitle" />
        <meta
          name="twitter:description"
          content="Example Next.js application with authentication and theming."
          key="twdesc"
        />
        <meta name="twitter:image" content="/twitter-image.png" key="twimage" />
      </Head>
      <header className="sticky top-0 z-30 bg-primary text-white p-2">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="ml-2 text-xl md:text-2xl font-bold">Example App</h1>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <NavBar router={router} />
            <AccountMenu
              currentUser={currentUser}
              accountMenuRef={accountMenuRef}
              isAccountMenuOpen={isAccountMenuOpen}
              toggleAccountMenu={toggleAccountMenu}
              setIsAccountMenuOpen={setIsAccountMenuOpen}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {isHomePage ? (
          <div className="container mx-auto px-4 py-8 ">{children}</div>
        ) : (
          <div className="container mx-auto px-4 py-6 md:py-8 flex-grow max-w-4xl min-h-[80vh]">
            {children}
          </div>
        )}
      </main>

      <BottomNav />

      <footer className="p-4 pb-10 md:pb-4 bg-neutral text-neutral-content mb-16 md:mb-0">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Example App. All rights reserved.
          </div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/privacy" className="link link-hover">
              Privacy
            </Link>
            <Link href="/terms" className="link link-hover">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { Layout };
