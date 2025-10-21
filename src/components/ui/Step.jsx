/* --- FILE: src/components/ui/Section.jsx --- */
/**
 * @file Section.jsx
 * @description Contenedor de sección accesible, responsivo y adaptado al tema.
 * @description Adaptado para "El Jardín de la Abuela": colores tematizados,
 * sin modo oscuro y con corrección de anclaje para --header-height.
 */
'use client';

import React, { forwardRef, memo, useEffect, useId, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFadeUp } from '@/hooks/useFadeUp';
// Asumiendo que cn existe en utils
import { cn } from '@/lib/utils';

/* =========================
   Helpers robustos
   ========================= */
function normalizeAs(As) {
  if (typeof As === 'string' || typeof As === 'function') return As;
  if (As && typeof As === 'object' && typeof As.default === 'function')
    return As.default;
  return 'section';
}

function normalizeHeading(tag) {
  return tag === 'h1' || tag === 'h2' || tag === 'h3' ? tag : 'h2';
}

/**
 * Section — contenedor accesible, SSR-safe y ultra-responsivo.
 *
 * Props:
 * - id?: string
 * - as?: keyof JSX.IntrinsicElements | React.ComponentType  (default: 'section')
 * - title?: React.ReactNode
 * - subtitle?: React.ReactNode
 * - eyebrow?: React.ReactNode
 * - align?: 'center' | 'left'                          (default: 'center')
 * - pad?: 'sm' | 'md' | 'lg'                           (default: 'lg')
 * - heading?: 'h1' | 'h2' | 'h3'                       (default: 'h2')
 * - container?: 'tight' | 'custom' | 'full'            (default: 'tight')
 * - contentGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg'   (default: 'md')
 * - headerAction?: React.ReactNode
 * - onInView?: (entry: IntersectionObserverEntry) => void
 * - className?, containerClassName?, headerClassName?
 */
const Section = memo(
  forwardRef(function Section(
    {
      id,
      as: asProp = 'section',
      title,
      subtitle,
      eyebrow,
      align = 'center',
      pad = 'lg',
      heading = 'h2',
      container = 'tight',
      contentGap = 'md',
      headerAction,
      onInView,
      // 👇 DEPRECATED: capturamos para que NO se filtre al DOM
      anchor, // eslint-disable-line no-unused-vars
      className = '',
      containerClassName = '',
      headerClassName = '',
      children,
      style,
      ...rest
    },
    ref
  ) {
    const reduceMotion = useReducedMotion();
    const fadeUp = useFadeUp() || {};
    const headingId = useId();
    const subtitleId = useId();
    const rootRef = useRef(null);

    const As = normalizeAs(asProp);
    const HeadingTag = normalizeHeading(heading);

    // Unir ref externa + interna
    const setRefs = (node) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    // Observer para analítica (SSR-safe)
    useEffect(() => {
      if (!onInView || !rootRef.current || typeof window === 'undefined') return;
      if (typeof IntersectionObserver === 'undefined') return;

      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) onInView(e);
        },
        { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
      );

      obs.observe(rootRef.current);
      return () => obs.disconnect();
    }, [onInView]);

    // Padding vertical
    const padY =
      pad === 'sm'
        ? 'py-12 md:py-14'
        : pad === 'md'
        ? 'py-16 md:py-20'
        : 'py-20 md:py-24';

    // Alineación
    const alignText = align === 'left' ? 'text-left' : 'text-center';

    // Contenedor (con fallbacks por si no tienes utilidades personalizadas)
    const containerMap = {
      tight: 'container-tight mx-auto max-w-5xl px-4 md:px-6',
      custom: 'container-custom',
      full: 'w-full max-w-none px-4 md:px-6',
    };
    const containerCls = containerMap[container] || containerMap.tight;

    // Gap entre header y contenido
    const gapMap = {
      none: 'mt-0',
      xs: 'mt-4 md:mt-5',
      sm: 'mt-6 md:mt-8',
      md: 'mt-8 md:mt-10',
      lg: 'mt-10 md:mt-12',
    };
    const gapCls = gapMap[contentGap] || gapMap.md;

    return (
      <As
        id={id}
        ref={setRefs}
        className={cn(
          padY,
          // *** CORRECCIÓN DE BUG ***
          // Usa --header-height (de Navbar.jsx) en lugar de --nav-h
          'scroll-mt-[var(--header-height,72px)]',
          className
        )}
        aria-labelledby={title ? headingId : undefined}
        aria-describedby={subtitle ? subtitleId : undefined}
        data-section={id || undefined}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '0 800px',
          ...style,
        }}
        {...rest}
      >
        <div className={cn(containerCls, containerClassName)}>
          {(title || subtitle || eyebrow || headerAction) && (
            <div
              className={cn(
                'mx-auto max-w-2xl',
                alignText,
                headerAction && align === 'left' ? 'md:max-w-none' : '',
                headerClassName
              )}
            >
              <div
                className={cn(
                  headerAction && align === 'left'
                    ? 'md:flex md:items-end md:justify-between md:gap-6'
                    : ''
                )}
              >
                <div className="min-w-0">
                  {eyebrow && (
                    <motion.p
                      {...fadeUp}
                      transition={reduceMotion ? { duration: 0 } : undefined}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide',
                        // --- ADAPTACIÓN DE TEMA ---
                        // Estilo de "badge" primario usando variables CSS
                        'border-[--color-primary-border] bg-[--color-primary-bg]/20 text-[--color-primary]',
                        'mb-2'
                      )}
                    >
                      {eyebrow}
                    </motion.p>
                  )}

                  {title && (
                    <motion.div
                      {...fadeUp}
                      transition={reduceMotion ? { duration: 0 } : undefined}
                      className={
                        align === 'left' ? '' : 'flex items-start justify-center'
                      }
                    >
                      <HeadingTag
                        id={headingId}
                        className={cn(
                          'relative text-3xl sm:text-4xl font-bold tracking-tight leading-[1.25]',
                          // --- ADAPTACIÓN DE TEMA ---
                          'text-[--color-foreground]'
                        )}
                      >
                        <span>{title}</span>
                      </HeadingTag>
                    </motion.div>
                  )}

                  {subtitle && (
                    <motion.p
                      id={subtitleId}
                      {...fadeUp}
                      transition={reduceMotion ? { duration: 0 } : undefined}
                      className={cn(
                        'mt-2 leading-relaxed',
                        // --- ADAPTACIÓN DE TEMA ---
                        'text-[--color-foreground-muted]',
                        align === 'left' ? '' : 'mx-auto'
                      )}
                    >
                      {subtitle}
                    </motion.p>
                  )}
                </div>

                {headerAction && (
                  <div
                    className={
                      align === 'left' ? 'mt-4 md:mt-0 shrink-0' : 'mt-6'
                    }
                  >
                    {headerAction}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contenido de la sección */}
          <div className={gapCls}>{children}</div>
        </div>
      </As>
    );
  })
);

export { Section };
export default Section;
// --- END FILE ---