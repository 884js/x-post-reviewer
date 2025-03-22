import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

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

export default nextConfig;

if (process.env.NODE_ENV === 'development') {
	await setupDevPlatform();
}