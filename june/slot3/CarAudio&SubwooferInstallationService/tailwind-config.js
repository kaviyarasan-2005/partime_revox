/* ============================================================
   TAILWIND CONFIGURATION
   Configures the Tailwind Play CDN settings, mapping our 
   strict 3-color design system variables.
   ============================================================ */

tailwind.config = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          bg: 'var(--color-bg)',
          bgAlt: 'var(--color-bg-alt)',
          card: 'var(--color-surface)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
        },
        textColor: {
          base: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(0, 240, 255, 0.4)',
        'glow-accent': '0 0 15px rgba(255, 0, 127, 0.4)',
      }
    },
  },
}
