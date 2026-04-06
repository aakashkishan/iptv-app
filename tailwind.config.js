/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gruvbox Dark Theme Colors
        gruvbox: {
          // Backgrounds
          bg0_hard: '#0d1117',  // Hardest background (darker)
          bg0: '#1d2021',       // Hard background
          bg1: '#282828',       // Base background
          bg2: '#32302f',       // Soft background
          bg3: '#3c3836',       // Selection background
          bg4: '#504945',       // Dark separator
          
          // Foregrounds
          fg0: '#fbf1c7',       // Lightest foreground
          fg1: '#ebdbb2',       // Base foreground
          fg2: '#d5c4a1',       // Soft foreground
          fg3: '#bdae93',       // Medium foreground
          fg4: '#a89984',       // Gray foreground
          
          // Colors (neutral/dark)
          red: '#cc241d',
          green: '#98971a',
          yellow: '#d79921',
          blue: '#458588',
          purple: '#b16286',
          aqua: '#689d6a',
          orange: '#d65d0e',
          neutral: '#a89984',
          
          // Colors (bright/vibrant)
          bright_red: '#fb4934',
          bright_green: '#b8bb26',
          bright_yellow: '#fabd2f',
          bright_blue: '#83a598',
          bright_purple: '#d3869b',
          bright_aqua: '#8ec07c',
          bright_orange: '#fe8019',
          bright_neutral: '#928374',
        },
        
        // Legacy aliases for easy migration
        primary: {
          50: '#fbf1c7',
          100: '#ebdbb2',
          200: '#d5c4a1',
          300: '#bdae93',
          400: '#a89984',
          500: '#83a598',    // Gruvbox bright blue
          600: '#458588',    // Gruvbox blue
          700: '#3c3836',
          800: '#32302f',
          900: '#282828',
        },
        dark: {
          50: '#fbf1c7',
          100: '#ebdbb2',
          200: '#d5c4a1',
          300: '#bdae93',
          400: '#a89984',
          500: '#928374',
          600: '#504945',
          700: '#3c3836',
          800: '#32302f',
          900: '#282828',
          950: '#1d2021',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
