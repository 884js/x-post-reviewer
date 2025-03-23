import { POST_NUANCE } from "@/constants/postNuance";
import { ReviewResult } from "@/types";
import { Button } from "../Common/Button";
import { FiCheck, FiEdit2, FiSend, FiX } from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsChevronLeft } from "react-icons/bs";

type Props = {
  reviewResult: ReviewResult | null;
  onUpdateReviewResult: (reviewResult: ReviewResult) => void;
  onBack: () => void;
};

const POST_NUANCE_LABEL = {
  [POST_NUANCE.TALK_TO_ONESELF]: "独り言",
  [POST_NUANCE.QUESTION]: "問いかけ",
  [POST_NUANCE.OPINION]: "意見表明",
  [POST_NUANCE.INFORMATION]: "情報共有",
} as const;

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
  const [editedSuggestion, setEditedSuggestion] = useState("");
  const [isEditingOriginal, setIsEditingOriginal] = useState(false);
  const [editedOriginal, setEditedOriginal] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [editingSuggestionIndex, setEditingSuggestionIndex] = useState<
    number | null
    >(null);

  const startEditingOriginal = () => {
    if (reviewResult) {
      setIsEditingOriginal(true);
      setEditedOriginal(reviewResult.original_text);
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

  const startEditingSuggestion = (suggestion: string, index: number) => {
    setEditingSuggestionIndex(index);
    setEditedSuggestion(suggestion);
  };

  const saveSuggestionEdit = useCallback(
    (text: string) => {
      if (reviewResult && editingSuggestionIndex !== null) {
        const updatedSuggestions = [...reviewResult.improvement_suggestions];
        updatedSuggestions[editingSuggestionIndex] = text;
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
      <div className="flex items-center gap-1 mb-4 cursor-pointer" onClick={onBack}>
        <BsChevronLeft className="w-5 h-5" />
        <span>戻る</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-3">
          <div
            className={`w-4 h-4 rounded-full mr-2 ${
              reviewResult.should_post ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <h3 className="font-bold text-[#14171a]">
            投稿すべきかどうか:
            <span
              className={`ml-2 ${
                reviewResult.should_post ? "text-green-600" : "text-red-600"
              }`}
            >
              {reviewResult.should_post ? "はい" : "いいえ"}
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
          <h3 className="font-bold text-[#14171a] mb-1">ニュアンス:</h3>
          {reviewResult.tweet_nuance && (
            <p className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2]">
              {POST_NUANCE_LABEL[reviewResult.tweet_nuance]}
            </p>
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
              onSave={saveOriginalEdit}
              onCancel={() => setIsEditingOriginal(false)}
            />
          ) : (
            <>
              <p className="text-[#657786] bg-[#f5f8fa] p-3 rounded-lg border-l-4 border-[#1da1f2]">
                {reviewResult.original_text}
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
                <PostButton text={reviewResult.original_text} />
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="font-bold text-[#14171a]">改善案:</h3>
          <ul className="space-y-2 flex flex-col gap-2">
            {reviewResult.improvement_suggestions.map((suggestion, index) => (
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
                      className="w-auto"
                      onClick={() => startEditingSuggestion(suggestion, index)}
                      size="xs"
                      icon={<FiEdit2 />}
                    >
                      編集
                    </Button>
                    <PostButton text={suggestion} />
                  </div>
                )}
              </div>
            ))}
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