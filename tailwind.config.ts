import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Paleta personalizada 3D San Vicente ──────────────────────
      colors: {
        bg: {
          primary:   '#0A0A0A', // Fondo principal
          card:      '#161616', // Fondo tarjetas
          secondary: '#1A1A1A', // Fondo secundario
        },
        accent: {
          cyan:   '#38BDF8', // Acento principal
          purple: '#7C3AED', // Acento secundario
        },
        text: {
          primary:   '#F8F8F8', // Texto principal
          secondary: '#8A8A8A', // Texto secundario
        },
        border: {
          DEFAULT: '#2A2A2A', // Bordes
          subtle:  '#2A2A2A',
        },
      },

      // ─── Tipografía ───────────────────────────────────────────────
      fontFamily: {
        // Usa la variable CSS que next/font inyecta en layout.tsx
        sans:  ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // ─── Backgrounds utilitarios ─────────────────────────────────
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-cyan':    'linear-gradient(135deg, #38BDF8, #7C3AED)',
        'gradient-card':    'linear-gradient(145deg, #161616, #1A1A1A)',
      },

      // ─── Box shadows temáticos ────────────────────────────────────
      boxShadow: {
        'card':        '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)',
        'card-hover':  '0 10px 30px -5px rgba(56,189,248,0.12), 0 4px 6px -2px rgba(0,0,0,0.4)',
        'glow-cyan':   '0 0 20px rgba(56,189,248,0.25)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.25)',
      },

      // ─── Border radius ────────────────────────────────────────────
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // ─── Animaciones adicionales ──────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0px rgba(56,189,248,0)' },
          '50%':       { boxShadow: '0 0 20px rgba(56,189,248,0.3)' },
        },
      },
      animation: {
        'fade-in':   'fade-in 0.3s ease-out forwards',
        'pulse-glow':'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
