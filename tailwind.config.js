/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        count:"1280px",
        nr:"320px",
      },
      colors:{
        "green":"#46A358"
      },
      fontFamily:{
        cera:"Cera Round Pro DEMO, sans-serif"
      }
    },
  },
  plugins: [],
}