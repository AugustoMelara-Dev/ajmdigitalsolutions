/* --- FILE: src/components/sections/HeroSection.jsx (v2 - CORREGIDO) --- */
/**
 * @file HeroSection.jsx — "El Jardín de la Abuela"
 * ... (resto de tus comentarios)
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/ui/Section'; // Importa la v2
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';
import { Leaf, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const HERO_IMAGE_SRC = '/images/hero-jabones-placeholder.jpg';
const HERO_IMAGE_ALT =
  'Colección de jabones artesanales El Jardín de la Abuela rodeados de ingredientes naturales';

export default function HeroSection() {
  const catalogHref = '#catalogo';
  const orderHref = '#pedido';

  return (
    <Section
      id="inicio"
      aria-label="Introducción a El Jardín de la Abuela"
      // --- ¡AQUÍ ESTÁ EL ARREGLO! ---
      // 1. Usa la nueva prop 'bg' para poner el fondo 'crema'
      // 2. Mantiene las clases de padding (pt-...) y overflow
      bg="base" // <-- ¡ARREGLO #1!
      className={cn(
        'relative overflow-hidden',
        'pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36'
        // <-- ¡ARREGLO #2! Se quitó el 'bg-[--color-bg]' ROTO.
      )}
    >
      {/* Fondo decorativo suave con degradé (Esto está bien) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at top left, var(--color-primary), transparent 60%), radial-gradient(circle at bottom right, var(--color-accent), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Textura artesanal sutil (Esto está bien, si tienes la imagen) */}
      {/* <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-[0.04]"
        style={{
          backgroundImage: "url('/textures/paper-fibers.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
        }}
      /> */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Columna de Texto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <div className="mb-4 flex flex-wrap justify-center gap-2 lg:justify-start">
              <Badge tone="primary" icon={Leaf}>
                Ingredientes Naturales
              </Badge>
              <Badge tone="secondary">Hecho a Mano</Badge>
            </div>

            {/* Título Principal (H1) */}
            <h1
              className={cn(
                'text-4xl font-bold tracking-tight text-[--color-foreground] sm:text-5xl lg:text-6xl',
                'text-balance' // Mejora el balance de líneas
              )}
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >
              El Jardín de la Abuela:
              <span className="mt-2 block bg-gradient-to-r from-[--color-primary] to-[--color-accent] bg-clip-text text-transparent lg:mt-1">
                Jabones con Alma Natural
              </span>
            </h1>

            {/* Descripción */}
            <p
              className={cn(
                'mx-auto mt-6 max-w-xl text-lg leading-relaxed lg:mx-0',
                'text-[--color-foreground-muted]'
              )}
            >
              Descubre la caricia de la naturaleza en tu piel. Jabones artesanales
              elaborados con ingredientes puros y recetas familiares llenas de
              amor.
            </p>

            {/* Llamadas a la Acción (CTAs) - (Esto ya estaba bien) */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                href={catalogHref}
                variant="secondary"
                size="lg"
                trailingIcon={ShoppingBag}
                className="shadow-lg hover:shadow-xl transition-shadow"
                data-analytics-id="hero_cta_catalog"
              >
                Ver Catálogo
              </Button>
              <Button
                href={orderHref}
                variant="outline-primary"
                size="lg"
                trailingIcon={ArrowRight}
                data-analytics-id="hero_cta_order"
              >
                Hacer un Pedido
              </Button>
            </div>
          </motion.div>

          {/* Columna de Imagen (Esto estaba bien) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative aspect-[4/3] w-full max-w-lg justify-self-center lg:aspect-square lg:max-w-none"
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
              <Image
                src={HERO_IMAGE_SRC}
                alt={HERO_IMAGE_ALT}
                fill
                sizes="(max-width: 1023px) 90vw, 45vw"
                className="object-cover"
                priority // ¡IMPORTANTE para LCP!
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
/* --- END FILE --- */