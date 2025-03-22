"use client";

import { useDrafts } from '@/contexts/DraftContext';
import { DraftItem } from './DraftItem';

export function DraftList() {
  const { drafts } = useDrafts();
  const MAX_DRAFTS = 5;
  const recentDrafts = drafts.slice(-MAX_DRAFTS).reverse();

  return (
    <div className="space-y-4 mb-8">
      <div className="space-y-3">
        {recentDrafts.map((draft) => (
          <DraftItem key={draft.id} draft={draft} />
        ))}
      </div>
    </div>
  );
} 