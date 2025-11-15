import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FCF9F2",
          100: "#F3EFE2",
          200: "#E4D8B8",
          300: "#D2C08A",
          400: "#BFA870",
          500: "#A58E57",
          600: "#7C6C3B",
          700: "#5D512D",
          800: "#433B21",
          900: "#2C2815"
        },
        leaf: {
          50: "#F2FAF5",
          100: "#DCF3E0",
          200: "#B6E6C0",
          300: "#88D49A",
          400: "#56BA73",
          500: "#3E9E59",
          600: "#317C46",
          700: "#256038",
          800: "#1A472A",
          900: "#11311D"
        }
      }
    }
  },
  plugins: []
};

export default config;
