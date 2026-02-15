/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1', // Indigo 500
          600: '#4f46e5', // Indigo 600
          700: '#4338ca', // Indigo 700
        },
        brand: {
          start: '#4f46e5', // Indigo 600
          end: '#9333ea',   // Purple 600
        }
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #4338ca 0%, #7e22ce 100%)',
      }
    },
  },
  plugins: [],
}
