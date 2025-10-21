// --- FILE: src/components/sections/AboutSection.jsx ---
/**
 * @file AboutSection.jsx
 * @description Sección "Nuestra Historia" para la landing page "El Jardín de la Abuela".
 * @description Presenta la historia y valores detrás del emprendimiento de jabones artesanales.
 * Adaptado desde AboutMeSection.jsx de ajmdigitalsolutions.
 * @requires react - Para creación de componentes.
 * @requires @/components/ui/Section - Componente base para secciones. Asume existencia.
 * @requires @/components/ui/Button - Componente botón reutilizable. Asume existencia.
 * @requires next/image - Para optimización de imágenes.
 * @requires lucide-react - Para iconos.
 * @requires @/lib/utils - Para `cn` (classnames). Asume existencia.
 */

'use client';

import React from 'react';
import Section from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
// Iconos más acordes a la temática: Naturaleza, Cuidado, Tradición
import { Leaf, HeartHandshake, Sprout, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils'; // Asume existencia

// --- Configuración e Imágenes ---

// Define aquí la ruta a una imagen representativa (ej. foto de las fundadoras, el taller, ingredientes)
const ABOUT_IMAGE_SRC = '/images/abuela-tia-placeholder.jpg'; // !! REEMPLAZAR !!
const ABOUT_IMAGE_ALT = 'Elaboración artesanal de jabones en El Jardín de la Abuela';

// --- Componente Principal ---

/**
 * Componente `AboutSection`.
 *
 * Muestra la historia, pasión y valores detrás del emprendimiento "El Jardín de la Abuela".
 * Utiliza un diseño de dos columnas en pantallas medianas y grandes, combinando texto e imagen.
 *
 * @returns {JSX.Element} El elemento <Section> con el contenido sobre la historia.
 */
export default function AboutSection() {
  return (
    <Section
      id="nosotros" // ID para anclaje de navegación
      aria-labelledby="about-heading"
      // Estilo: Fondo suave alternativo (ej. crema claro), padding estándar
      className={cn(
        'relative bg-[--color-background-alt] py-16 md:py-24', // Usar variables CSS del tema
        'overflow-hidden'
      )}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Columna de Imagen */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-[--color-secondary-border]/50 lg:aspect-square">
            {ABOUT_IMAGE_SRC ? (
              <Image
                src={ABOUT_IMAGE_SRC}
                alt={ABOUT_IMAGE_ALT}
                fill // Ocupa todo el contenedor div
                sizes="(max-width: 1023px) 90vw, 45vw" // Tamaños responsivos
                className="object-cover" // Asegura que la imagen cubra el espacio
                // `priority` podría ser true si esta sección está muy arriba,
                // pero generalmente no lo es. Dejar en false (lazy load).
                priority={false}
                placeholder="blur" // Efecto blur mientras carga
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==" // Placeholder muy pequeño
              />
            ) : (
              // Fallback si no hay imagen
              <div className="grid h-full w-full place-items-center bg-[--color-secondary-bg]">
                <span className="text-sm text-[--color-foreground-muted]">
                  Imagen de la historia
                </span>
              </div>
            )}
            {/* Opcional: Pequeño overlay degradado para integrar texto si es necesario */}
            {/* <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[--color-background-alt]/50 to-transparent" /> */}
          </div>

          {/* Columna de Texto */}
          <div className="text-left">
            <span
              className={cn(
                'mb-2 block text-sm font-semibold uppercase tracking-wider',
                'text-[--color-primary]' // Color primario para el "eyebrow"
              )}
            >
              Nuestra Esencia
            </span>
            <h2
              id="about-heading"
              className={cn(
                'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
                'text-[--color-foreground]' // Texto principal oscuro
              )}
            >
              Pasión por lo Natural, Cuidado Familiar
            </h2>
            {/* Párrafos con la historia (!! REEMPLAZAR CON HISTORIA REAL !!) */}
            <p className="mt-6 text-lg leading-relaxed text-[--color-foreground-muted]">
              "El Jardín de la Abuela" nació en nuestra cocina, entre risas y aromas naturales.
              Somos [Nombre Abuela] y [Nombre Tía], unidas por el amor a las recetas
              tradicionales y el deseo de crear productos que cuiden tu piel con la
              pureza de la naturaleza.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[--color-foreground-muted]">
              Cada jabón es elaborado a mano, en pequeños lotes, usando aceites vegetales,
              mantecas nutritivas y esencias botánicas. Creemos en la belleza de lo simple
              y en el poder sanador de lo natural.
            </p>

            {/* Puntos Clave / Valores (Adaptado de 'Metric') */}
            <ul className="mt-8 grid grid-cols-2 gap-4" role="list">
              <ValueItem icon={Leaf} label="Ingredientes Puros y Naturales" />
              <ValueItem icon={HeartHandshake} label="Hecho a Mano con Amor" />
              <ValueItem icon={Sprout} label="Recetas Tradicionales" />
              <ValueItem icon={ShoppingBag} label="Pequeños Lotes Frescos" />
            </ul>

            {/* CTA Secundario (Opcional, puede ir al catálogo) */}
            <div className="mt-10">
              <Button
                href="#catalogo" // Enlace a la sección del catálogo
                variant="secondary" // Variante que contraste suavemente
                size="md"
                // Añadir icono si se desea
              >
                Ver Nuestros Jabones
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// --- Subcomponente para los Puntos Clave ---

/**
 * Componente interno `ValueItem` para mostrar un valor o punto clave.
 * @param {object} props - Propiedades.
 * @param {LucideIcon} props.icon - Componente icono de Lucide.
 * @param {string} props.label - Texto del valor.
 * @returns {JSX.Element} El elemento <li> renderizado.
 */
function ValueItem({ icon: Icon, label }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-[--color-primary]/10 text-[--color-primary]">
        <Icon size={16} aria-hidden="true" strokeWidth={2} />
      </div>
      <span className="text-base font-medium text-[--color-foreground-muted]">
        {label}
      </span>
    </li>
  );
}