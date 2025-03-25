'use client';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 md:py-5 mb-4 md:mb-6">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">
              Post Polish
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
} 