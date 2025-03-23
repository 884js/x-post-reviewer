'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDrafts } from '@/contexts/DraftContext';
import { Button } from '../Common/Button';
import { POST_NUANCE } from "@/constants/postNuance";
import { FiEdit2, FiSend, FiSave, FiPenTool, FiCheck, FiX } from 'react-icons/fi';

// インラインエディタコンポーネント
function InlineEditor({ 
  initialText, 
  onSave, 
  onCancel 
}: { 
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  return (
    <div className="w-full">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border border-blue-400 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
        rows={3}
      />
      <div className="flex justify-end mt-2 gap-2">
        <Button
          variant="secondary"
          onClick={onCancel}
          size="xs"
          icon={<FiX />}
        >
          キャンセル
        </Button>
        <Button
          variant="primary"
          onClick={() => onSave(text)}
          size="xs"
          icon={<FiCheck />}
        >
          保存
        </Button>
      </div>
    </div>
  );
}

const POST_NUANCE_LABEL = {
  [POST_NUANCE.TALK_TO_ONESELF]: "独り言",
  [POST_NUANCE.QUESTION]: "問いかけ",
  [POST_NUANCE.OPINION]: "意見表明",
  [POST_NUANCE.INFORMATION]: "情報共有",
} as const;

export function ReviewForm() {
  const [content, setContent] = useState('');
  const [apiResult, setApiResult] = useState<{
    original_text: string;
    should_post: boolean;
    reason: string;
    usefulness_score: number;
    improvement_suggestions: string[];
    tweet_nuance: typeof POST_NUANCE[keyof typeof POST_NUANCE];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSuggestionIndex, setEditingSuggestionIndex] = useState<number | null>(null);
  const [editedSuggestion, setEditedSuggestion] = useState('');
  const [isEditingOriginal, setIsEditingOriginal] = useState(false);
  const [editedOriginal, setEditedOriginal] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { addDraft } = useDrafts();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editingTextareaRef = useRef<HTMLTextAreaElement>(null);
  const originalTextareaRef = useRef<HTMLTextAreaElement>(null);

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
    } catch (error) {
      console.error('エラーが発生しました。', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditingSuggestion = (suggestion: string, index: number) => {
    setEditingSuggestionIndex(index);
    setEditedSuggestion(suggestion);
    setTimeout(() => {
      if (editingTextareaRef.current) {
        editingTextareaRef.current.focus();
      }
    }, 100);
  };

  const saveSuggestionEdit = useCallback((text: string) => {
    if (apiResult && editingSuggestionIndex !== null) {
      const updatedSuggestions = [...apiResult.improvement_suggestions];
      updatedSuggestions[editingSuggestionIndex] = text;
      setApiResult({
        ...apiResult,
        improvement_suggestions: updatedSuggestions
      });
      
      setEditingSuggestionIndex(null);
    }
  }, [apiResult, editingSuggestionIndex]);

  const handleSaveDraft = () => {
    if (!content.trim()) {
      alert('下書きを保存する内容を入力してください。');
      return;
    }
    addDraft(content);
    setContent('');
    alert('下書きを保存しました。');
  };

  const startEditingOriginal = () => {
    if (apiResult) {
      setIsEditingOriginal(true);
      setEditedOriginal(apiResult.original_text);
      
      setTimeout(() => {
        if (originalTextareaRef.current) {
          originalTextareaRef.current.focus();
        }
      }, 100);
    }
  };

  const saveOriginalEdit = useCallback((text: string) => {
    if (apiResult) {
      setApiResult({
        ...apiResult,
        original_text: text
      });
      
      setIsEditingOriginal(false);
    }
  }, [apiResult]);

  const Result = () => {
    if (!apiResult) return null;

    return (
      <div className="mb-6 p-4 bg-white rounded-lg border border-[#e1e8ed] shadow-sm">
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <div
              className={`w-4 h-4 rounded-full mr-2 ${
                apiResult.should_post ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <h3 className="font-bold text-[#14171a]">
              投稿すべきかどうか:
              <span
                className={`ml-2 ${
                  apiResult.should_post ? "text-green-600" : "text-red-600"
                }`}
              >
                {apiResult.should_post ? "はい" : "いいえ"}
              </span>
            </h3>
          </div>

          <div className="mb-3">
            <h3 className="font-bold text-[#14171a] mb-1">投稿価値:</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= apiResult.usefulness_score
                      ? "text-[#ffd700]"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-[#1da1f2] font-semibold">
                {apiResult.usefulness_score}/5
              </span>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="font-bold text-[#14171a] mb-1">ニュアンス:</h3>
            {apiResult.tweet_nuance && (
              <p className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2]">
                {POST_NUANCE_LABEL[apiResult.tweet_nuance]}
              </p>
            )}
          </div>

          <div className="mb-3">
            <h3 className="font-bold text-[#14171a] mb-1">理由:</h3>
            {apiResult.reason && (
              <p className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2]">
                {apiResult.reason}
              </p>
            )}
          </div>

          <div className="mb-3">
            <h3 className="font-bold text-[#14171a] mb-1">元の文章:</h3>
            {isEditingOriginal ? (
              <InlineEditor
                initialText={apiResult.original_text}
                onSave={saveOriginalEdit}
                onCancel={() => setIsEditingOriginal(false)}
              />
            ) : (
              <>
                <p className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2]">
                  {apiResult.original_text}
                </p>
                <div className="flex justify-end mt-2 md:mt-3 gap-2">
                  <Button
                    variant="secondary"
                    onClick={startEditingOriginal}
                    size="xs"
                    icon={<FiEdit2 />}
                  >
                    編集
                  </Button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${apiResult.original_text}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="primary"
                      size="xs"
                      icon={<FiSend />}
                      isLoading={isPosting}
                    >
                      ポストする
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>

          <div>
            <h3 className="font-bold text-[#14171a] mb-2">改善案:</h3>
            <ul className="space-y-2">
              {apiResult.improvement_suggestions.map((suggestion, index) => (
                <div key={index}>
                  <li className="bg-[#e0f7fa] p-3 rounded-lg flex items-start">
                    <span className="text-[#1da1f2] font-bold mr-2">
                      {index + 1}.
                    </span>
                    {editingSuggestionIndex === index ? (
                      <InlineEditor
                        initialText={suggestion}
                        onSave={(text) => saveSuggestionEdit(text)}
                        onCancel={() => setEditingSuggestionIndex(null)}
                      />
                    ) : (
                      <span>{suggestion}</span>
                    )}
                  </li>
                  {editingSuggestionIndex !== index && (
                    <div className="flex justify-end mt-2 md:mt-3 gap-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          startEditingSuggestion(suggestion, index)
                        }
                        size="xs"
                        icon={<FiEdit2 />}
                      >
                        編集
                      </Button>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${suggestion}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="primary"
                          size="xs"
                          icon={<FiSend />}
                          isLoading={isPosting}
                        >
                          ポストする
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Result />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mt-4 md:mt-8">
        <div className="flex justify-end mb-2">
          <Button
            variant="transparent"
            onClick={handleSaveDraft}
            size="xs"
            icon={<FiSave />}
          >
            下書き保存
          </Button>
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿内容を入力..."
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
    </>
  );
}