/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        kelly: ['KellyAnnGothic'],
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
        '4xs': '0.375rem',
        '5xs': '0.25rem',
      },
      borderWidth: {
        3: '3px',
        5: '5px',
        6: '6px',
        7: '7px',
      },
      colors: {
        pgreen: {
          DEFAULT: '#C4CEB6',
          50: '#F5F7F3',
          100: '#EBEFE7',
          200: '#D8DECE',
          300: '#C4CEB6',
          400: '#A9B794',
          500: '#8EA173',
          600: '#718358',
          700: '#546242',
          800: '#38402B',
          900: '#1B1F15',
          950: '#0C0E09',
        },
        pblue: {
          DEFAULT: '#97B9C4',
          50: '#F2F6F8',
          100: '#E5EEF0',
          200: '#CBDCE2',
          300: '#B1CBD3',
          400: '#97B9C4',
          500: '#73A1B0',
          600: '#558696',
          700: '#416672',
          800: '#2C464E',
          900: '#18262A',
          950: '#0E1619',
        },
        porange: {
          DEFAULT: '#FB8F67',
          50: '#FFF2ED',
          100: '#FEE7DE',
          200: '#FDD1C0',
          300: '#FDBBA3',
          400: '#FCA585',
          500: '#FB8F67',
          600: '#FA6730',
          700: '#EC4406',
          800: '#B53405',
          900: '#7E2503',
          950: '#631D03',
        },
        pocean: {
          DEFAULT: '#416165',
          50: '#CFDEE0',
          100: '#C3D6D8',
          200: '#AAC5C8',
          300: '#91B4B8',
          400: '#78A3A8',
          500: '#619197',
          600: '#51797E',
          700: '#416165',
          800: '#2B4043',
          900: '#151F21',
          950: '#0A0F10',
        },
      },
    },
  },
  daisyui: {
    // themes: ["luxury"], // Bundle size verklijnen wanneer hierover uit zijn
    theme: {
      mytheme: {
        warning: '#FA6730',
      },
    },
  },
  plugins: [require('daisyui')],
};
