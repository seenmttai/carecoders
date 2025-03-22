/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6EE7B7', // Light green
          DEFAULT: '#10B981', // Green (Tailwind’s default green)
          dark: '#047857', // Darker green
        },
      },
    },
  },
  plugins: [],
}