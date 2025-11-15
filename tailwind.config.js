/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#F3FFF5",
          500: "#4CAF50",
          600: "#3E8E41",
        },
        brand: {
          50: "#FAF7F2",
          200: "#E8DCC5",
          500: "#C4A484",
          700: "#8C6E4E"
        }
      }
    },
  },
  plugins: [],
};
