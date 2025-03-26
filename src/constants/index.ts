export const POST_TYPE_LABEL: Record<string, string> = {
  "talking_to_oneself": "独り言",
  "question": "問いかけ",
  "opinion": "意見表明",
  "information": "情報共有",
} as const;

export const POST_TYPE_DESCRIPTION: Record<string, string> = {
  "talking_to_oneself": "自分自身に向けた考えや感情の表現",
  "question": "読者や他者に質問や意見を求める表現",
  "opinion": "自分の考えや立場を表明する表現",
  "information": "客観的な情報やニュースを伝える表現",
} as const;

export const POST_RECOMMENDATION_LABEL: Record<string, string> = {
  "highly_recommended": "絶対に投稿すべき",
  "recommended": "投稿してもよい",
  "neutral": "どちらとも言えない",
  "not_recommended": "投稿は控えたほうがよい",
  "strongly_discouraged": "投稿すべきでない",
} as const;

export const POST_RECOMMENDATION_COLOR: Record<string, string> = {
  "highly_recommended": "bg-green-500",
  "recommended": "bg-green-400",
  "neutral": "bg-yellow-400",
  "not_recommended": "bg-orange-400",
  "strongly_discouraged": "bg-red-500",
} as const;

export const POST_RECOMMENDATION_TEXT_COLOR: Record<string, string> = {
  "highly_recommended": "text-green-600",
  "recommended": "text-green-500",
  "neutral": "text-yellow-600",
  "not_recommended": "text-orange-600",
  "strongly_discouraged": "text-red-600",
} as const;