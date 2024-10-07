/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dangrek: ['Dangrek', 'sans-serif'],
        koulen: ['Koulen', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
