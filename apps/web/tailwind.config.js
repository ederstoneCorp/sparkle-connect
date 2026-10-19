/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sparkle: {
          purple: '#6C3BFF',
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
      }
    },
  },
  plugins: [],
}
