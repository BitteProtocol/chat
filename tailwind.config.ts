import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
        xxl: "1920px",
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
