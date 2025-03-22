import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

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
  // Google Gemini APIの接続を許可するための設定
  async headers() {
    return [
      {
        // API経由でGoogleへのリクエストを許可
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
}

export default nextConfig;

if (process.env.NODE_ENV === 'development') {
	await setupDevPlatform();
}