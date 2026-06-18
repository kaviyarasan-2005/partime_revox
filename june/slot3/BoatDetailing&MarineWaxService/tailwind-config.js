// AquaShine Marine — Tailwind CSS Configuration
// This file must be loaded AFTER the Tailwind CDN script.
// Color System: Primary (#008080) | Secondary (#00ABAB) | Accent (#F1A56F)

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#008080',
          50:  '#e6f2f2',
          100: '#ccdcdc',
          200: '#99b9b9',
          300: '#669696',
          400: '#337373',
          500: '#008080',
          600: '#007373',
          700: '#006666',
          800: '#004d4d',
          900: '#003333',
        },
        secondary: {
          DEFAULT: '#00ABAB',
          50:  '#e6f7f7',
          100: '#cceeee',
          200: '#99dddd',
          300: '#66cccc',
          400: '#33bbbb',
          500: '#00ABAB',
          600: '#009a9a',
          700: '#008989',
          800: '#006767',
          900: '#004444',
        },
        accent: {
          DEFAULT: '#F1A56F',
          50:  '#fef6f1',
          100: '#fdede2',
          200: '#fbdcc5',
          300: '#f8cba9',
          400: '#f5b88c',
          500: '#F1A56F',
          600: '#d99564',
          700: '#b57c53',
          800: '#916343',
          900: '#744f35',
        },
        marine: {
          dark:  '#000000',
          navy:  '#008080',
          ocean: '#00ABAB',
          gold:  '#F1A56F',
          mist:  '#000000',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter:  ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glass':  '0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)',
        'gold':   '0 4px 24px rgba(241, 165, 111,0.30)',
        'card':   '0 4px 24px rgba(0,0,0,0.30)',
        'deep':   '0 20px 60px rgba(0,0,0,0.50)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        DEFAULT: '16px',
        lg: '24px',
        xl: '40px',
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'float':    'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in':  'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
