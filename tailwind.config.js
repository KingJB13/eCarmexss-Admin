/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        'primary-color' : '#131038',
        'secondary-color': '#E6AF2E',
        'hover-color': '#2a2e6b',
        'gray-background' : '#e0e0e0'
      },
      fontFamily :{
        sans: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}

