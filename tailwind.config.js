/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D28D9',
          light: '#F0EEFF',
          hover: '#5b21b6'
        },
        semantic: {
          success: {
            light: '#ECFDF5',
            DEFAULT: '#10B981',
            hover: '#059669'
          },
          error: {
            light: '#FEF2F2',
            DEFAULT: '#EF4444',
            hover: '#DC2626'
          },
          warning: {
            light: '#FFFBEB',
            DEFAULT: '#F59E0B',
            hover: '#D97706'
          },
          info: {
            light: '#EFF6FF',
            DEFAULT: '#3B82F6',
            hover: '#2563EB'
          }
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif']
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }]
      }
    },
  },
  plugins: [],
};
