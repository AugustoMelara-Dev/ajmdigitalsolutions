/* --- FILE: src/app/layout.jsx (NÍTIDO Y LISTO PARA PRODUCCIÓN) --- */
/**
 * @file layout.jsx
 * @description Layout raíz para "El Jardín de la Abuela".
 * @description Arreglado: Se quitó ErrorBoundary, script dark, y props innecesarias.
 */

// Importaciones necesarias
import React from 'react';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils'; // <-- ¡Ahora sí existe!
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import './globals.css'; // <-- ¡LA MAGIA!

// --- Configuración de Fuente ---
const mainFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Define la variable CSS para Tailwind
  display: 'swap',
});

// --- Metadatos SEO (Tu SEO estaba perfecto) ---
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://eljardindelaabuela.vercel.app';
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    'Descubre jabones artesanales hechos a mano en San Pedro Sula con ingredientes naturales y amor familiar. Cuida tu piel con El Jardín de la Abuela. Haz tu pedido por WhatsApp.',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    description:
      'Jabones naturales, elaborados artesanalmente con cariño familiar en Honduras.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'es_HN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    description:
      'Jabones artesanales hechos con ingredientes puros y recetas familiares.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// --- Schema.org Básico (Tu Schema estaba perfecto) ---
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND_NAME,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: BRAND_TAGLINE,
};

/**
 * Componente `RootLayout`.
 * @param {object} props
 * @param {React.ReactNode} props.children - Contenido de la página (page.jsx)
 * @returns {JSX.Element}
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${mainFont.variable} scroll-pt-[var(--header-height,72px)] scroll-smooth`}
      // ¡Quitamos suppressHydrationWarning porque ya no hay script de tema!
    >
      <head>
        {/* --- ¡ARREGLADO! ---
            Quitamos el script de 'theme-and-lang-init' (dark mode).
            Era basura innecesaria.
        */}
      </head>
      {/*
        ¡AQUÍ ESTÁ LA SOLUCIÓN AL FONDO BLANCO!
        'bg-background' y 'text-foreground' ahora SÍ funcionan
        porque globals.css está importado.
      */}
      <body
        className={cn(
          'font-sans antialiased bg-background text-foreground',
          'min-h-screen flex flex-col'
        )}
      >
        {/* --- ¡ARREGLADO! ---
            Quitamos el <ErrorBoundary> que no existe.
        */}

        {/* El 'Skip link' del Navbar es suficiente, quitamos el de aquí. */}

        {/* --- ¡ARREGLADO! ---
            Llamamos al Navbar sin props, porque él solito
            importa lo que necesita de 'constants.js'.
        */}
        <Navbar />

        {/* Contenido principal de la página (viene de page.jsx) */}
        <main id="main-content" className="flex-grow">
          {children}
        </main>

        {/* Renderiza Footer */}
        <Footer />

        {/* Script JSON-LD para Schema.org (Esto estaba perfecto) */}
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
// --- END FILE ---