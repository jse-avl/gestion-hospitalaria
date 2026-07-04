import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0d7c5f', foreground: '#ffffff', hover: '#0a6049', light: '#e8f5f2' },
        secondary: { DEFAULT: '#f0fdf9', foreground: '#0f172a' },
        destructive: { DEFAULT: '#dc2626', foreground: '#ffffff' },
        warning: { DEFAULT: '#f59e0b', foreground: '#ffffff' },
        success: { DEFAULT: '#10b981', foreground: '#ffffff' },
        background: '#ffffff',
        foreground: '#0f172a',
        muted: { DEFAULT: '#f1f5f9', foreground: '#64748b' },
        accent: { DEFAULT: '#e8f5f2', foreground: '#0d7c5f' },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#0d7c5f',
      },
      fontSize: {
        'body': ['1rem', { lineHeight: '1.5rem' }],
        'heading': ['1.25rem', { lineHeight: '1.75rem' }],
        'display': ['2rem', { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'dialog': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;