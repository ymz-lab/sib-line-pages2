import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#071745",
        secondary: "#0B1B3D",
        blue: {
          DEFAULT: "#1E5BA8",
          light: "#3B7DD8",
        },
        bg: {
          white: "#FFFFFF",
          soft: "#F7F9FC",
          mist: "#EEF3F8",
        },
        accent: {
          orange: "#F06418",
          green: "#08883D",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-noto-sans-jp)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Sans",
          "Yu Gothic",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        wides: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
