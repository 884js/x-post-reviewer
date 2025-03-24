import { ReviewResult, ImprovementSuggestion } from "@/types";
import { Button } from "../Common/Button";
import { FiCheck, FiEdit2, FiSend, FiX } from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { formatTweetCount } from "@/utils/tweetCounter";
import { usePostHistory } from "@/contexts/PostHistoryContext";

type Props = {
  reviewResult: ReviewResult | null;
  onUpdateReviewResult: (reviewResult: ReviewResult) => void;
  onBack: () => void;
};

const POST_TYPE_LABEL: Record<string, string> = {
  "talking_to_oneself": "独り言",
  "question": "問いかけ",
  "opinion": "意見表明",
  "information": "情報共有",
};

const POST_TYPE_DESCRIPTION: Record<string, string> = {
  "talking_to_oneself": "自分自身に向けた考えや感情の表現",
  "question": "読者や他者に質問や意見を求める表現",
  "opinion": "自分の考えや立場を表明する表現",
  "information": "客観的な情報やニュースを伝える表現",
};

const POST_RECOMMENDATION_LABEL: Record<string, string> = {
  "highly_recommended": "絶対に投稿すべき",
  "recommended": "投稿してもよい",
  "neutral": "どちらとも言えない",
  "not_recommended": "投稿は控えたほうがよい",
  "strongly_discouraged": "投稿すべきでない",
};

const POST_RECOMMENDATION_COLOR: Record<string, string> = {
  "highly_recommended": "bg-green-500",
  "recommended": "bg-green-400",
  "neutral": "bg-yellow-400",
  "not_recommended": "bg-orange-400",
  "strongly_discouraged": "bg-red-500",
};

const POST_RECOMMENDATION_TEXT_COLOR: Record<string, string> = {
  "highly_recommended": "text-green-600",
  "recommended": "text-green-500",
  "neutral": "text-yellow-600",
  "not_recommended": "text-orange-600",
  "strongly_discouraged": "text-red-600",
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

export const Result = ({ reviewResult, onUpdateReviewResult, onBack }: Props) => {
  const [isEditingOriginal, setIsEditingOriginal] = useState(false);
  const [editingSuggestionIndex, setEditingSuggestionIndex] = useState<
    number | null
    >(null);

  // Twitter文字数カウント
  const originalTextCount = reviewResult ? formatTweetCount(reviewResult.original_text) : { displayCount: 0, isNearLimit: false, isOverLimit: false };

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
          original_text: text,
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
    (text: string) => {
      if (reviewResult && editingSuggestionIndex !== null) {
        const updatedSuggestions = [...reviewResult.improvement_suggestions];
        updatedSuggestions[editingSuggestionIndex] = {
          text,
          improvements: updatedSuggestions[editingSuggestionIndex].improvements
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
    <div className="mb-6 p-4 bg-white rounded-lg border border-[#e1e8ed] shadow-sm">
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
            投稿の推奨度:
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
          <h3 className="font-bold text-[#14171a] mb-1">投稿価値:</h3>
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
          <h3 className="font-bold text-[#14171a] mb-1">投稿タイプ:</h3>
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
              initialText={reviewResult.original_text}
              onSave={(text) => saveOriginalEdit(text)}
              onCancel={() => setIsEditingOriginal(false)}
              maxLength={280}
            />
          ) : (
            <>
              <p
                className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2] break-keep"
                style={{ overflowWrap: "anywhere" }}
              >
                {reviewResult.original_text}
              </p>
              <div className="flex justify-end mt-2">
                <div className="text-sm text-gray-500">
                  <span
                    className={
                      originalTextCount.isNearLimit
                        ? (originalTextCount.isOverLimit ? "text-red-500 font-bold" : "text-orange-500 font-bold")
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
                <PostButton text={reviewResult.original_text} />
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="font-bold text-[#14171a]">改善案:</h3>
          <ul className="space-y-2 flex flex-col gap-2">
            {reviewResult.improvement_suggestions.map((suggestion, index) => {
              // 各改善案の文字数をカウント
              const suggestionCount = formatTweetCount(suggestion.text);
              
              return (
                <div key={index}>
                  <li className="bg-[#e0f7fa] p-3 rounded-lg flex flex-col">
                    <div className="flex items-start">
                      <span className="text-[#1da1f2] font-bold mr-2">
                        {index + 1}.
                      </span>
                      {editingSuggestionIndex === index ? (
                        <InlineEditor
                          initialText={suggestion.text}
                          onSave={saveSuggestionEdit}
                          onCancel={() => setEditingSuggestionIndex(null)}
                          maxLength={280}
                        />
                      ) : (
                        <span style={{ overflowWrap: "anywhere" }} className="break-keep">
                          {suggestion.text}
                        </span>
                      )}
                    </div>
                    {suggestion.improvements && (
                      <div className="mt-2 ml-6 text-sm text-gray-600 italic">
                        <span className="font-medium">改善点: </span>
                        {suggestion.improvements}
                      </div>
                    )}
                  </li>
                  {editingSuggestionIndex !== index && (
                    <>
                      <div className="flex justify-end mt-2">
                        <div className="text-sm text-gray-500">
                          <span
                            className={
                              suggestionCount.isNearLimit
                                ? (suggestionCount.isOverLimit ? "text-red-500 font-bold" : "text-orange-500 font-bold")
                                : ""
                            }
                          >
                            {suggestionCount.displayCount}
                          </span>
                          <span> / 280</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-2 gap-2">
                        <Button
                          variant="secondary"
                          className="w-auto"
                          onClick={() =>
                            startEditingSuggestion(suggestion, index)
                          }
                          size="xs"
                          icon={<FiEdit2 />}
                        >
                          編集
                        </Button>
                        <PostButton text={suggestion.text} />
                      </div>
                    </>
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
  onSave,
  onCancel,
  maxLength,
}: {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
  maxLength: number;
}) {
  const [text, setText] = useState(initialText);
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
          onClick={() => onSave(text)}
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