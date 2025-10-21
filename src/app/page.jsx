/* --- FILE: src/app/page.jsx (¡VERSIÓN FINAL COMPLETA!) --- */
/**
 * @file page.jsx
 * @description Componente principal de la landing page "El Jardín de la Abuela".
 * @description Ensambla todas las secciones en el orden final.
 */

'use client';

import React from 'react';

// --- Hooks ---
import { useSmoothAnchorScroll } from '@/hooks/useSmoothAnchorScroll';

// --- Secciones de la Página (¡TODAS LAS PIEZAS!) ---
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection'; // <-- ¡AÑADIDO!
import ProductCatalogSection from '@/components/sections/ProductCatalogSection';
import CtaSection from '@/components/sections/CtaSection';

/**
 * Componente `HomePage`.
 * Renderiza la secuencia final de secciones para "El Jardín de la Abuela".
 * @returns {JSX.Element}
 */
export default function HomePage() {
  // Activa el scroll suave para todos los enlaces de ancla (#...)
  useSmoothAnchorScroll();

  return (
    // <main> es crucial para accesibilidad y SEO
    <main id="main-content">
      <HeroSection />
      <AboutSection /> {/* <-- ¡AÑADIDO EN SU LUGAR! */}
      <ProductCatalogSection />
      <CtaSection />
    </main>
  );
}
// --- END FILE ---