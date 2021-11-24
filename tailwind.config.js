const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: false,
    content: ['./src/**/*.js'],
  },
  corePlugins: {
   fontFamily: false,
  },
  theme: {
    screens:{
      sm: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px'
    },
    colors: {
      primary: colors.red,
      secondary: colors.black,
      blue: colors.sky,
      white: colors.white,
      indigo: colors.indigo,
      gray: colors.blueGray,
      black: colors.black,
      green: colors.emerald,
      red: colors.rose,
      orange: colors.amber,
      transparent: 'transparent',
    },
    extend: {
      outline: {
        gray: '2px solid #0F172A',
      }
    },
  },
  variants: {
    extend: {
      fontWeight: ['focus', 'hover'],
    },
  },
  plugins: [],
}
