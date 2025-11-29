/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        celo: {
          green: '#35D07F',
          gold: '#FBCC5C',
          blue: '#0F53FA'
        }
      }
    },
  },
  plugins: [],
}