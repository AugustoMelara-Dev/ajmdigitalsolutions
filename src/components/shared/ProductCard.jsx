// --- FILE: src/components/shared/ProductCard.jsx ---
/**
 * @file ProductCard.jsx
 * @description Componente reutilizable para mostrar un producto (jabón) en el catálogo.
 * @description Muestra imagen, nombre, descripción y precio con un diseño cálido y profesional.
 * @requires react - Para el componente.
 * @requires next/image - Para optimización de imágenes.
 * @requires @/lib/utils - Para `cn` (classnames). Asume existencia.
 * @requires @/types/index.js - Para la estructura JSDoc `@typedef {import('@/types').Product}`. Asume existencia.
 */

'use client'; // Necesario si se añaden interacciones como botones 'Añadir' en el futuro.

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Asume existencia

/**
 * @typedef {import('@/types').Product} Product - Importa la definición de tipo desde JSDoc.
 */

/**
 * Formatea un número como precio en Lempiras (HNL).
 * @param {number} price - El precio numérico.
 * @returns {string} El precio formateado (ej. "L 125.00").
 */
function formatPriceHNL(price) {
  try {
    // Intenta usar Intl.NumberFormat para un formato localizado correcto
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 2, // Siempre mostrar dos decimales
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    // Fallback simple si Intl no está disponible o falla
    return `L ${Number(price || 0).toFixed(2)}`;
  }
}

/**
 * Componente `ProductCard`.
 *
 * Muestra la información de un jabón individual dentro de una tarjeta estilizada.
 *
 * @param {object} props - Propiedades del componente.
 * @param {Product} props.product - Objeto con los datos del producto a mostrar.
 * @param {boolean} [props.priority=false] - Indica si la imagen debe cargarse con prioridad (para LCP).
 * @returns {JSX.Element} El componente de tarjeta de producto renderizado.
 */
export function ProductCard({ product, priority = false }) {
  // Validación básica de entrada
  if (!product || !product.id) {
    console.warn('[ProductCard] Datos de producto inválidos recibidos.');
    return null; // No renderizar nada si faltan datos esenciales
  }

  const { name, description, price, imageUrl } = product;

  return (
    <article
      aria-labelledby={`product-title-${product.id}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow duration-300 ease-out',
        'border-[--color-border] bg-[--color-background] shadow-card hover:shadow-card-hover', // Variables CSS y sombras del tema
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-[--color-ring] focus-within:ring-offset-2 focus-within:ring-offset-[--color-background]' // Foco claro
      )}
    >
      {/* Contenedor de la Imagen con aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden"> {/* Ratio común para productos */}
        <Image
          src={imageUrl}
          alt={`Imagen del jabón ${name}`} // Alt text descriptivo
          fill // Ocupa el contenedor div
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" // Tamaños responsivos
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" // Efecto sutil al hacer hover
          priority={priority} // Carga prioritaria si está 'above the fold'
          placeholder="blur" // Placeholder mientras carga
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==" // Placeholder genérico pequeño
        />
        {/* Opcional: Overlay sutil sobre la imagen */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 opacity-50 group-hover:opacity-75 transition-opacity" /> */}
      </div>

      {/* Contenido de Texto (con padding y flex-grow para empujar precio abajo) */}
      <div className="flex flex-grow flex-col p-4 sm:p-5">
        <h3
          id={`product-title-${product.id}`}
          className="text-lg font-semibold leading-snug text-[--color-foreground]"
        >
          {name}
        </h3>
        <p className="mt-1 flex-grow text-sm leading-relaxed text-[--color-foreground-muted]">
          {description}
        </p>
        {/* Precio (siempre al final) */}
        <p className="mt-4 text-lg font-bold text-[--color-primary]">
          {formatPriceHNL(price)}
        </p>
        {/* Opcional: Botón Añadir/Consultar si se implementa lógica */}
        {/* <div className="mt-4">
          <Button variant="secondary" size="sm" className="w-full">Ver Detalles</Button>
        </div> */}
      </div>
    </article>
  );
}

// Exportación nombrada y por defecto
export default ProductCard;