// app/manifest.js
export default function manifest() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ajm-digital.vercel.app').replace(/\/$/, '');
  return {
    name: 'AJM Digital Solutions',
    short_name: 'AJM Digital',
    description: 'Páginas web, Tiendas en línea y Landings en 72h con SEO técnico.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    screenshots: [{ src: `${base}/og-image.jpg`, sizes: '1200x630', type: 'image/jpeg' }],
  };
}
