import Link from 'next/link';
import { useRouter } from 'next/router';

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
);

const MapIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
);

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/address-evaluator', label: 'Evaluator', icon: MapIcon },
];

export function BottomNav() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-base-100 border-t border-base-200 md:hidden">
      <ul className="flex justify-around items-center h-20 pb-6 pt-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-1 text-xs ${active ? 'text-primary font-bold' : 'text-base-content'}`}
                aria-label={label}
              >
                <Icon
                  className={`w-6 h-6 ${active ? 'text-primary' : 'text-base-content'}`}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
