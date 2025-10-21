/* --- FILE: src/components/ui/Button.jsx (v3 - ARREGLO DEFINITIVO) --- */
/**
 * @file Button.jsx
 * @description Componente de botón reutilizable, adaptado al tema.
 * @description AÑADIDO 'no-underline' para ganar la guerra de especificidad
 * contra los estilos globales de <a>.
 */
'use client';

import React from 'react';
import Link from 'next/link';

// --- Utilidad 'cn' local ---
const cn = (...xs) => xs.filter(Boolean).join(' ');

// --- ESTILOS BASE (ADAPTADOS) ---
const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl ' +
  'transition-[background,opacity,transform] duration-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] ' +
  'disabled:opacity-50 disabled:pointer-events-none min-h-[44px] ' +
  // --- ¡AQUÍ ESTÁ EL ARREGLO, MADRE MÍA! ---
  'no-underline hover:no-underline'; // Gana la guerra contra a:hover

// --- TAMAÑOS ---
const sizes = {
  sm: 'h-9 px-3 text-[clamp(.85rem,2.2vw,.95rem)]',
  md: 'h-11 px-4 text-[clamp(.9rem,2.4vw,1rem)]',
  lg: 'h-12 px-5 text-[clamp(1rem,2.6vw,1.125rem)]',
};

// --- VARIANTES (Estas ya estaban bien) ---
const variants = {
  /** Botón principal (Lavender Pink) */
  primary:
    'bg-[--color-primary] text-[--color-primary-fg] hover:opacity-90 active:opacity-95 ' +
    'shadow-lg shadow-[--color-primary]/20',

  /** Alternativa (ej. fondo crema claro, texto oscuro) */
  secondary:
    'bg-[--color-background-alt] text-[--color-foreground] hover:bg-[--color-background-hover] active:bg-[--color-border] ' +
    'border border-[--color-border]',

  /** Botón "blanco" sobre fondos de color */
  contrast:
    'bg-[--color-background] text-[--color-foreground] hover:bg-[--color-background-hover] active:bg-[--color-background-alt] ' +
    'shadow-lg shadow-black/10',

  /** Borde simple, sin fondo (NEUTRO/GRIS) */
  outline:
    'bg-transparent border border-[--color-border] text-[--color-foreground-muted] hover:bg-[--color-background-hover]',

  /** Borde simple, sin fondo (PRIMARIO/ROSA) */
  'outline-primary':
    'bg-transparent border border-[--color-primary] text-[--color-primary] hover:bg-[--color-primary-bg]/20',

  /** Solo texto, sin borde (ej. para "cancelar") */
  ghost:
    'bg-transparent text-[--color-primary] hover:bg-[--color-primary-bg]/20 active:bg-[--color-primary-bg]/30',

  /** Peligro/destruir (usa variable semántica) */
  destructive:
    'bg-[--color-destructive] text-[--color-destructive-fg] hover:opacity-90 active:opacity-95',

  /** Link simple (SIN LÍNEA) */
  link: 'bg-transparent text-[--color-primary] px-0 hover:opacity-80',
};

// --- COMPONENTE ---
export function Button({
  as = 'button',
  href,
  variant = 'primary',
  size = 'md',
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}) {
  const Comp = href ? Link : as;
  const classes = cn(base, sizes[size], variants[variant], className);

  return (
    <Comp
      href={href}
      className={classes}
      aria-label={ariaLabel}
      {...props}
    >
      {LeadingIcon ? (
        <LeadingIcon aria-hidden="true" className="-ml-0.5" />
      ) : null}
      <span className="whitespace-nowrap">{children}</span>
      {TrailingIcon ? (
        <TrailingIcon aria-hidden="true" className="-mr-0.5" />
      ) : null}
    </Comp>
  );
}
// --- END FILE ---