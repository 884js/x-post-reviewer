'use client';

import { usePostHistory } from '@/contexts/PostHistoryContext';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FiTrash2, FiCopy } from 'react-icons/fi';
import { formatTweetCount } from '@/utils/tweetCounter';

export function PostHistoryList() {
  const { history, clearHistory, deleteFromHistory } = usePostHistory();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        履歴はまだありません
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('コピーしました');
  };

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
        const tweetCount = formatTweetCount(item.content);
        const date = new Date(item.postedAt);
        const formattedDate = formatDistanceToNow(date, { addSuffix: true, locale: ja });
        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
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
                  onClick={() => copyToClipboard(item.content)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  title="コピー"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
            <p className="mt-1 text-gray-800 dark:text-gray-200 break-words leading-relaxed tracking-normal font-feature-settings-palt">
              {item.content.length > 100 
                ? `${item.content.substring(0, 100)}...` 
                : item.content}
            </p>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-feature-settings-pnum">
              <span className={tweetCount.isNearLimit ? (tweetCount.isOverLimit ? "text-red-500" : "text-orange-500") : ""}>
                {tweetCount.displayCount}
              </span>
              <span> / 280</span>
            </div>
          </div>
        );
      })}
    </div>
  );
} 