import Link from 'next/link';
import { NextRouter } from 'next/router';
import React from 'react';

interface Props {
  router: NextRouter;
}

const NavBar: React.FC<Props> = ({ router }) => {
  const isActive = (path: string) => router.pathname === path;

  const navItems: { path: string; label: string; enabled: boolean }[] = [];

  return (
    <nav className="relative">
      <ul className="hidden md:flex space-x-4">
        {navItems.map((item) => (
          <li key={item.label}>
            {item.enabled ? (
              <Link
                href={item.path}
                className={`${isActive(item.path) ? 'underline font-bold' : 'hover:text-primary-content/80'}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className="opacity-50 cursor-not-allowed">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { NavBar };
