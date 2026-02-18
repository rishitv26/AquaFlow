/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0a0f1a',
        },
        cyan: {
          400: '#00d4ff',
        },
      },
    },
  },
  plugins: [],
}
