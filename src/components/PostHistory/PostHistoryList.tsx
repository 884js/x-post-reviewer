'use client';

import { usePostHistory } from '@/contexts/PostHistoryContext';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FiTrash2, FiCopy, FiChevronDown, FiChevronUp, FiSend } from 'react-icons/fi';
import { formatTweetCount } from '@/utils/tweetCounter';
import { useState } from 'react';
import { POST_RECOMMENDATION } from '@/constants/postNuance';
import { POST_RECOMMENDATION_LABEL } from '@/constants';

export function PostHistoryList() {
  const { history, clearHistory, deleteFromHistory } = usePostHistory();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string>('');

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 2000);
    } catch (err) {
      alert('コピーに失敗しました');
    }
  };

  const handlePost = async (text: string) => {
    // ツイートURLを新しいタブで開く
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, '_blank');
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        履歴はまだありません
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (confirm('この履歴を削除しますか？')) {
      deleteFromHistory(id);
    }
  };

  return (
    <div className="space-y-3">
      {history.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => {
              if (confirm('履歴をすべて削除しますか？')) {
                clearHistory();
              }
            }}
            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
          >
            <FiTrash2 className="mr-1" />
            履歴を全削除
          </button>
        </div>
      )}

      {history.map((item) => {
        if (!item.reviewResult) return;

        const tweetCount = formatTweetCount(item.content);
        const date = new Date(item.postedAt);
        const formattedDate = formatDistanceToNow(date, { addSuffix: true, locale: ja });
        const isExpanded = expandedItems.includes(item.id);

        console.log(item.reviewResult.post_recommendation);

        return (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formattedDate}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  title="削除"
                >
                  <FiTrash2 size={16} />
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(item.content, `original-${item.id}`)
                  }
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 relative"
                  title="コピー"
                >
                  <FiCopy size={16} />
                  {copiedId === `original-${item.id}` && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded w-[120px]">
                      コピーしました
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handlePost(item.content)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  title="投稿する"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-gray-800 dark:text-gray-200 break-words leading-relaxed tracking-normal font-feature-settings-palt">
                {item.content}
              </p>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-feature-settings-pnum">
                <span
                  className={
                    tweetCount.isNearLimit
                      ? tweetCount.isOverLimit
                        ? "text-red-500"
                        : "text-orange-500"
                      : ""
                  }
                >
                  {tweetCount.displayCount}
                </span>
                <span> / 280</span>
              </div>
            </div>

            {item.reviewResult && (
              <>
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {isExpanded ? (
                    <FiChevronUp className="mr-1" />
                  ) : (
                    <FiChevronDown className="mr-1" />
                  )}
                  添削結果を{isExpanded ? "閉じる" : "表示"}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        推奨度
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {
                          POST_RECOMMENDATION_LABEL[
                            item.reviewResult.post_recommendation
                          ]
                        }
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        理由
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {item.reviewResult.reason}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        改善案
                      </h4>
                      <div className="mt-2 space-y-3">
                        {item.reviewResult.improvement_suggestions.map(
                          (suggestion, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                            >
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                {suggestion.text}
                              </p>
                              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                {suggestion.improvements}
                              </p>
                              <div className="mt-2 flex justify-end space-x-2">
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      suggestion.text,
                                      `suggestion-${item.id}-${index}`
                                    )
                                  }
                                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 relative"
                                  title="コピー"
                                >
                                  <FiCopy size={14} />
                                  {copiedId ===
                                    `suggestion-${item.id}-${index}` && (
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded w-[120px]">
                                      コピーしました
                                    </span>
                                  )}
                                </button>
                                <button
                                  onClick={() => handlePost(suggestion.text)}
                                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
                                  title="投稿する"
                                >
                                  <FiSend size={14} />
                                  <span className="text-xs">投稿する</span>
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
} 