/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          dark: '#1E3B2F',
          DEFAULT: '#1E3B2F',
        },
        olive: {
          DEFAULT: '#7F8C6A',
        },
        sand: {
          DEFAULT: '#C8B48A',
        },
        cream: {
          DEFAULT: '#F5F0E6',
        }
      }
    },
  },
  plugins: [],
}