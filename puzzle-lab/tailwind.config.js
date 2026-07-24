/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#E8A020',
          light: '#F4C261',
          dark: '#d4940e',
          deep: '#b8790a',
        },
        cream: {
          DEFAULT: '#FAFAF7',
          card: '#FFFFFF',
          surface: '#F5F1E8',
        },
        ink: '#2D2520',
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.25s ease-out',
        wiggle: 'wiggle 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
};
