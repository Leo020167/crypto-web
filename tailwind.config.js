/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        screens: {
          '2xl': '1280px',
        },
        center: true,
        padding: '1.5rem',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
  corePlugins: {
    preflight: false,
  },
};
