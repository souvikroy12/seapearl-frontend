/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Check karein 'src' ke baad double star aur slash hai ya nahi
  ],
  theme: {
    extend: {
      colors: {
        'hotel-bg': '#0A0A0A',
        'hotel-gold': '#C6A675',
      },
    },
  },
  plugins: [],
}