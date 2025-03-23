import { POST_NUANCE } from "@/constants/postNuance";
export interface Draft {
  id: string;
  content: string;
  createdAt: string;
}

export type ReviewResult = {
  original_text: string;
  should_post: boolean;
  reason: string;
  usefulness_score: number;
  improvement_suggestions: string[];
  tweet_nuance: typeof POST_NUANCE[keyof typeof POST_NUANCE];
}