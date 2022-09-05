/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#672CB4",
        secondary: "#41FF60",
        tertiary: "#FFF500",
        semidark: "#3E3E3E",
        dark: "#2B2B2B",
        ["neon-shadow-b"]: "#8629FF",
        ["neon-shadow-a"]: "#A057FF",
        ["neon-fg"]: "#41FF60",
        and: "#00E0FF",
        or: "#ACFE00",
        nor: "#FF0000",
        not: "#BD00FF",
      },
    },
  },
  plugins: [],
};
