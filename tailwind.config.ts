import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'vhs-black': '#0a0a0a',
        'vhs-deep': '#06060c',
        'vhs-paper': '#f2efe6',
        'neon-red': '#ff1f3d',
        'neon-cyan': '#00ffd1',
        'neon-magenta': '#ff2bd6',
        'neon-amber': '#ffb627',
        'neon-violet': '#7a3cff',
      },
      fontFamily: {
        hud: ['"VT323"', 'monospace'],
        display: ['"Rubik Mono One"', 'sans-serif'],
        action: ['"Anton"', '"Bebas Neue"', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 12px rgba(0,255,209,0.85), 0 0 36px rgba(0,255,209,0.45)',
        'neon-red': '0 0 12px rgba(255,31,61,0.85), 0 0 36px rgba(255,31,61,0.45)',
        'neon-magenta': '0 0 12px rgba(255,43,214,0.85), 0 0 36px rgba(255,43,214,0.45)',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.6' },
        },
        'rec-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0.2' },
        },
        'chrome-shift': {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(1px,-1px)' },
        },
        'tracking-jitter': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '50%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-1px)' },
        },
        'boot-bars': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'grain-shift': {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-5%,-10%)' },
          '20%': { transform: 'translate(-15%,5%)' },
          '30%': { transform: 'translate(7%,-25%)' },
          '40%': { transform: 'translate(-5%,25%)' },
          '50%': { transform: 'translate(-15%,10%)' },
          '60%': { transform: 'translate(15%,0)' },
          '70%': { transform: 'translate(0,15%)' },
          '80%': { transform: 'translate(3%,35%)' },
          '90%': { transform: 'translate(-10%,10%)' },
        },
      },
      animation: {
        scanline: 'scanline 7s linear infinite',
        flicker: 'flicker 4s infinite',
        'rec-blink': 'rec-blink 1.1s infinite',
        'chrome-shift': 'chrome-shift 1.4s ease-in-out infinite',
        'tracking-jitter': 'tracking-jitter 120ms infinite',
        'boot-bars': 'boot-bars 1.6s ease-out forwards',
        'grain-shift': 'grain-shift 1.6s steps(8) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
