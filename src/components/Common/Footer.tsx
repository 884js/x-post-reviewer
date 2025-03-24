'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-8 md:mt-12 py-4 md:py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-3 md:px-0 flex justify-center">
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} XCalibur
        </p>
      </div>
    </footer>
  );
} 