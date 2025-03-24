export const POST_TYPE = {
  TALK_TO_ONESELF: "talking_to_oneself",
  QUESTION: "question",
  OPINION: "opinion",
  INFORMATION: "information",
} as const;

export const POST_RECOMMENDATION = {
  HIGHLY_RECOMMENDED: "highly_recommended", // 絶対に投稿すべき
  RECOMMENDED: "recommended",               // 投稿してもよい
  NEUTRAL: "neutral",                       // どちらとも言えない
  NOT_RECOMMENDED: "not_recommended",       // 投稿は控えたほうがよい
  STRONGLY_DISCOURAGED: "strongly_discouraged" // 投稿すべきでない
} as const;
