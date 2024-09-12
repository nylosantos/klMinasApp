/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: "Roboto, sans-serif",
      },
      colors: {
        gray: {
          950: "#09090A",
          900: "#121214",
          800: "#202024",
          600: "#323238",
          300: "#8D8D99",
          200: "#C4C4CC",
          100: "#E1E1E6",
        },
        green: {
          500: "#2a5369",
        },
        ignite: {
          500: "#129E57",
        },
        yellow: {
          500: "#F7DD43",
          600: "#BBA317",
          700: "#E5CD3D",
        },
        red: {
          500: "#DB4437",
        },
        klOrange: {
          500: "#ed8504",
        },
        klGreen: {
          500: "#2a5369",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
