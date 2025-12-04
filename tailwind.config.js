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
        gold: '#FFD700',
        'dark-gold': '#B8860B',
        'light-gold': '#FFEC8B',
        'sparkle-gold': '#FFF8DC',
        'marble-black': '#0a0a0a',
        'dark-gray': '#1a1a1a',
        'medium-gray': '#2a2a2a',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFEC8B 50%, #FFD700 100%)',
        'gold-shine': 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
        'marble-bg': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.7), 0 0 40px rgba(255, 215, 0, 0.4)',
        'gold-glow-strong': '0 0 25px rgba(255, 215, 0, 0.9), 0 0 50px rgba(255, 215, 0, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gold': 'pulseGold 3s infinite',
        'shine': 'shine 4s infinite',
        'shine-move': 'shineMove 4s infinite',
        'text-shimmer': 'textShimmer 3s infinite',
        'float': 'float 20s infinite linear',
        'title-glow': 'titleGlow 4s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)' },
          '70%': { boxShadow: '0 0 0 15px rgba(255, 215, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0)' },
        },
        shine: {
          '0%, 100%': { backgroundImage: 'linear-gradient(135deg, #FFD700 0%, #FFEC8B 50%, #FFD700 100%)' },
          '50%': { backgroundImage: 'linear-gradient(135deg, #FFEC8B 0%, #FFD700 50%, #FFEC8B 100%)' },
        },
        shineMove: {
          '0%': { left: '-100%' },
          '20%, 100%': { left: '100%' },
        },
        textShimmer: {
          '0%, 100%': { textShadow: '0 0 15px rgba(255, 215, 0, 0.5)' },
          '50%': { textShadow: '0 0 25px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)' },
        },
        float: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(-1000px) rotate(720deg)' },
        },
        titleGlow: {
          '0%, 100%': { textShadow: '0 0 25px rgba(255, 215, 0, 0.6)' },
          '50%': { textShadow: '0 0 35px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}