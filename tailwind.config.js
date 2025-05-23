/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // adjust for your structure
    ],
    theme: {
      extend: {
        height: {
          'real-screen': 'calc(var(--real-vh, 100vh))',
        }
      },
    },
    plugins: [],
  }
  