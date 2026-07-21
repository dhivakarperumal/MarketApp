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
        green: {
          50: '#eefcf4',
          100: '#d7f7e3',
          200: '#b2edce',
          300: '#7edcb2',
          400: '#4cc18f',
          500: '#3A8F68', 
          600: '#2F7D5A', 
          700: '#2B7A57', 
          800: '#236147',
          900: '#1d503b',
          950: '#0e2d21',
        },
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}