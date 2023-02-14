/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1d2c53",
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [],
};
