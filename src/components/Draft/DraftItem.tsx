import { Draft } from '@/types';
import { useDrafts } from '@/contexts/DraftContext';

interface DraftItemProps {
  draft: Draft;
}

export function DraftItem({ draft }: DraftItemProps) {
  const { editDraft, deleteDraft } = useDrafts();

  return (
    <div className="draft-item bg-white dark:bg-gray-700 rounded-md shadow-sm p-3 md:p-4 flex justify-between items-start transition-all duration-200">
      <p className="text-gray-800 dark:text-gray-200 break-words">{draft.content}</p>
      <div className="flex space-x-2 md:space-x-3">
        <button
          onClick={() => editDraft(draft.id, draft.content)}
          className="edit-draft text-blue-500 hover:text-blue-700 font-semibold py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 text-sm md:text-base transition-colors duration-200"
        >
          編集
        </button>
        <button
          onClick={() => deleteDraft(draft.id)}
          className="delete-draft text-red-500 hover:text-red-700 font-semibold py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:ring-opacity-50 text-sm md:text-base transition-colors duration-200"
        >
          削除
        </button>
      </div>
    </div>
  );
} 