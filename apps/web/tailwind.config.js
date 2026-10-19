/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./apps/web/index.html",
    "./apps/web/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sparkle: {
          purple: '#6C3BFF',
          'purple-dark': '#5022D9',
          'purple-light': '#9B6FFF',
          orange: '#FF6B35',
          pink: '#F43F8C',
          blue: '#2878FF',
          mint: '#28D7A0',
          yellow: '#FFD447',
          lightBg: '#F7F7FC',
          card: '#FFFFFF',
          darkBg: '#11101B',
          darkSurface: '#1C1A2A',
          border: '#E9E7F2',
          textPrimary: '#19172B',
          textSecondary: '#77758A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'sparkle-gradient': 'linear-gradient(90deg, #6C3BFF 0%, #F43F8C 100%)',
        'sparkle-accent': 'linear-gradient(90deg, #FF6B35 0%, #FFD447 100%)',
        'sparkle-ocean': 'linear-gradient(90deg, #2878FF 0%, #28D7A0 100%)',
      },
      animation: {
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.3s ease both',
        'stagger-1': 'fadeInUp 0.5s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both',
        'stagger-2': 'fadeInUp 0.5s 0.10s cubic-bezier(0.16, 1, 0.3, 1) both',
        'stagger-3': 'fadeInUp 0.5s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both',
        'stagger-4': 'fadeInUp 0.5s 0.20s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
