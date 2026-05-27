import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050809",
        foreground: "#eefafa",
        panel: "#0b1214",
        "panel-strong": "#101a1e",
        border: "#1c3338",
        muted: "#8aa3a8",
        cyan: {
          DEFAULT: "#22d3ee",
          soft: "#67e8f9",
          deep: "#0891b2"
        },
        teal: {
          DEFAULT: "#14b8a6",
          soft: "#5eead4",
          deep: "#0f766e"
        },
        amber: {
          DEFAULT: "#f59e0b",
          soft: "#fbbf24"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        "command-glow": "0 0 32px rgba(34, 211, 238, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
