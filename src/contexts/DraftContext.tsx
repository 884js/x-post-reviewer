'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Draft } from '@/types';

interface DraftContextType {
  drafts: Draft[];
  addDraft: (content: string) => void;
  editDraft: (id: string, content: string) => void;
  deleteDraft: (id: string) => void;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    const savedDrafts = localStorage.getItem('tweetDrafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tweetDrafts', JSON.stringify(drafts));
  }, [drafts]);

  const addDraft = (content: string) => {
    const newDraft: Draft = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
    };
    setDrafts(prev => [...prev, newDraft]);
  };

  const editDraft = (id: string, content: string) => {
    setDrafts(prev =>
      prev.map(draft =>
        draft.id === id ? { ...draft, content } : draft
      )
    );
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== id));
  };

  return (
    <DraftContext.Provider value={{ drafts, addDraft, editDraft, deleteDraft }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDrafts() {
  const context = useContext(DraftContext);
  if (context === undefined) {
    throw new Error('useDrafts must be used within a DraftProvider');
  }
  return context;
} 