import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: "#ebebeb",
        card: "#ffffff",
        ink: "#111111",
        muted: "#888888",
        line: "#111111",
      },
      borderColor: {
        DEFAULT: "#111111",
      },
    },
  },
  plugins: [],
};

export default config;
