/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './client/src/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
        },
        dark: {
          DEFAULT: '#0a0a0f',
          100: '#111118',
          300: '#1a1a2e',
          400: '#252536',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(99,102,241,0.3)' },
          to: { boxShadow: '0 0 30px rgba(99,102,241,0.7)' },
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
};
