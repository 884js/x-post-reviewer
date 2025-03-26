import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import withPWA from 'next-pwa';

const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig);

export default config;

if (process.env.NODE_ENV === 'development') {
	await setupDevPlatform();
}