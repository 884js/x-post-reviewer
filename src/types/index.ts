import { POST_TYPE, POST_RECOMMENDATION } from "@/constants/postNuance";

export interface Draft {
  id: string;
  content: string;
  createdAt: string;
}

export interface ImprovementSuggestion {
  text: string;
  improvements: string;
}

export interface ReviewResult {
  original_text: string;
  post_recommendation: keyof typeof POST_RECOMMENDATION;
  reason: string;
  usefulness_score: number;
  improvement_suggestions: ImprovementSuggestion[];
  post_type: keyof typeof POST_TYPE;
}