/* --- FILE: src/components/ui/Section.jsx (v2 - ARREGLADO Y TEMATIZADO) --- */
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
  if (As && typeof As ===_ === 'object' && typeof As.default === 'function')
    return As.default;
  return 'section';
}

function normalizeHeading(tag) {
  return tag === 'h1' || tag === 'h2' || tag === 'h3' ? tag : 'h2';
}

/**
 * Section — Contenedor de sección Nivel Senior.
 *
 * Props:
 * - bg?: 'base' | 'alt' | 'transparent'  (default: 'transparent')
 * ... (resto de props)
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
      // ✨ ¡NUEVA PROP! Define el color de fondo
      bg = 'transparent', // Default a transparente para no romper layouts
      // 👇 DEPRECATED
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

    // Contenedor
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

    // ✨ ¡MAPA DE FONDOS!
    // Mapea la prop 'bg' a las clases de 'tailwind.config.mjs'
    const bgMap = {
      base: 'bg-background', // Tu fondo 'crema'
      alt: 'bg-background-alt', // Tu fondo 'rosa claro'
      transparent: 'bg-transparent',
    };

    return (
      <As
        id={id}
        ref={setRefs}
        className={cn(
          padY,
          bgMap[bg], // <-- ¡AQUÍ SE APLICA EL FONDO!
          'scroll-mt-[var(--header-height,72px)]', // <-- ¡CORREGIDO!
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
                        // --- ¡CIRUGÍA DE ESTILO! ---
                        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide',
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
                          // --- ¡CIRUGÍA DE ESTILO! ---
                          'relative text-3xl sm:text-4xl font-bold tracking-tight leading-[1.25]',
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
                        // --- ¡CIRUGÍA DE ESTILO! ---
                        'mt-2 leading-relaxed',
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