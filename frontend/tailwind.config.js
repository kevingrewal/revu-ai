/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rating: {
          excellent: '#10b981', // green (8-10)
          good: '#84cc16',      // yellow-green (6-7.9)
          mixed: '#f59e0b',     // orange (4-5.9)
          poor: '#ef4444',      // red (<4)
        },
      },
    },
  },
  plugins: [],
}
