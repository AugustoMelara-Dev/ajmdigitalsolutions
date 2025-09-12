// --- FILE: src/components/ui/Step.jsx ---
'use client';

import React, { memo, forwardRef, useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFadeUp } from '@/hooks/useFadeUp';
import { Check, CircleDot } from 'lucide-react';

/**
 * Step — tarjeta de paso clara y accesible.
 *
 * Props:
 *  - as?: 'div' | 'li' | 'article' ... (default: 'div')
 *  - n?: string | number            → número/etiqueta del paso (si no hay icon)
 *  - icon?: React.ComponentType     → ícono opcional (lucide-react u otro)
 *  - title: React.ReactNode
 *  - desc?: React.ReactNode         → si se provee children, tiene prioridad
 *  - children?: React.ReactNode     → contenido libre debajo del título
 *  - status?: 'default' | 'active' | 'done'  (default: 'default')
 *  - size?: 'md' | 'lg'             (default: 'md')
 *  - href?: string                  → si se pasa, renderiza como <a>
 *  - target?: string                → opcional para el link
 *  - rel?: string                   → opcional para el link
 *  - interactive?: boolean          → hover/transform (auto true si hay href)
 *  - role?: string                  → por defecto 'listitem' si as !== 'li'
 *  - className?: string
 *  - onClick?: () => void
 *  - data-analytics?: string        → atributo para tracking
 */
const Step = memo(
  forwardRef(function Step(
    {
      as: As = 'div',
      n,
      icon: Icon,
      title,
      desc,
      children,
      status = 'default',
      size = 'md',
      href,
      target,
      rel,
      interactive,
      role,
      className = '',
      onClick,
      ...rest
    },
    ref
  ) {
    const reduce = useReducedMotion();
    const fade = useFadeUp();
    const headingId = useId();
    const descId = useId();

    const isLink = typeof href === 'string' && href.length > 0;
    const isInteractive = interactive ?? isLink ?? !!onClick;

    // Colores según estado
    const pillBase =
      'grid place-items-center rounded-full font-semibold border shrink-0';
    const pillSize = size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';

    const statusMap = {
      default: {
        pill: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
        title: 'text-slate-900 dark:text-slate-100',
        ring: 'focus-visible:ring-brand/40',
      },
      active: {
        pill: 'bg-brand/10 text-brand border-brand/30',
        title: 'text-slate-900 dark:text-slate-100',
        ring: 'focus-visible:ring-brand/50',
      },
      done: {
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/40',
        title: 'text-slate-900 dark:text-slate-100',
        ring: 'focus-visible:ring-emerald-400/40',
      },
    };

    const tone = statusMap[status] || statusMap.default;

    const cardBase = [
      'rounded-2xl border p-6',
      'bg-white border-slate-200 shadow-card',
      'dark:bg-slate-900 dark:border-slate-800',
      isInteractive
        ? 'transition will-change-transform hover:shadow-lg motion-safe:hover:-translate-y-0.5'
        : '',
      'focus:outline-none focus-visible:ring-2',
      tone.ring,
      size === 'lg' ? 'md:p-7' : '',
      className,
    ].join(' ');

    const HeadTag = 'div'; // dentro de la tarjeta, no forzamos <hN> para no romper jerarquías

    const content = (
      <motion.div
        {...fade}
        transition={reduce ? { duration: 0 } : undefined}
        ref={ref}
        className={cardBase}
        aria-labelledby={headingId}
        aria-describedby={desc || children ? descId : undefined}
        {...rest}
      >
        <div className="flex items-start gap-4">
          {/* Píldora con número o ícono */}
          <span className={[pillBase, pillSize, tone.pill].join(' ')} aria-hidden="true">
            {status === 'done' ? (
              <Check size={size === 'lg' ? 18 : 16} />
            ) : Icon ? (
              <Icon size={size === 'lg' ? 18 : 16} />
            ) : typeof n !== 'undefined' ? (
              n
            ) : (
              <CircleDot size={size === 'lg' ? 18 : 16} />
            )}
          </span>

          <div className="min-w-0">
            <HeadTag
              id={headingId}
              className={['font-semibold leading-snug', tone.title, size === 'lg' ? 'text-lg' : ''].join(' ')}
            >
              {title}
            </HeadTag>

            {children ? (
              <div id={descId} className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {children}
              </div>
            ) : desc ? (
              <p id={descId} className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {desc}
              </p>
            ) : null}
          </div>
        </div>
      </motion.div>
    );

    const commonLinkProps = isLink
      ? {
          href,
          target,
          rel:
            rel ??
            (href?.startsWith('http')
              ? 'noopener noreferrer'
              : undefined),
          role: role || (As !== 'li' ? 'listitem' : undefined),
        }
      : {
          role: role || (As !== 'li' ? 'listitem' : undefined),
          onClick,
          tabIndex: 0,
        };

    // Render como <a> si hay href, o como el elemento indicado en `as`
    if (isLink) {
      return (
        <As {...commonLinkProps} className="block group">
          {content}
        </As>
      );
    }

    return (
      <As {...commonLinkProps}>
        {content}
      </As>
    );
  })
);

export { Step };
export default Step;
