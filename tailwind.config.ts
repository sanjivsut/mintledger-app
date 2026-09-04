import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF7",
        surface: "#EAF6EF",
        primary: "#4F9A72",
        primaryDark: "#1F3B2E",
        accent: "#FFD8B8",
        positive: "#5FD3A1",
        negative: "#F19A8E",
        text: "#22262B",
        // supporting tints used in the mockup component conventions
        "interest-bg": "#FCE9E5",
        "interest-text": "#8A3C30",
      },
      fontFamily: {
        heading: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(31, 59, 46, 0.04), 0 8px 24px rgba(31, 59, 46, 0.06)",
        "card-hover":
          "0 2px 4px rgba(31, 59, 46, 0.06), 0 16px 40px rgba(31, 59, 46, 0.10)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
