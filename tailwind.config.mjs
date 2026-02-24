/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        'app-bg': '#f6e9cf', // Soft Sandstone - Primary Background
        'champagne': '#F4EFE8', // Light Champagne - Elevated Section Background
        'card-bg': '#EFE8DE', // Soft Warm Beige - Card/Box Background (Premium Look)
        'btn-primary': '#4C7C72', // Teal/Sage Green - Primary Button Background
        'btn-hover': '#3A625A', // Darker Teal - Button Hover State
        'ocean-blue': '#0F2A44', // Deep Ocean Blue - Secondary Accent
        'charcoal': '#1C1C1C', // Deep Charcoal - Primary Text
        'slate': '#6B7280', // Slate Grey - Secondary Text
        'stone-grey': '#E3DED6', // Warm Stone Grey - Borders/Dividers
        'olive-green': '#6B8E6E', // Muted Olive Green - Success
        'terracotta': '#C05640', // Terracotta Red - Error
        
        // Keep existing sage and warm colors for backward compatibility
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cfc7',
          300: '#a3afa3',
          400: '#7d8d7d',
          500: '#627262',
          600: '#4d5b4d',
          700: '#3f4a3f',
          800: '#353d35',
          900: '#2d332d',
        },
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
