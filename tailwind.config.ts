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
        background: "#071a33",
        foreground: "#f8fafc",
        panel: "#0f2748",
        "panel-strong": "#153861",
        border: "#2b4d79",
        muted: "#c8d4e5",
        cyan: {
          DEFAULT: "#f3bd53",
          soft: "#f8d99a",
          deep: "#b7791f"
        },
        teal: {
          DEFAULT: "#4fb477",
          soft: "#8bd3a4",
          deep: "#237a4b"
        },
        amber: {
          DEFAULT: "#d8a13d",
          soft: "#f1c979"
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
        "command-glow": "0 18px 48px rgba(7, 26, 51, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
