import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'DM Sans fallback', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        bitt: {
          //  '50': '#e7e5e4',
          // '100: '#e7e5e4',
          // '200: '#030712',
          // '300: '#030712',
          // '400: '#262626',
          // '500: '#030712',
          // '600: '#030712',
          // '700: '#030712',
          // '800: '#262626',
          // '900: '#030712',
          // '950': '#030712',
          // '50': '#6d6d6d',
          // '100: '#5d5d5d',
           50: '#e7e5e4',
          100: '#e7e5e4',
          200: '#4f4f4f',
          300: '#3d3d3d',
          400: '#000000',
          500: '#000000',
          600: '#030712',
          700: '#030712',
          800: '#262626',
          900: '#030712',
          950: '#030712',
        }
      },
    },
  }
};
