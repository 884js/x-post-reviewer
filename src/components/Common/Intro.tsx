'use client';

import { FiInfo, FiCheckCircle, FiEdit, FiList } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function Intro() {
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get('result') === 'true';

  // レビューモードのときはIntroを表示しない
  if (isReviewMode) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-6 mb-4 md:mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
        <div className="hidden md:block bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
          <FiInfo className="text-blue-600 dark:text-blue-300 w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-2 md:hidden">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-2">
              <FiInfo className="text-blue-600 dark:text-blue-300 w-5 h-5" />
            </div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
              あなたのポストをより良く
            </h2>
          </div>

          <h2 className="hidden md:block text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 tracking-tight">
            あなたのポストをより良く
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed">
            投稿内容を分析し、より効果的な表現方法を提案。価値スコア、推奨度、改善ポイントを確認できます。
          </p>

          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900 p-1.5 md:p-2 rounded-full mr-2 md:mr-3 mt-0.5">
                <FiEdit className="text-green-600 dark:text-green-400 w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 mb-0.5 md:mb-1">
                  1. 投稿を入力
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  添削したい文章を入力フォームに記入します。下書きボタンで保存することもできます。
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 p-1.5 md:p-2 rounded-full mr-2 md:mr-3 mt-0.5">
                <FiCheckCircle className="text-purple-600 dark:text-purple-400 w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 mb-0.5 md:mb-1">
                  2. AIが分析
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  投稿の価値、推奨度、投稿タイプを分析し、改善案を提案します。
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-orange-100 dark:bg-orange-900 p-1.5 md:p-2 rounded-full mr-2 md:mr-3 mt-0.5">
                <FiList className="text-orange-600 dark:text-orange-400 w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 mb-0.5 md:mb-1">
                  3. 改善案を選択
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  AIの提案から良いと思ったものを選び、そのまま投稿することができます。履歴も自動保存されます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 