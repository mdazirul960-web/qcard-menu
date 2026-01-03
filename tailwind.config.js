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
        qcard: {
          purple: '#6d3d97',
          yellow: '#fdb81a',
          bg: '#F4F5F7',
        }
      },
    },
  },
  plugins: [],
};