import type { Metadata } from 'next';
import '@/styles/globals.css';
import { DraftProvider } from '@/contexts/DraftContext';
import { PostHistoryProvider } from '@/contexts/PostHistoryContext';

export const runtime = "edge";

export const metadata: Metadata = {
  title: 'Xのポスト添削',
  description: 'AIがあなたの投稿を添削します',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <DraftProvider>
          <PostHistoryProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <div className="max-w-[600px] mx-auto p-4 md:p-6">
                {children}
              </div>
            </div>
          </PostHistoryProvider>
        </DraftProvider>
      </body>
    </html>
  );
}