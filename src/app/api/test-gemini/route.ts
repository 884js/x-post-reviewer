import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    // APIキーの取得
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'APIキーが設定されていません' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Gemini APIの初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // 簡単なテスト
    const result = await model.generateContent('こんにちは、元気ですか？');
    const text = result.response.text();
    
    return new Response(JSON.stringify({ success: true, message: text }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : '不明なエラー' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 