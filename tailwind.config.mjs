/* --- FILE: tailwind.config.mjs (¡ARREGLADO EL withOpacity!) --- */
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

/**
 * Helper function CORREGIDO para definir colores usando CSS variables
 * con soporte para opacidad (ej. bg-primary/50).
 */
const withOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      // Sintaxis CSS CORRECTA para rgba con variable CSS
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    // Sintaxis CSS CORRECTA para rgb con variable CSS
    return `rgb(var(${variableName}))`;
  };
};

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: undefined, // Modo oscuro deshabilitado
  future: { hoverOnlyWhenSupported: true },
  content: [
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Paleta de Colores Semántica (¡Ahora funciona!)
      colors: {
        background: withOpacity('--color-background-rgb'),
        'background-alt': withOpacity('--color-background-alt-rgb'),
        'background-hover': withOpacity('--color-background-hover-rgb'), // Asegúrate que esta variable exista en globals.css
        foreground: withOpacity('--color-foreground-rgb'),
        'foreground-muted': withOpacity('--color-foreground-muted-rgb'),

        primary: withOpacity('--color-primary-rgb'),
        'primary-fg': withOpacity('--color-primary-fg-rgb'),
        'primary-bg': withOpacity('--color-primary-bg-rgb'), // Asegúrate que exista
        'primary-border': withOpacity('--color-primary-border-rgb'), // Asegúrate que exista

        secondary: withOpacity('--color-secondary-rgb'),
        'secondary-fg': withOpacity('--color-secondary-fg-rgb'),
        accent: withOpacity('--color-accent-rgb'),
        'accent-fg': withOpacity('--color-accent-fg-rgb'),

        destructive: withOpacity('--color-destructive-rgb'), // Asegúrate que exista
        'destructive-fg': withOpacity('--color-destructive-fg-rgb'), // Asegúrate que exista

        border: `rgba(var(--color-neutral-900-rgb), 0.1)`, // Forma directa para border si no necesita alpha
        ring: `rgba(var(--color-accent-rgb), 0.5)`,     // Forma directa para ring

        // Colores específicos del Footer
        'footer-bg': withOpacity('--color-footer-bg-rgb'),
        'footer-text': withOpacity('--color-footer-text-rgb'),
        'footer-text-muted': withOpacity('--color-footer-text-muted-rgb'),
        'footer-heading': withOpacity('--color-footer-heading-rgb'),
        'footer-link': withOpacity('--color-footer-link-rgb'),
        'footer-link-hover': withOpacity('--color-footer-link-hover-rgb'),
        'footer-border': `rgba(var(--color-white-rgb), 0.1)`,
        'footer-icon': withOpacity('--color-footer-icon-rgb'),

        // Colores para skeleton loader (Usar var() directamente es mejor aquí)
        'skeleton-base': 'var(--color-skeleton-base)',
        'skeleton-highlight': 'var(--color-skeleton-highlight)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-md, 0.375rem)',
        md: 'var(--radius-md, 0.375rem)',
        lg: 'var(--radius-lg, 0.5rem)',
        xl: 'var(--radius-xl, 0.75rem)',
        '2xl': 'var(--radius-2xl, 1rem)',
        full: '9999px',
      },
      // Sombras usando variables CSS (Mejor definido en globals.css)
      boxShadow: {
         card: 'var(--shadow-card)',
         'card-hover': 'var(--shadow-card-hover)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': `rgb(var(--color-foreground-muted-rgb))`,
            '--tw-prose-headings': `rgb(var(--color-foreground-rgb))`,
            '--tw-prose-links': `rgb(var(--color-primary-rgb))`,
            '--tw-prose-bold': `rgb(var(--color-foreground-rgb))`,
             a: {
               textDecoration: 'underline',
               transition: 'opacity 0.2s ease-out',
               '&:hover': { opacity: 0.8 },
             },
          },
        },
      }),
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
           '0%': { opacity: '0', transform: 'translateY(8px)' },
           '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [
    typography,
  ],
};

export default config;
// --- END FILE ---