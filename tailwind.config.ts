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
        primary: "#0A1330",
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
        line: "#E5E8EC",
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
      fontSize: {
        display: ["3.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-lg": ["5rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
    },
  },
  plugins: [],
};

export default config;
