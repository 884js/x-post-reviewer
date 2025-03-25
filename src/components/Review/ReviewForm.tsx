'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDrafts } from '@/contexts/DraftContext';
import { usePostHistory } from '@/contexts/PostHistoryContext';
import { Button } from '../Common/Button';
import { FiSave, FiPenTool, FiClipboard, FiEdit, FiClock } from 'react-icons/fi';
import { ReviewResult } from '@/types';
import { Result } from './Result';
import { formatTweetCount } from '@/utils/tweetCounter';
import { PostHistoryList } from '../PostHistory/PostHistoryList';
import { DraftsList } from '../Drafts/DraftsList';
import { useSearchParams, useRouter } from 'next/navigation';
import { $path } from 'next-typesafe-path';

export function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [apiResult, setApiResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditingDraftId, setCurrentEditingDraftId] = useState<string | null>(null);
  const { addDraft, deleteDraft } = useDrafts();
  const { addToHistory } = usePostHistory();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // URLのクエリパラメータからモードを取得
  const isReviewMode = searchParams.get('result') === 'true';
  const [mode, setMode] = useState<'input' | 'review'>(isReviewMode ? 'review' : 'input');
  const [activeTab, setActiveTab] = useState<'input' | 'drafts' | 'history'>('input');

  // twitter-textを使って文字数をカウント
  const tweetCount = formatTweetCount(content);

  // モードが変わったときにURLを更新
  useEffect(() => {
    if (mode === 'review') {
      router.push($path('/', { result: 'true' }));
    } else {
      router.push($path('/'));
    }
  }, [mode, router]);

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
    // 元の入力内容を保存
    setOriginalContent(content);
    try {
      const res = await fetch("/api/generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: content }),
      });

      const result = await res.json();
      
      // 添削した内容を履歴に追加
      addToHistory(content);
      
      // 編集中の下書きがある場合は削除
      if (currentEditingDraftId) {
        deleteDraft(currentEditingDraftId);
        setCurrentEditingDraftId(null);
      }
      
      setContent("");
      if (result.error) {
        throw new Error(result.error);
      }

      setApiResult(result);
      
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
    setCurrentEditingDraftId(null);
    alert('下書きを保存しました。');
  };

  const handleEditDraft = (draftContent: string, draftId: string) => {
    setContent(draftContent);
    setCurrentEditingDraftId(draftId);
    setActiveTab('input');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const renderTabButton = (tabName: 'input' | 'drafts' | 'history', icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
        activeTab === tabName
          ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {icon}
      <span className="ml-1">{label}</span>
    </button>
  );

  return (
    <>
      {mode === 'review' && (
        <Result
          reviewResult={apiResult}
          onUpdateReviewResult={setApiResult}
          onBack={() => setMode('input')}
          originalContent={originalContent}
        />
      )}
      {mode === 'input' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {renderTabButton('input', <FiEdit className="w-4 h-4" />, '入力')}
            {renderTabButton('drafts', <FiClipboard className="w-4 h-4" />, '下書き')}
            {renderTabButton('history', <FiClock className="w-4 h-4" />, '履歴')}
          </div>
          
          <div className="p-4 md:p-6">
            {activeTab === 'input' && (
              <>
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
                  } rounded-md p-2 md:p-3 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-gray-50 dark:bg-gray-700 transition-all duration-300 focus:ring-opacity-50 leading-relaxed tracking-normal font-feature-settings-palt`}
                />
                <div className="flex justify-end">
                  <div className="text-sm text-gray-500">
                    <span className={tweetCount.isNearLimit ? (tweetCount.isOverLimit ? "text-red-500 font-bold" : "text-orange-500 font-bold") : ""}>
                      {tweetCount.displayCount}
                    </span>
                    <span> / 280</span>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    size="sm"
                    icon={<FiPenTool />}
                    disabled={tweetCount.isOverLimit}
                  >
                    添削する
                  </Button>
                </div>
              </>
            )}
            
            {activeTab === 'drafts' && (
              <div className="py-2">
                <DraftsList onEditDraft={handleEditDraft} />
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="py-2">
                <PostHistoryList />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}