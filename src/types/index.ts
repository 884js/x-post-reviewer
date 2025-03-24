import { POST_TYPE, POST_RECOMMENDATION } from "@/constants/postNuance";
export interface Draft {
  id: string;
  content: string;
  createdAt: string;
}

export interface ReviewResult {
  original_text: string;
  post_recommendation: typeof POST_RECOMMENDATION[keyof typeof POST_RECOMMENDATION];
  reason: string;
  usefulness_score: number;
  improvement_suggestions: string[];
  post_type: typeof POST_TYPE[keyof typeof POST_TYPE];
}