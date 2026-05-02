/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olivia: {
          green: '#4ADE80',
          teal: '#E0F7FA',
          dark: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
};
