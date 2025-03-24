import twitterText from 'twitter-text';

/**
 * Twitterの文字カウントロジックに従ってテキストの文字数を計算する
 * @param text カウントするテキスト
 * @returns Twitterでの文字数と残り文字数
 */
export const countTweetChars = (text: string) => {
  // parseTweet()はTwitterの文字カウントロジックを使ってテキストを解析します
  const parsedTweet = twitterText.parseTweet(text);
  
  return {
    count: parsedTweet.weightedLength,
    remaining: parsedTweet.permillage / 10, // permillageは1000分率なので、10で割って残りの割合（%）を取得
    valid: parsedTweet.valid,
    maxLength: 280 // 現在のTwitterの最大文字数
  };
};

/**
 * 文字数を計算してわかりやすい表示形式に整形する
 * @param text カウントするテキスト
 * @returns 表示用の文字数情報
 */
export const formatTweetCount = (text: string) => {
  const { count, remaining, maxLength } = countTweetChars(text);
  
  return {
    displayCount: Math.round(count),
    displayRemaining: Math.round(remaining),
    isNearLimit: count >= maxLength - 20, // 残り20文字以下で警告表示
    isOverLimit: count > maxLength,
  };
}; 