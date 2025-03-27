'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

// 「後で」を押してから再表示するまでの時間（ミリ秒）
const DISMISS_COOLDOWN = 24 * 60 * 60 * 1000; // 24時間

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPromptAvailable, setIsPromptAvailable] = useState(false);

  useEffect(() => {
    // ブラウザ環境でない場合は早期リターン
    if (typeof window === 'undefined') return;

    // インストール状態をLocalStorageから復元
    const storedInstallState = localStorage.getItem('pwa_installed');
    if (storedInstallState === 'true') {
      setIsInstalled(true);
      return;
    }

    // 「後で」を押した時刻を確認
    const lastDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed, 10);
      const timeElapsed = Date.now() - dismissedTime;
      
      // クールダウン期間内なら表示しない
      if (timeElapsed < DISMISS_COOLDOWN) {
        setIsDismissed(true);
        return;
      }
    }

    // PWAがすでにインストールされているか確認
    const checkInstalled = () => {
      // スタンドアロンモード、フルスクリーンモード、または最小UIモードで実行されている場合
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                                window.matchMedia('(display-mode: fullscreen)').matches || 
                                window.matchMedia('(display-mode: minimal-ui)').matches || 
                                (window.navigator as any).standalone === true;

      if (isInStandaloneMode) {
        setIsInstalled(true);
        localStorage.setItem('pwa_installed', 'true');
        return true;
      }
      return false;
    };

    // 初期チェック
    if (checkInstalled()) return;

    // インストールプロンプトイベントをリッスン
    const handleBeforeInstallPrompt = (e: Event) => {
      // すでにインストール済みであればイベントを無視
      if (checkInstalled()) return;
      
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsPromptAvailable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('pwa_installed', 'true');
      setDeferredPrompt(null);
      setIsPromptAvailable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      localStorage.setItem('pwa_installed', 'true');
    }
    setDeferredPrompt(null);
    setIsPromptAvailable(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // 現在時刻を保存して、クールダウン期間中は表示しないようにする
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    setDeferredPrompt(null);
    setIsPromptAvailable(false);
  };

  // 表示条件：インストールされておらず、非表示状態でなく、プロンプトが利用可能
  if (isInstalled || isDismissed || !isPromptAvailable || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-fade-in z-50">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            アプリをインストール
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Post Polishをホーム画面に追加して、より快適に利用できます。
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={handleDismiss}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          後で
        </button>
        <button
          onClick={handleInstall}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          インストール
        </button>
      </div>
    </div>
  );
} 