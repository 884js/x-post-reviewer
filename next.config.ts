import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Cloudflare Workersでのエッジランタイムをサポート
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
}

export default nextConfig;
