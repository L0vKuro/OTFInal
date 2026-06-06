/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Official Overtake Brand Colors
        brand: {
          red:        '#E8191A', // 02 Crimson Red
          'red-dark': '#B81011', // darker variant for hover
          'red-deep': '#8C0B0C', // deepest red (logo watermark)
          black:      '#0D0D0D', // 01 Obsidion Fog
          grey:       '#1A1A1A', // 03 Onyx Grey
          'grey-mid': '#2A2A2A', // mid surface
          'grey-light':'#3D3D3D', // lighter surface / borders
          white:      '#F2F2F2', // 04 Lucent White
          'white-dim':'#BFBFBF', // muted text
          'white-faint':'#737373', // very muted
        },
        // Keep red aliases pointing to brand red
        red: {
          500: '#E8191A',
          600: '#B81011',
          700: '#8C0B0C',
          400: '#FF3334',
          300: '#FF6667',
        },
        dark: {
          950: '#0D0D0D',
          900: '#141414',
          800: '#1A1A1A',
          700: '#222222',
          600: '#2A2A2A',
        },
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-left': 'slideLeft 0.5s ease forwards',
        'pulse-red': 'pulseRed 2s ease infinite',
        'scan': 'scan 3s linear infinite',
        'glitch': 'glitch 0.3s ease',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232, 0, 61, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(232, 0, 61, 0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(232,0,61,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232,0,61,0.05) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
