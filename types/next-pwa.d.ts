declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface PWAOptions {
    [key: string]: unknown;
  }

  export default function withPWA(
    options?: PWAOptions,
  ): (nextConfig: NextConfig) => NextConfig;
}

