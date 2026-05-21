import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // NES-inspired palette
        'nes-black': '#0a0a14',
        'nes-deep': '#000010',
        'nes-paper': '#fcfcfc',
        'nes-blue-dark': '#0030a0',
        'nes-blue': '#3060e8',
        'nes-blue-light': '#80c8f8',
        'nes-yellow': '#fcd440',
        'nes-orange': '#f8801c',
        'nes-red': '#d82838',
        'nes-magenta': '#e040b0',
        'nes-purple': '#7028b8',
        'nes-green': '#28a830',
        'nes-green-light': '#80f870',
        'nes-tan': '#fcc4a0',
        'nes-brown': '#783c00',
        'nes-grey': '#787878',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"Courier New"', 'monospace'],
        crt: ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'pixel-yellow': '4px 4px 0 0 #fcd440',
        'pixel-red': '4px 4px 0 0 #d82838',
        'pixel-cyan': '4px 4px 0 0 #80c8f8',
        'pixel-green': '4px 4px 0 0 #28a830',
        'pixel-deep': '6px 6px 0 0 #000010',
      },
      keyframes: {
        'pixel-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'slow-blink': {
          '0%, 60%': { opacity: '1' },
          '70%, 100%': { opacity: '0.25' },
        },
        'sprite-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%, 60%': { transform: 'translateY(-4px)' },
        },
        'sprite-bob-strong': {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '40%': { transform: 'translateY(-8px) scaleY(1.02)' },
        },
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'star-twinkle': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'crt-flicker': {
          '0%, 100%': { opacity: '0.97' },
          '50%': { opacity: '1' },
        },
        'rainbow-shift': {
          '0%, 100%': { color: '#fcd440' },
          '20%': { color: '#80c8f8' },
          '40%': { color: '#e040b0' },
          '60%': { color: '#80f870' },
          '80%': { color: '#f8801c' },
        },
        'punch-flash': {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.08)', filter: 'brightness(1.6)' },
        },
      },
      animation: {
        'pixel-blink': 'pixel-blink 1s steps(1) infinite',
        'slow-blink': 'slow-blink 1.8s infinite',
        'sprite-bob': 'sprite-bob 0.9s ease-in-out infinite',
        'sprite-bob-strong': 'sprite-bob-strong 0.7s ease-in-out infinite',
        'scroll-x-slow': 'scroll-x 60s linear infinite',
        'scroll-x-med': 'scroll-x 30s linear infinite',
        'scroll-x-fast': 'scroll-x 15s linear infinite',
        'star-twinkle': 'star-twinkle 1.6s steps(1) infinite',
        'crt-flicker': 'crt-flicker 0.12s infinite',
        'rainbow-shift': 'rainbow-shift 2s steps(5) infinite',
        'punch-flash': 'punch-flash 0.35s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
