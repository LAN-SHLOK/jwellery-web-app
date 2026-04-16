import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:    "var(--brand-primary)",
          accent:     "var(--brand-accent)",
          text:       "var(--brand-text)",
          background: "var(--brand-background)",
          muted:      "var(--brand-muted)",
        },
      },
      fontFamily: {
        sans:  ['var(--font-sans)',  'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up':      'fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-in-right':  'slide-in-right 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-in-left':   'slide-in-left 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'scale-in':        'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
