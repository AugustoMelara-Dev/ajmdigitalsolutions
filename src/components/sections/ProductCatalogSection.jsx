/* --- FILE: src/components/sections/ProductCatalogSection.jsx (ARREGLADO) --- */
/**
 * @file ProductCatalogSection.jsx
 * @description Sección principal del catálogo, adaptada para usar Section (v2)
 * con la prop 'bg' para un fondo temático.
 */

'use client';

import React from 'react';
import Section from '@/components/ui/Section'; // Importa nuestro Section (v2)
import { ProductCard } from '@/components/shared/ProductCard';
import { products } from '@/lib/data';
import { cn } from '@/lib/utils';

/**
 * Componente `ProductCatalogSection`.
 * Muestra un encabezado y una cuadrícula responsiva de jabones.
 */
export default function ProductCatalogSection() {
  return (
    <Section
      id="catalogo" // ID para anclaje
      aria-labelledby="catalog-heading" // Accesibilidad
      // --- ¡AQUÍ ESTÁ EL ARREGLO! ---
      // 1. Usamos la prop 'bg' para que 'Section.jsx' maneje el fondo.
      //    'alt' usa '--color-background-alt-rgb' (tu rosa claro).
      bg="alt"
      // 2. Quitamos el 'bg-[--color-background-alt]' del className.
      //    Dejamos solo los paddings y el 'relative'.
      className={cn(
        'relative py-16 md:py-24'
        // ¡Se fue el fondo de aquí!
      )}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}
    >
      {/* Contenedor principal con ancho máximo consistente */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la Sección (Esto estaba perfecto) */}
        <div className="mb-12 text-center lg:mb-16">
          <span
            className={cn(
              'mb-2 block text-sm font-semibold uppercase tracking-wider',
              'text-[--color-primary]' // Color primario (Lavender Pink oscuro)
            )}
          >
            Hecho a Mano con Amor
          </span>
          <h2
            id="catalog-heading" // ID vinculado
            className={cn(
              'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
              'text-[--color-foreground]' // Texto principal oscuro
            )}
          >
            Nuestro Jardín de Aromas
          </h2>
          <p
            className={cn(
              'mx-auto mt-4 max-w-2xl text-base leading-relaxed lg:text-lg',
              'text-[--color-foreground-muted]' // Texto secundario
            )}
          >
            Descubre nuestra colección de jabones artesanales, creados con
            ingredientes puros para cuidar tu piel con delicadeza.
          </p>
        </div>

        {/* Cuadrícula de Productos Responsiva (Esto estaba perfecto) */}
        {products && products.length > 0 ? (
          <div
            className={cn(
              'grid grid-cols-1 gap-x-6 gap-y-10', // Espaciado base
              'sm:grid-cols-2', // 2 columnas
              'lg:grid-cols-3', // 3 columnas
              'xl:gap-x-8'
            )}
            role="list"
            aria-label="Catálogo de jabones artesanales"
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id} // Key estable
                product={product}
                // ¡Optimización LCP de nivel senior!
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          // Estado de "No hay productos" (Defensivo y amigable)
          <div className="text-center text-lg text-[--color-foreground-muted]">
            <p className="mb-4">
              Estamos preparando con cariño nuestra próxima cosecha de jabones
              artesanales. 🌿
            </p>
            <p>¡Vuelve pronto para descubrir nuevas fragancias!</p>
          </div>
        )}
      </div>
    </Section>
  );
}
// --- END FILE ---