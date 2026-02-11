/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0099A8',
          dark: '#056572',
        },
        surface: {
          bg: '#efefff',
        },
      },
      fontFamily: {
        verdana: ['Verdana', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'btn': '16px',
        'input': '12px',
      },
    },
  },
  plugins: [],
};
