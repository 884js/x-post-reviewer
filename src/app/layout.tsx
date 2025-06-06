import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { DraftProvider } from '@/contexts/DraftContext';
import { PostHistoryProvider } from '@/contexts/PostHistoryContext';
import { Noto_Sans_JP } from 'next/font/google';
import { Inter } from 'next/font/google';
import PWAInstallPrompt from '@/components/Common/PWAInstallPrompt';

export const runtime = "edge";

// Noto Sans JPフォントの設定
const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1d4ed8",
};

export const metadata: Metadata = {
  title: 'Post Polish - AIによる投稿添削',
  description: 'AIがあなたのX（旧Twitter）投稿を分析して改善・添削します',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Post Polish',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans">
        <DraftProvider>
          <PostHistoryProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-3 md:py-6">
              {children}
            </div>
          </PostHistoryProvider>
        </DraftProvider>
        <PWAInstallPrompt />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "f986c94b0cab4f97a3384768501eb089"}'
        ></script>
      </body>
    </html>
  );
}