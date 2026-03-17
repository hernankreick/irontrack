/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'Arial', 'sans-serif'],
      },
      colors: {
        // Fondos
        base:    '#07080d',
        surface: '#0e1018',
        deep:    '#0a0c14',
        mid:     '#13151f',
        // Bordes
        border:  '#1a1d2e',
        border2: '#2d3748',
        // Texto
        muted:   '#4a5568',
        soft:    '#9ca3af',
        // Brand
        brand:   '#ef4444',
        // Patrones
        push:    '#60a5fa',
        pull:    '#a78bfa',
        knee:    '#4ade80',
        hinge:   '#f87171',
        coreC:   '#facc15',
        mob:     '#e879f9',
        cardioC: '#22d3ee',
        oly:     '#fbbf24',
        // Semaforo
        green:   '#22c55e',
        amber:   '#f59e0b',
        orange:  '#f97316',
        red:     '#ef4444',
        blue:    '#60a5fa',
        purple:  '#a78bfa',
      },
      borderRadius: {
        xl2: '14px',
      },
    },
  },
  plugins: [],
}
