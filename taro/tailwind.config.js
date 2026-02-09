/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E90FF',
        secondary: '#667eea',
        danger: '#ff7a45',
        success: '#4CAF50',
        warning: '#ff9800',
      },
      spacing: {
        'safe': 'max(env(safe-area-inset-left), 0px)',
      },
    },
  },
  plugins: [],
}
