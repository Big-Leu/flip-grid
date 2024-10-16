/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
    "client/node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "client/node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
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
