import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const withPwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {};

export default withPwa(nextConfig);
