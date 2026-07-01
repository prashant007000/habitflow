/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#050505',
          900: '#050505',
          850: '#0A0A0A',
          800: '#0A0A0A',
          700: '#18181B',
          600: '#27272A',
          border: '#18181B',
        },
        accent: {
          violet: '#71717A', // minimal dark styling
          violetDim: '#3F3F46',
          amber: '#F59E0B',
          green: '#10B981',
          red: '#EF4444',
          blue: '#3B82F6',
        },
        ink: {
          DEFAULT: '#FFFFFF',
          dim: '#A1A1AA',
          faint: '#71717A',
        },
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'glow-violet': 'radial-gradient(circle at 30% 20%, rgba(124,92,252,0.25), transparent 60%)',
        'glow-amber': 'radial-gradient(circle at 70% 80%, rgba(255,138,76,0.18), transparent 60%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45)',
        glow: '0 0 0 1px rgba(124,92,252,0.4), 0 0 24px rgba(124,92,252,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.08) rotate(-2deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out both',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        flame: 'flame 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
