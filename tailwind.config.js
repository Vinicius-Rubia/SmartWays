/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{tsx,js}'],
  theme: {
    extend: {
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gridRow: {
        'span-10': 'span 10 / span 10',
      },
      colors: {
        dark: '#181719',
        'dark-medium': '#27242C',
        'dark-light': '#3D3A41',
        green: '#34D9A8',
        'sky-blue': '#4282F1',
        'white-blue': '#E5ECFB',
      }
    },
  },
  plugins: [],
}

