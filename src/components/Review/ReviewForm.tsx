'use client';

import { useState } from 'react';
import { useDrafts } from '@/contexts/DraftContext';
import { Button } from '../Common/Button';
import { POST_NUANCE } from "@/constants/postNuance";

const POST_NUANCE_LABEL = {
  [POST_NUANCE.TALK_TO_ONESELF]: "独り言",
  [POST_NUANCE.QUESTION]: "問いかけ",
  [POST_NUANCE.OPINION]: "意見表明",
  [POST_NUANCE.INFORMATION]: "情報共有",
} as const;

export function ReviewForm() {
  const [content, setContent] = useState('');
  const [apiResult, setApiResult] = useState<{
    should_post: boolean;
    reason: string;
    usefulness_score: number;
    improvement_suggestions: string[];
    tweet_nuance: typeof POST_NUANCE[keyof typeof POST_NUANCE];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addDraft } = useDrafts();

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

      const reader = res.body?.getReader();

      if (!reader) return;
      const decoder = new TextDecoder();
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
      }
      setApiResult(JSON.parse(result));
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

          <div>
            <h3 className="font-bold text-[#14171a] mb-2">改善案:</h3>
            <ul className="space-y-2">
              {apiResult.improvement_suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="bg-[#e0f7fa] p-3 rounded-lg flex items-start"
                >
                  <span className="text-[#1da1f2] font-bold mr-2">
                    {index + 1}.
                  </span>
                  <span>{suggestion}</span>
                </li>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mt-4 md:mt-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿内容を入力..."
          className="w-full h-32 md:h-48 border border-gray-300 dark:border-gray-700 rounded-md p-2 md:p-3 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-gray-50 dark:bg-gray-700 transition-all duration-300 focus:ring-opacity-50"
        />
        <div className="flex justify-end mt-2 md:mt-3">
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            添削する
            </Button>
          </div>
      </div>
    </>
  );
}