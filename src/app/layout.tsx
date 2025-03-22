import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { DraftProvider } from '@/contexts/DraftContext';

export const runtime = "edge";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIレビュー投稿アプリ',
  description: 'AIがあなたの投稿をレビューします',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <DraftProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-[600px] mx-auto p-4 md:p-6">
              {children}
            </div>
          </div>
        </DraftProvider>
      </body>
    </html>
  );
} 