import type { Config } from 'tailwindcss';

const cssVarRgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: cssVarRgb('--c-page'),
        surface: cssVarRgb('--c-surface'),
        'surface-2': cssVarRgb('--c-surface-2'),
        border: cssVarRgb('--c-border'),
        'text-strong': cssVarRgb('--c-text-strong'),
        'text-soft': cssVarRgb('--c-text-soft'),
        'text-on-accent': cssVarRgb('--c-text-on-accent'),
        accent: {
          DEFAULT: cssVarRgb('--c-accent'),
          deep: cssVarRgb('--c-accent-deep'),
          cool: cssVarRgb('--c-accent-cool'),
        },
        ring: cssVarRgb('--c-ring'),
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
      },
      borderColor: {
        DEFAULT: cssVarRgb('--c-border'),
      },
      ringColor: {
        DEFAULT: cssVarRgb('--c-ring'),
      },
    },
  },
  plugins: [],
} satisfies Config;
