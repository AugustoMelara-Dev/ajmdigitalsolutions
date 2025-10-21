/* --- FILE: src/components/ui/Badge.jsx --- */
// Debe ser Client Component (se usa en interacciones/animaciones)
'use client';

import React, { forwardRef, memo } from 'react';
import { Sparkles as SparklesIcon } from 'lucide-react';

/**
 * Badge sobrio y reutilizable (production-ready).
 * - Dark mode con contraste AA.
 * - Tamaños: sm | md.
 * - Tonos: neutral | brand | sky | cyan | amber | rose | emerald.
 *   *Nota*: "brand" requiere color definido en Tailwind (theme.extend.colors.brand).
 * - Icono opcional (por defecto Sparkles) o "dot" de estado.
 * - Estados: selected, disabled (a nivel button y pseudo en anchor).
 * - Polimórfico: as="span" | "a" | "button".
 * - Accesibilidad: focus visible, aria-pressed en button toggle, aria-disabled en anchor/span.
 */

const TONES = {
  neutral:
    'border-slate-200 text-slate-700 bg-slate-50 ' +
    'dark:border-slate-700 dark:text-slate-200 dark:bg-slate-800/60',
  brand:
    'border-brand/30 text-brand bg-brand/5 ' +
    'dark:border-brand/30 dark:text-brand dark:bg-brand/10',
  sky:
    'border-sky-300/60 text-sky-800 bg-sky-50 ' +
    'dark:border-sky-700/60 dark:text-sky-300 dark:bg-sky-900/20',
  cyan:
    'border-cyan-300/60 text-cyan-800 bg-cyan-50 ' +
    'dark:border-cyan-700/60 dark:text-cyan-300 dark:bg-cyan-900/20',
  amber:
    'border-amber-300/60 text-amber-800 bg-amber-50 ' +
    'dark:border-amber-700/60 dark:text-amber-300 dark:bg-amber-900/20',
  rose:
    'border-rose-300/60 text-rose-800 bg-rose-50 ' +
    'dark:border-rose-700/60 dark:text-rose-300 dark:bg-rose-900/20',
  emerald:
    'border-emerald-300/60 text-emerald-800 bg-emerald-50 ' +
    'dark:border-emerald-700/60 dark:text-emerald-300 dark:bg-emerald-900/20',
};

const SIZES = {
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3 py-1.5 text-xs',
};

const base =
  'inline-flex items-center gap-2 rounded-full border font-medium leading-none ' +
  'whitespace-nowrap align-middle select-none transition-colors';

const interactive =
  // Nota: focus ring usa currentColor para no depender de "brand" en el theme
  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/35 ' +
  'hover:shadow-sm motion-safe:hover:translate-y-0.5 motion-safe:active:translate-y-0 ' +
  'motion-reduce:transition-none motion-reduce:transform-none';

const selectedCls = 'ring-1 ring-current/20';

// Polimórfico con fallback seguro:
// - href  => 'a'
// - as    => respeta lo que llega
// - onClick sin href => 'button'
// - default => 'span'
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
      tone = 'neutral',
      size = 'sm',
      icon: Icon = SparklesIcon,
      iconPosition = 'left', // 'left' | 'right'
      hideIcon = false,
      as, // 'span' | 'a' | 'button'
      href,
      selected = false, // chips/filters
      dot = false, // punto de estado en vez de icono
      dotLabel, // etiqueta accesible opcional para el dot
      disabled = false, // para button; en anchor se emula con aria-disabled + pointer-events-none
      className = '',
      ...rest
    },
    ref
  ) {
    const Tag = getTag(as, href, typeof rest.onClick === 'function');
    const palette = TONES[tone] ?? TONES.neutral;
    const sizing = SIZES[size] ?? SIZES.sm;

    const isLink = Tag === 'a';
    const isButton = Tag === 'button';
    const isInteractive = isLink || isButton;

    // Anchor "deshabilitado": sin href, aria-disabled, sin pointer events.
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

    const classes = [
      base,
      palette,
      sizing,
      isInteractive ? interactive : '',
      selected ? selectedCls : '',
      disabled ? 'opacity-50' : '',
      linkDisabled ? 'pointer-events-none' : '',
      isButton && disabled ? 'cursor-not-allowed' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

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
        className={classes}
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
