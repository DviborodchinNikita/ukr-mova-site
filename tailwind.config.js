/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fdfaf5",
        milk: "#faf7f2",
        beige: "#e8dcc4",
        lightBrown: "#c9a876",
        caramel: "#b8975f",
        brown: "#8b6f47",
        darkBrown: "#3d2e1f",
        graphite: "#5a4632",
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};