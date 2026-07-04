import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1a5c3a', foreground: '#ffffff', hover: '#144a2e' },
        secondary: { DEFAULT: '#f5f0e8', foreground: '#1a1a1a' },
        destructive: { DEFAULT: '#d32f2f', foreground: '#ffffff' },
        background: '#ffffff',
        foreground: '#1a1a1a',
        muted: '#f5f5f5',
        border: '#e0e0e0',
        ring: '#1a5c3a',
      },
      fontSize: {
        'body': ['1.125rem', { lineHeight: '1.75rem' }],
        'heading': ['1.5rem', { lineHeight: '2rem' }],
        'display': ['2rem', { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;