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
          // Revamped Purple, Maroon, and Blue palette
          purple: '#6B21A8',
          'purple-dark': '#4C1D95',
          'purple-light': '#9333EA',
          maroon: '#831843',
          'maroon-dark': '#500724',
          'maroon-light': '#9F1239',
          pink: '#831843', // Backward compatibility mapped to rich maroon
          blue: '#1D4ED8',
          'blue-dark': '#1E3A8A',
          'blue-light': '#2563EB',
          mint: '#10B981',
          orange: '#EA580C',
          yellow: '#F59E0B',
          // Facebook / Instagram style feed backgrounds & cards
          lightBg: '#F0F2F5',
          card: '#FFFFFF',
          darkBg: '#0E0B16',
          darkSurface: '#181324',
          border: '#E4E6EB',
          textPrimary: '#050505',
          textSecondary: '#65676B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'sparkle-gradient': 'linear-gradient(135deg, #6B21A8 0%, #831843 50%, #1D4ED8 100%)',
        'sparkle-story-ring': 'linear-gradient(45deg, #6B21A8, #831843, #1D4ED8)',
        'sparkle-accent': 'linear-gradient(90deg, #831843 0%, #1D4ED8 100%)',
        'sparkle-ocean': 'linear-gradient(90deg, #1D4ED8 0%, #6B21A8 100%)',
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
