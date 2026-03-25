/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark': '#1c1c1c',
        'warm-gray': '#5b5a57',
        'soft-neutral': '#93918a',
        'light-bg': '#e8e2d4',
        'olive': '#545b47',
        'muted-green': '#93935f',
        'white-cream': '#f8f6f1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Funnel Display', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
