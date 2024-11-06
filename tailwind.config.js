/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}', // Make sure to include this line for React files
    ],
    theme: {
      extend: {
        backgroundColor: {
          'navy-blue': {
            100: '#EBF8FF', // Lightest blue
          200: '#BEE3F8', // Lighter blue
          300: '#90CDF4', // Soft blue
          400: '#63B3ED', // Sky blue
          500: '#4299E1', // Regular blue
          600: '#3B46F1', // Dark blue
          700: '#4F58F2', // Darker blue
          800: '#2C5282', // Even darker blue
          900: '#2A4362', // Darkest blue
        },  // Adds your custom blue
        },
        colors: {
          'navy-blue': {
            300: '#93C5FD', // Very light navy blue
            400: '#60A5FA', // Lighter navy blue for primary usage
            500: '#3B82F6', // Light navy blue for regular use
            600: '#2563EB', // Slightly darker navy blue for hover/focus states
            700: '#1D4ED8', // Darker navy blue for focus and hover states
        },  // Adds your custom blue
        },
        border: {
          'navy-blue': {
            300: '#93C5FD', // Very light navy blue
            400: '#60A5FA', // Lighter navy blue for primary usage
            500: '#3B82F6', // Light navy blue for regular use
            600: '#2563EB', // Slightly darker navy blue for hover/focus states
            700: '#1D4ED8', // Darker navy blue for focus and hover states
        },  // Adds your custom blue
        },
      },
    },
    plugins: [],
  }
  
  