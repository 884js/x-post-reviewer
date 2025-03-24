/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // フォント設定
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
      },
      lineHeight: {
        'relaxed': 'var(--line-height-normal)',
        'tight': 'var(--line-height-tight)',
      },
      letterSpacing: {
        'normal': 'var(--letter-spacing-normal)',
        'tight': 'var(--letter-spacing-tight)',
        'wide': 'var(--letter-spacing-wide)',
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        // 必要に応じて独自のキーフレームを追加
      },
      transitionDelay: {
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}; 