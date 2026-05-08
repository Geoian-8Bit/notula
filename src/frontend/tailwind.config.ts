import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0f0f10', soft: '#1a1a1c' },
        parchment: { DEFAULT: '#f3ead4', muted: '#d8cfb8' },
        accent: { DEFAULT: '#b08968', deep: '#7f5539' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
