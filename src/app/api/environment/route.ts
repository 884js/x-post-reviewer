export async function GET() {
  // 環境情報を収集
  const environment = {
    nodeVersion: process.version,
    platform: process.platform,
    runtimeEnv: typeof (global as any).EdgeRuntime !== 'undefined' ? 'edge' : 'node',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      CLOUDFLARE: process.env.CF_PAGES || 'not set',
      HAS_GEMINI_KEY: process.env.GEMINI_API_KEY ? 'set' : 'not set'
    }
  };

  // 安全な情報のみを返す
  return new Response(JSON.stringify(environment, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
} 