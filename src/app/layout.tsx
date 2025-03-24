import type { Metadata } from 'next';
import '@/styles/globals.css';
import { DraftProvider } from '@/contexts/DraftContext';
import { PostHistoryProvider } from '@/contexts/PostHistoryContext';
import { Noto_Sans_JP } from 'next/font/google';

export const runtime = "edge";

// Noto Sans JPフォントの設定
const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: 'XCalibur - AIによる投稿添削',
  description: 'AIがあなたのX（旧Twitter）投稿を分析して改善・添削します',
  icons: {
    icon: '/favicon.svg',
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
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
      </body>
    </html>
  );
}