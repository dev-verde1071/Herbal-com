import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jungle: {
          50: "#f0f7f1",
          100: "#d8edd9",
          200: "#b3dab6",
          300: "#7fbf84",
          400: "#4a9e52",
          500: "#2d7d35",
          600: "#1f6128",
          700: "#1a4d21",
          800: "#163d1c",
          900: "#0f2913",
          950: "#071510"
        },
        terra: {
          100: "#f5e6d3",
          200: "#e8c9a0",
          300: "#d4a56a",
          400: "#c08040",
          500: "#a8622a",
          600: "#8a4a1e",
          700: "#6b3615"
        },
        bark: {
          700: "#3d2a15",
          800: "#241808",
          900: "#120c03"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"]
      },
      backgroundImage: {
        "jungle-gradient": "linear-gradient(135deg,#071510 0%,#0f2913 50%,#1a4d21 100%)"
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "spin-slow": "spin 3s linear infinite"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
