import type { Config } from 'tailwindcss';
const flowbite = require('flowbite-react/tailwind');

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite/**/*.js',
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': {
            backgroundPosition: '-500px 0',
          },
          '100%': {
            backgroundPosition: '500px 0',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // 'gradient-light':
        //   'linear-gradient(57deg, #edeefc 50%, #e7fdf2 91.95%, #f7f8f8 91.95%)',
        'gradient-light':
          'linear-gradient(57deg, #ffcccc 50%, #ff9999 91.95%, #fe4a55 91.95%)',
      },
      boxShadow: {
        light: '0px 2px 14px 0px rgba(0, 0, 0, 0.04)',
      },
      colors: {
        black: {
          '1': '#00214F',
          '2': '#344054',
        },
        primary: {
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
          '950': '#172554',
          main: '#FE4A55',
          faded: '#FFB3BA',
          grad: {
            main: 'linear-gradient(57deg, #EDEEFC 50%, #E7FDF2 91.95%, #F7F8F8 91.95%))',
          },
          light: 'rgba(64, 69, 225, 0.04)',
          '20': '#B4B6F3',
          '22': '#EDEEFC',
        },
        secondary: {
          main: '#0D2352',
          'main-hover': '#163B8D',
          'main-active': '#112D6A',
        },
        muted: '#C7C7C7',
        neutral: 'var(--Neutral-color-600, #686976)',
        'neutral-2': 'var(--Neutral-color-50, #F7F8F8)',
        'neutral-3': 'var(--Neutral-color-200, #D4D5D8)',
        'neutral-4': 'var(--Neutral-Bg-color, #FAFAFB)',
        'neutral-5': 'var(--Neutral-light-grey, #F1F1F4)',
        destructive: 'red',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
    flowbite.plugin(),
  ],
};
export default config;
