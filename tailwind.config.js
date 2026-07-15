/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a4731',
          light: '#14805e',
          dark: '#01352c',
        },
        secondary: {
          DEFAULT: '#facc15',
          light: '#fef08a',
          dark: '#eab308',
        },
        accent: '#f97316',
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e2e8f0',
        muted: '#64748b',
        text: {
          DEFAULT: '#0f172a',
          light: '#475569',
        },
        hover: '#0d9488',
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}