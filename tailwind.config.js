/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust for your structure
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-delayed': 'fadeIn 0.5s ease-in 0.2s forwards',
        'fade-in-delayed-more': 'fadeIn 0.5s ease-in 0.4s forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'progress-bar': 'progress 2s ease-in-out',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'modal': 'modal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale': 'scale 0.2s ease-out',
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        modal: {
          '0%': { transform: 'scale(0.95) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

