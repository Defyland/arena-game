/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          primary: '#ff6b35',
          secondary: '#004e89',
          accent: '#ffd23f',
          dark: '#1a1a1a',
          light: '#f4f4f4'
        }
      }
    },
  },
  plugins: [],
} 