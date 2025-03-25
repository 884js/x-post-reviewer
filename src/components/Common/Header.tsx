'use client';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-3 md:py-4 mb-4 md:mb-6">
      <div className="w-full max-w-[600px] mx-auto px-3 md:px-6">
        <div className="flex items-center justify-center">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 tracking-wide letter-spacing-wide leading-tight">
            Post Polish
          </h1>
        </div>
      </div>
    </header>
  );
} 