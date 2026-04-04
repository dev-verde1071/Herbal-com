/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#F4FBF4",
          100: "#E7F5E7",
          300: "#A8C9A0",
          500: "#5E8B5A",
          600: "#4A7247",
          700: "#355235"
        },
        sand: {
          50: "#FCF8F2",
          100: "#F4EBDD",
          200: "#E8D9C2",
          300: "#D8C2A6",
          400: "#C6A983",
          600: "#9C7A58",
          700: "#7A5E44"
        },
        cream: "#FCF8F2"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(53, 82, 53, 0.08)"
      }
    }
  },
  plugins: []
};
