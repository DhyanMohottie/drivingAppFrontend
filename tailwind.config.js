const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
    colors: {
      blue: '#002B93',
      white: '#ffffff',
    },
    extend: {
      width: {
        '5p': '10%',   
        '15p': '20%', 
      },
    },
  },
  plugins: [
      flowbite.plugin(),
      require('tailwind-scrollbar'),
  ],
}