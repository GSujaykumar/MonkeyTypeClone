/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-bg': 'var(--bg-color)',
        'theme-text': 'var(--text-color)',
        'theme-sub': 'var(--sub-color)',
        'theme-main': 'var(--main-color)',
        'theme-error': 'var(--error-color)',
        'theme-caret': 'var(--caret-color)',
      },
      fontFamily: {
        mono: ['"Roboto Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
