'use client';

import { useState } from 'react';
import { usePostHistory } from '@/contexts/PostHistoryContext';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FiChevronDown, FiChevronUp, FiTrash2, FiCopy } from 'react-icons/fi';
import { formatTweetCount } from '@/utils/tweetCounter';

export function PostHistoryList() {
  const { history, clearHistory } = usePostHistory();
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) {
    return null;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('コピーしました');
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={toggleExpand}
      >
        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
          {isExpanded ? <FiChevronUp className="mr-2" /> : <FiChevronDown className="mr-2" />}
          添削履歴 ({history.length})
        </h3>
        {history.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('履歴をすべて削除しますか？')) {
                clearHistory();
              }
            }}
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
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
                  <button
                    onClick={() => copyToClipboard(item.content)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <FiCopy size={16} />
                  </button>
                </div>
                <p className="mt-1 text-gray-800 dark:text-gray-200 break-words">
                  {item.content.length > 100 
                    ? `${item.content.substring(0, 100)}...` 
                    : item.content}
                </p>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className={tweetCount.isNearLimit ? (tweetCount.isOverLimit ? "text-red-500" : "text-orange-500") : ""}>
                    {tweetCount.displayCount}
                  </span>
                  <span> / 280</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 