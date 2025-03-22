// Twitterユーザーの型定義
export interface TwitterUser {
  username: string;
  displayName: string;
  profileImageUrl: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  lastTweetDate?: Date | null;
  tweetCount?: number;
  isInactive?: boolean;
}

// 分析結果の型定義
export interface AnalysisResult {
  totalFollowers: number;
  inactiveFollowers: number;
  inactiveUsers: TwitterUser[];
}

// スクレイピング設定の型定義
export interface ScraperOptions {
  username: string; // ログイン用のTwitterユーザー名
  password: string; // ログイン用のパスワード
  targetUsername: string; // 分析対象のTwitter ID（@を除いた形式）
  inactivityThreshold: number; // 非アクティブと判定する日数
  maxFollowersToScan: number; // スキャンするフォロワーの最大数
}

// APIレスポンスの型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Draft {
  id: string;
  content: string;
  createdAt: string;
}

export interface ReviewResult {
  overallEvaluation: string;
  originalText: string;
  editedText: string;
  feedbackComments: string[];
} 