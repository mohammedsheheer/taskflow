/** @type {import('tailwindcss').Config} */
// CI-024: tailwind.config.js — Happy Hues Palette #13 update
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          // Happy Hues #13 palette
          bg:        '#0f0e17',
          surface:   '#1a1927',
          headline:  '#fffffe',
          paragraph: '#a7a9be',
          accent:    '#ff8906',
          secondary: '#f25f4c',
          tertiary:  '#e53170',
        },
        surface: {
          light: '#fffffe',
          dark:  '#0f0e17',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' },      to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
