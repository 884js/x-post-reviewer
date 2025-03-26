import { ReviewResult, ImprovementSuggestion } from "@/types";
import { Button } from "../Common/Button";
import { FiCheck, FiEdit2, FiSend, FiX } from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { formatTweetCount } from "@/utils/tweetCounter";
import { POST_RECOMMENDATION_COLOR, POST_RECOMMENDATION_TEXT_COLOR, POST_RECOMMENDATION_LABEL, POST_TYPE_LABEL, POST_TYPE_DESCRIPTION } from "@/constants";

type Props = {
  reviewResult: ReviewResult | null;
  onUpdateReviewResult: (reviewResult: ReviewResult) => void;
  onBack: () => void;
  originalContent: string;
};

const PostButton = ({ text }: { text: string }) => {
  return (
    <a
      href={`https://twitter.com/intent/tweet?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="primary" size="xs" icon={<FiSend />}>
        ポストする
      </Button>
    </a>
  );
};

export const Result = ({ reviewResult, onUpdateReviewResult, onBack, originalContent }: Props) => {
  const [isEditingOriginal, setIsEditingOriginal] = useState(false);
  const [editingSuggestionIndex, setEditingSuggestionIndex] = useState<
    number | null
    >(null);

  // Twitter文字数カウント
  const originalTextCount = formatTweetCount(originalContent);

  const startEditingOriginal = () => {
    if (reviewResult) {
      setIsEditingOriginal(true);
    }
  };

  const saveOriginalEdit = useCallback(
    (text: string) => {
      if (reviewResult) {
        onUpdateReviewResult({
          ...reviewResult,
        });

        setIsEditingOriginal(false);
      }
    },
    [reviewResult, onUpdateReviewResult]
  );

  const startEditingSuggestion = (suggestion: ImprovementSuggestion, index: number) => {
    setEditingSuggestionIndex(index);
  };

  const saveSuggestionEdit = useCallback(
    (text: string, improvements: string) => {
      if (reviewResult && editingSuggestionIndex !== null) {
        const updatedSuggestions = [...reviewResult.improvement_suggestions];
        updatedSuggestions[editingSuggestionIndex] = {
          text,
          improvements
        };
        onUpdateReviewResult({
          ...reviewResult,
          improvement_suggestions: updatedSuggestions,
        });

        setEditingSuggestionIndex(null);
      }
    },
    [reviewResult, editingSuggestionIndex, onUpdateReviewResult]
  );

  if (!reviewResult) return null;

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-[#e1e8ed] shadow-sm" data-testid="review-result">
      <div
        className="flex items-center gap-1 mb-4 cursor-pointer"
        onClick={onBack}
      >
        <BsChevronLeft className="w-5 h-5" />
        <span>戻る</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-3">
          <div
            className={`w-4 h-4 rounded-full mr-2 ${
              POST_RECOMMENDATION_COLOR[reviewResult.post_recommendation]
            }`}
          />
          <h3 className="font-bold text-[#14171a]">
            投稿の推奨度
            <span
              className={`ml-2 ${
                POST_RECOMMENDATION_TEXT_COLOR[reviewResult.post_recommendation]
              }`}
            >
              {POST_RECOMMENDATION_LABEL[reviewResult.post_recommendation]}
            </span>
          </h3>
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-[#14171a] mb-1">投稿価値</h3>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${
                  star <= reviewResult.usefulness_score
                    ? "text-[#ffd700]"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-[#1da1f2] font-semibold">
              {reviewResult.usefulness_score}/5
            </span>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-[#14171a] mb-1">投稿タイプ</h3>
          {reviewResult.post_type && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#1da1f2]">
                  {POST_TYPE_LABEL[reviewResult.post_type]}
                </span>
              </div>
              <p className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2] text-sm">
                {POST_TYPE_DESCRIPTION[reviewResult.post_type]}
              </p>
            </div>
          )}
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-[#14171a] mb-1">理由:</h3>
          {reviewResult.reason && (
            <p className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2]">
              {reviewResult.reason}
            </p>
          )}
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-[#14171a] mb-1">元の文章:</h3>
          {isEditingOriginal ? (
            <InlineEditor
              initialText={originalContent}
              onSave={(text, _) => saveOriginalEdit(text)}
              onCancel={() => setIsEditingOriginal(false)}
              maxLength={280}
            />
          ) : (
            <>
              <p
                className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2] break-keep"
                style={{ overflowWrap: "anywhere" }}
              >
                {originalContent}
              </p>
              <div className="flex justify-end mt-2">
                <div className="text-sm text-gray-500">
                  <span
                    className={
                      originalTextCount.isNearLimit
                        ? originalTextCount.isOverLimit
                          ? "text-red-500 font-bold"
                          : "text-orange-500 font-bold"
                        : ""
                    }
                  >
                    {originalTextCount.displayCount}
                  </span>
                  <span> / 280</span>
                </div>
              </div>
              <div className="flex justify-end mt-2 gap-2">
                <Button
                  variant="secondary"
                  onClick={startEditingOriginal}
                  size="xs"
                  icon={<FiEdit2 />}
                >
                  編集
                </Button>
                <PostButton text={originalContent} />
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="font-bold text-[#14171a] mb-1">改善案</h3>
          <ul className="space-y-2 flex flex-col gap-2">
            {reviewResult.improvement_suggestions.map((suggestion, index) => {
              // 各改善案の文字数をカウント
              const suggestionCount = formatTweetCount(suggestion.text);

              return (
                <div key={index}>
                  {editingSuggestionIndex === index ? (
                    <InlineEditor
                      initialText={suggestion.text}
                      initialImprovements={suggestion.improvements}
                      onSave={(text, improvements) =>
                        saveSuggestionEdit(text, improvements || "")
                      }
                      onCancel={() => setEditingSuggestionIndex(null)}
                      maxLength={280}
                    />
                  ) : (
                    <div className="bg-[#f5f8fa] p-4 rounded-lg border-l-4 border-[#6ddb90]">
                      <div className="flex items-start justify-between">
                        <div
                          className="mb-3 font-medium text-gray-800 break-keep"
                          style={{ overflowWrap: "anywhere" }}
                        >
                          改善案 {index + 1}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              startEditingSuggestion(suggestion, index)
                            }
                            className="text-[#1da1f2] hover:text-[#1a91da]"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p
                        className="text-[#14171a] break-keep"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {suggestion.text}
                      </p>

                      {suggestion.improvements && (
                        <div className="mt-2 text-sm text-[#657786] bg-[#f0f3f5] p-2 rounded">
                          {suggestion.improvements}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-gray-500">
                          <span
                            className={
                              suggestionCount.isNearLimit
                                ? suggestionCount.isOverLimit
                                  ? "text-red-500 font-bold"
                                  : "text-orange-500 font-bold"
                                : ""
                            }
                          >
                            {suggestionCount.displayCount}
                          </span>
                          <span> / 280</span>
                        </div>
                        <PostButton text={suggestion.text} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

function InlineEditor({
  initialText,
  initialImprovements = '',
  onSave,
  onCancel,
  maxLength,
}: {
  initialText: string;
  initialImprovements?: string;
  onSave: (text: string, improvements: string) => void;
  onCancel: () => void;
  maxLength: number;
}) {
  const [text, setText] = useState(initialText);
  const [improvements, setImprovements] = useState(initialImprovements);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Twitter文字数カウント
  const tweetCount = formatTweetCount(text);

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
      <div className="flex justify-end mt-2">
        <div className="text-sm text-gray-500">
          <span className={tweetCount.isNearLimit ? (tweetCount.isOverLimit ? "text-red-500 font-bold" : "text-orange-500 font-bold") : ""}>
            {tweetCount.displayCount}
          </span>
          <span> / {maxLength}</span>
        </div>
      </div>
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
          onClick={() => onSave(text, improvements)}
          size="xs"
          icon={<FiCheck />}
          disabled={tweetCount.isOverLimit}
        >
          保存
        </Button>
      </div>
    </div>
  );
}