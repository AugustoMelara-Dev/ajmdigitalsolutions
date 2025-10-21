/* --- FILE: src/components/ui/Badge.jsx (CORREGIDO) --- */
/**
 * @file Badge.jsx
 * @description Badge reutilizable, adaptado al tema "El Jardín de la Abuela".
 * @description Usa variables CSS del tema y se eliminó el modo oscuro.
 */
'use client';

import React, { forwardRef, memo } from 'react'; // <-- ¡CORREGIDO!
import { Sparkles as SparklesIcon } from 'lucide-react';
// Asumiendo que cn existe en utils
import { cn } from '@/lib/utils';

// --- PALETA DE TONOS ADAPTADA AL TEMA ---
const TONES = {
  // Tono secundario/neutral (usa colores de fondo y borde del tema)
  secondary:
    'border-[--color-border] text-[--color-foreground-muted] bg-[--color-background-alt]',
  // Tono principal (usa el color primario del tema, ej. Lavender Pink)
  primary:
    'border-[--color-primary-border] text-[--color-primary] bg-[--color-primary-bg]/20',
  // Tono destructivo (usa variables semánticas)
  destructive:
    'border-transparent text-[--color-destructive-fg] bg-[--color-destructive]',
};
// --- FIN ADAPTACIÓN ---

const SIZES = {
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3 py-1.5 text-xs',
};

const base =
  'inline-flex items-center gap-2 rounded-full border font-medium leading-none ' +
  'whitespace-nowrap align-middle select-none transition-colors';

const interactive =
  // --- ADAPTADO: Anillo de foco del tema ---
  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] ' +
  'hover:shadow-sm motion-safe:hover:translate-y-0.5 motion-safe:active:translate-y-0 ' +
  'motion-reduce:transition-none motion-reduce:transform-none';

// --- ADAPTADO: Anillo de selección usa color primario ---
const selectedCls = 'ring-1 ring-[--color-primary]';

// Polimórfico con fallback seguro
function getTag(asProp, href, hasOnClick) {
  if (href) return 'a';
  if (asProp) return asProp;
  if (hasOnClick) return 'button';
  return 'span';
}

const Badge = memo(
  forwardRef(function Badge(
    {
      children,
      tone = 'secondary', // --- ADAPTADO: Default a 'secondary'
      size = 'sm',
      icon: Icon = SparklesIcon,
      iconPosition = 'left', // 'left' | 'right'
      hideIcon = false,
      as, // 'span' | 'a' | 'button'
      href,
      selected = false, // chips/filters
      dot = false, // punto de estado en vez de icono
      dotLabel, // etiqueta accesible opcional para el dot
      disabled = false,
      className = '',
      ...rest
    },
    ref
  ) {
    const Tag = getTag(as, href, typeof rest.onClick === 'function');
    const palette = TONES[tone] ?? TONES.secondary;
    const sizing = SIZES[size] ?? SIZES.sm;

    const isLink = Tag === 'a';
    const isButton = Tag === 'button';
    const isInteractive = isLink || isButton;

    const linkDisabled = isLink && disabled;
    const safeHref = isLink && !linkDisabled ? href : undefined;
    const relProps =
      isLink && rest?.target === '_blank' ? { rel: 'noopener noreferrer' } : {};

    // Ícono / Dot
    const showLeft = !hideIcon && iconPosition === 'left' && !dot;
    const showRight = !hideIcon && iconPosition === 'right' && !dot;

    const iconSize = size === 'sm' ? 14 : 16;
    const iconEl = (pos) =>
      (pos === 'left' && showLeft) || (pos === 'right' && showRight) ? (
        <Icon
          size={iconSize}
          aria-hidden="true"
          className="opacity-70 shrink-0"
        />
      ) : null;

    const dotEl = dot ? (
      <>
        {dotLabel ? <span className="sr-only">{dotLabel}</span> : null}
        <span
          aria-hidden="true"
          className="inline-block w-2 h-2 rounded-full bg-current/70"
        />
      </>
    ) : null;

    const classes = cn(
      base,
      palette,
      sizing,
      isInteractive ? interactive : '',
      selected ? selectedCls : '',
      disabled ? 'opacity-50' : '',
      linkDisabled ? 'pointer-events-none' : '',
      isButton && disabled ? 'cursor-not-allowed' : ''
      // className se pasa desde cn()
    );

    // Props ARIA y nativos
    const ariaInteractive = isButton
      ? { type: 'button', 'aria-pressed': selected, disabled }
      : { 'aria-disabled': disabled || undefined };

    return (
      <Tag
        ref={ref}
        data-tone={tone}
        data-size={size}
        data-selected={selected ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        href={safeHref}
        className={cn(classes, className)} // cn aplicado aquí
        {...relProps}
        {...ariaInteractive}
        {...rest}
      >
        {iconPosition === 'left' && (dotEl || iconEl('left'))}
        <span className="truncate">{children}</span>
        {iconPosition === 'right' && (dotEl || iconEl('right'))}
      </Tag>
    );
  })
);

export { Badge };
export default Badge;
// --- END FILE ---