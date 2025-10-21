/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'youware-bg': '#f6f4f1',
        'youware-primary': '#55644a',
        'youware-accent': '#8b9a7a'
      },
      fontFamily: {
        sans: ['yourwareSans', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        subtle: '0 2px 12px rgba(24, 24, 24, 0.08)'
      }
    }
  },
  plugins: []
};
