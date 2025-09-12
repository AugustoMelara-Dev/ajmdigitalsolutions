/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

const config = {
  darkMode: ['class'],
  future: { hoverOnlyWhenSupported: true },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.25rem', lg: '2rem', xl: '2.5rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#1E40AF', // azul corporativo
          soft: '#1D4ED8',
          foreground: '#ffffff',
        },
        success: { DEFAULT: '#16A34A', foreground: '#ffffff' },
      },
      borderRadius: { xl: '0.875rem', '2xl': '1rem', '3xl': '1.25rem' },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 10px 20px rgba(0,0,0,0.06)',
        focus: '0 0 0 2px rgba(30,64,175,0.35)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
            a: {
              color: theme('colors.brand.DEFAULT'),
              textDecoration: 'underline',
              fontWeight: '600',
              '&:hover': { opacity: 0.85 },
            },
            h1: { color: theme('colors.slate.900'), fontWeight: '700', letterSpacing: '-0.02em' },
            h2: { color: theme('colors.slate.900'), fontWeight: '700', letterSpacing: '-0.01em' },
            h3: { color: theme('colors.slate.900'), fontWeight: '600' },
            strong: { color: theme('colors.slate.900') },
            code: { color: theme('colors.slate.900'), fontWeight: '600' },
          },
        },
        invert: {
          css: {
            color: theme('colors.slate.300'),
            a: { color: theme('colors.brand.soft') },
            h1: { color: theme('colors.white') },
            h2: { color: theme('colors.white') },
            h3: { color: theme('colors.slate.100') },
            strong: { color: theme('colors.white') },
            code: { color: theme('colors.slate.100') },
            blockquote: { borderLeftColor: theme('colors.slate.600'), color: theme('colors.slate.200') },
          },
        },
      }),
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: { 'fade-up': 'fade-up .45s ease-out both' },
    },
  },
  safelist: ['prose', 'prose-lg', 'prose-invert', 'dark:prose-invert', 'max-w-none'],
  plugins: [typography],
};

export default config;
