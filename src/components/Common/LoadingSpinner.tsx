export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          {/* 主要なスピナー */}
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent animate-spin"></div>
          {/* 二重リング効果 */}
          <div className="absolute inset-2 rounded-full border-4 border-t-blue-300 border-r-blue-200 border-b-transparent border-l-blue-100 animate-spin-slow"></div>
          {/* 中央の円 */}
          <div className="absolute inset-0 m-auto w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </div>
        {/* ローディングテキスト */}
        <div className="mt-4 text-white font-semibold">
          <span className="inline-block animate-bounce delay-100">処</span>
          <span className="inline-block animate-bounce delay-200">理</span>
          <span className="inline-block animate-bounce delay-300">中</span>
          <span className="inline-block animate-bounce delay-400">.</span>
          <span className="inline-block animate-bounce delay-500">.</span>
          <span className="inline-block animate-bounce delay-600">.</span>
        </div>
      </div>
    </div>
  );
} 