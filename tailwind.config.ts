import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [

    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: {
            50: "#eff6ff",
            100: "#dbeafe",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
            950: "#0f172a",
          },
          slate: {
            800: "#1e293b",
            900: "#0f172a",
          },
          gold: "#d97706",
          emerald: {
            500: "#10b981",
            600: "#059669",
          }
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'gov-glow': '0 0 20px -3px rgba(37, 99, 235, 0.25)',
        'gov-card': '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 4px 16px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
};
export default config;
