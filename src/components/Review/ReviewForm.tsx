'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDrafts } from '@/contexts/DraftContext';
import { Button } from '../Common/Button';
import { FiSave, FiPenTool } from 'react-icons/fi';
import { ReviewResult } from '@/types';
import { Result } from './Result';


export function ReviewForm() {
  const [content, setContent] = useState('');
  const [apiResult, setApiResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { addDraft } = useDrafts();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'input' | 'review'>('input');

  useEffect(() => {
    if (isEditMode) {
      const timer = setTimeout(() => {
        setIsEditMode(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isEditMode]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('投稿内容を入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: content }),
      });

      const result = await res.json();
      setContent("");
      setApiResult(JSON.parse(result));
      setMode('review');
    } catch (error) {
      console.error('エラーが発生しました。', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!content.trim()) {
      alert('下書きを保存する内容を入力してください。');
      return;
    }
    addDraft(content);
    setContent('');
    alert('下書きを保存しました。');
  };

  return (
    <>
      {mode === 'review' && (
        <Result
          reviewResult={apiResult}
          onUpdateReviewResult={setApiResult}
          onBack={() => setMode('input')}
        />
      )}
      {mode === 'input' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mt-4 md:mt-8">
          <div className="flex justify-end mb-2">
            <Button
              variant="transparent"
              className="!w-auto"
              onClick={handleSaveDraft}
              size="xs"
            icon={<FiSave />}
          >
            下書き
          </Button>
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="添削したい投稿内容を入力..."
          className={`w-full h-32 md:h-48 border ${
            isEditMode
              ? "border-blue-500 ring-2 ring-blue-300"
              : "border-gray-300 dark:border-gray-700"
          } rounded-md p-2 md:p-3 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-gray-50 dark:bg-gray-700 transition-all duration-300 focus:ring-opacity-50`}
        />
        <div className="flex justify-end mt-2 md:mt-3 gap-2">
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            size="sm"
            icon={<FiPenTool />}
          >
            添削する
            </Button>
          </div>
        </div>
      )}
    </>
  );
}