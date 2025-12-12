/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'solina': {
          purple: '#9B7EBD',
          'purple-light': '#B8A5D3',
          'purple-dark': '#7D5FA3',
          gold: '#F5D061',
          'gold-light': '#F9E5A1',
          blue: '#A8D8EA',
          mint: '#95E1D3',
          coral: '#F38181',
          'bg-light': '#FDF8F3',
          'bg-purple': '#E8DFF5',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #9B7EBD 0%, #F5D061 100%)',
        'gradient-soft': 'linear-gradient(135deg, #E8DFF5 0%, #FFF4E6 100%)',
        'gradient-purple': 'linear-gradient(135deg, #9B7EBD 0%, #B8A5D3 100%)',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(155, 126, 189, 0.15)',
        'medium': '0 4px 16px rgba(155, 126, 189, 0.2)',
        'large': '0 8px 32px rgba(155, 126, 189, 0.25)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
}
