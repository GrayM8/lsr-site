import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-100%) skewX(-12deg)" },
          "100%": { transform: "translateX(200%) skewX(-12deg)" },
        },
      },
      animation: {
        shine: "shine 2s infinite linear",
      },
      colors: {
        "lsr-orange": "#FF8F00", // Restoring likely context based on codebase usage
        "lsr-charcoal": "#1A1A1A",
      }
    },
  },
  plugins: [typography],
}

export default config
