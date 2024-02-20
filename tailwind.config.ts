/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': '#333333',
        'charcoal-dark': '#292929',
        'charcoal-light': '#404040',
        'gray': '#d4d4d2',
        'orange': '#ff9500',
      },
      fontFamily: {
        sans: ['Saira', 'sans-serif'],
      },
      boxShadow: {
        'drop': '0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.5)',
        'edge': '0px 0px 5px 4px rgba(39, 39, 39, 1), 2px 2px 5px 2px rgba(24, 24, 24, 1)'
      }
    }
  },
  plugins: [],
}

