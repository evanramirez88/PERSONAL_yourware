export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'youware-bg': '#f6f4f1',
        'youware-primary': '#55644a',
        'youware-accent': '#1f363d'
      },
      fontFamily: {
        sans: ['yourwareSans', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
