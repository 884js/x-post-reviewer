'use client';

import { useDrafts } from '@/contexts/DraftContext';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FiTrash2, FiEdit2, FiCopy } from 'react-icons/fi';
import { formatTweetCount } from '@/utils/tweetCounter';

type DraftsListProps = {
  onEditDraft: (content: string, draftId: string) => void;
};

export function DraftsList({ onEditDraft }: DraftsListProps) {
  const { drafts, deleteDraft } = useDrafts();

  if (drafts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        下書きはまだありません
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('コピーしました');
  };

  return (
    <div className="space-y-3">
      {drafts.map((draft) => {
        const tweetCount = formatTweetCount(draft.content);
        const date = new Date(draft.createdAt);
        const formattedDate = formatDistanceToNow(date, { addSuffix: true, locale: ja });
        
        return (
          <div key={draft.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formattedDate}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditDraft(draft.content, draft.id)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  title="編集"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => copyToClipboard(draft.content)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  title="コピー"
                >
                  <FiCopy size={16} />
                </button>
                <button
                  onClick={() => deleteDraft(draft.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="削除"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-1 text-gray-800 dark:text-gray-200 break-words leading-relaxed tracking-normal font-feature-settings-palt">
              {draft.content.length > 100 
                ? `${draft.content.substring(0, 100)}...` 
                : draft.content}
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