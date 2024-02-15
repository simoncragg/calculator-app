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
        'gray-dark': '#ababa7',
        'gray-light': '#f2f2f2',
        'orange': '#ff9500',
        'orange-dark': '#cc7700',
        'orange-light': '#ffb040',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.5)'
      }
    }
  },
  plugins: [],
}

