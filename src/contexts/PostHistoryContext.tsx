'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PostHistory, ReviewResult } from '@/types';

interface PostHistoryContextType {
  history: PostHistory[];
  addToHistory: (content: string, reviewResult: ReviewResult) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const PostHistoryContext = createContext<PostHistoryContextType | undefined>(undefined);

export function PostHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<PostHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('postHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('postHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (content: string, reviewResult: ReviewResult) => {
    // 同じ内容の投稿が既に履歴にある場合は追加しない
    if (history.some(item => item.content === content)) {
      return;
    }
    
    const newHistoryItem: PostHistory = {
      id: Date.now().toString(),
      content,
      postedAt: new Date().toISOString(),
      reviewResult,
    };
    
    // 最新の投稿を上に表示する（先頭に追加）
    setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // 最大20件保存に変更
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <PostHistoryContext.Provider value={{ history, addToHistory, deleteFromHistory, clearHistory }}>
      {children}
    </PostHistoryContext.Provider>
  );
}

export function usePostHistory() {
  const context = useContext(PostHistoryContext);
  if (context === undefined) {
    throw new Error('usePostHistory must be used within a PostHistoryProvider');
  }
  return context;
} 