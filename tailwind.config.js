/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          card: '#0f172a',
          cardLight: '#1e293b',
          border: '#334155',
          accent: '#06b6d4', // cyan-500
          green: '#10b981', // emerald-500
          danger: '#ef4444', // red-500
          warning: '#f59e0b', // amber-500
          blue: '#3b82f6', // blue-500
          purple: '#8b5cf6', // purple-500
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
