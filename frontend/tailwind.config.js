/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d4ff',
          200: '#80b8ff',
          300: '#4d9cff',
          400: '#1a80ff',
          500: '#0066e6',
          600: '#0052b3',
          700: '#003d80',
          800: '#00294d',
          900: '#00141a',
        },
        dark: {
          50: '#e6e6e6',
          100: '#b3b3b3',
          200: '#808080',
          300: '#4d4d4d',
          400: '#262626',
          500: '#1a1a1a',
          600: '#141414',
          700: '#0d0d0d',
          800: '#080808',
          900: '#000000',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #0066e6, 0 0 10px #0066e6' },
          '100%': { boxShadow: '0 0 10px #0066e6, 0 0 20px #0066e6, 0 0 30px #0066e6' },
        }
      }
    },
  },
  plugins: [],
}
