/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "bitte-",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
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
  plugins: [],
};
