/* --- FILE: src/components/ui/FaqItem.jsx --- */
// Debe ser Client Component (interacciones/animaciones)
'use client';

import React, { useId, memo, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFadeUp } from '@/hooks/useFadeUp';
import { ChevronDown } from 'lucide-react';

/**
 * Props:
 * - q: React.ReactNode | string    → pregunta
 * - a: React.ReactNode | string    → respuesta
 * - defaultOpen?: boolean          → abre por defecto
 * - idSuffix?: string              → usar para anclajes (#faq-idSuffix)
 * - className?: string
 * - onToggle?(open: boolean): void → callback para analítica
 */
const FaqItem = memo(function FaqItem({
  q,
  a,
  defaultOpen = false,
  idSuffix,
  className = '',
  onToggle,
}) {
  const fadeUp = useFadeUp();
  const reduceMotion = useReducedMotion();
  const summaryId = useId();
  const contentId = useId();
  const detailsRef = useRef(null);

  // Emite callback + evento custom al abrir/cerrar
  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;

    const handler = () => {
      const open = el.open;
      onToggle?.(open);
      // Evento custom burbujeable para listeners de más arriba
      try {
        el.dispatchEvent(
          new CustomEvent('faq:toggle', {
            detail: { open },
            bubbles: true,
            composed: true,
          })
        );
      } catch {}
    };

    el.addEventListener('toggle', handler);
    return () => el.removeEventListener('toggle', handler);
  }, [onToggle]);

  // Si llega un hash que coincide (#faq-xxx), abrir y enfocar
  const anchorId = idSuffix ? `faq-${idSuffix}` : undefined;
  useEffect(() => {
    if (!anchorId) return;
    try {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (hash === `#${anchorId}` && detailsRef.current) {
        const d = detailsRef.current;
        if (!d.open) d.open = true;
        // Enfocar el summary para accesibilidad
        const sum = d.querySelector('summary');
        if (sum && typeof sum.focus === 'function') {
          setTimeout(() => sum.focus({ preventScroll: false }), 0);
        }
      }
    } catch {}
  }, [anchorId]);

  return (
    <motion.div
      {...fadeUp}
      id={anchorId}
      className={className}
      // Respeta "prefiere menos animaciones"
      transition={reduceMotion ? { duration: 0 } : undefined}
    >
      <details
        ref={detailsRef}
        open={defaultOpen}
        className={[
          'group rounded-2xl border p-5 shadow-card transition-colors',
          'border-slate-200 bg-white focus-within:border-slate-300 open:border-slate-300',
          'dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-slate-700 dark:open:border-slate-700',
        ].join(' ')}
      >
        {/* Usamos un summary limpio (sin el marcador por defecto) */}
        <summary
          id={summaryId}
          aria-controls={contentId}
          className={[
            'flex items-start gap-3 cursor-pointer list-none select-none text-left',
            // Ring sobrio: no dependemos de un color de marca
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/35 rounded-xl p-1',
            'transition-colors',
          ].join(' ')}
        >
          <span
            className={[
              'mt-0.5 grid place-items-center rounded-lg border p-1.5 transition-colors',
              'border-slate-200 bg-slate-50 text-slate-600',
              'group-open:text-slate-700',
              'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:group-open:text-slate-200',
            ].join(' ')}
            aria-hidden="true"
          >
            <ChevronDown
              size={16}
              className={[
                'transition-transform',
                reduceMotion ? '' : 'duration-200',
                'group-open:rotate-180',
              ].join(' ')}
              aria-hidden="true"
            />
          </span>

          <span className="text-slate-900 dark:text-slate-100 font-semibold leading-snug">
            {q}
          </span>
        </summary>

        <div
          id={contentId}
          role="region"
          aria-labelledby={summaryId}
          className="mt-3"
        >
          <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {a}
          </div>
        </div>
      </details>
    </motion.div>
  );
});

/**
 * FaqJsonLd — Datos estructurados para SEO (FAQPage).
 * Espera faqs: Array<{ q: string; a: string }>
 * Recomendación: pasar texto plano en 'a'. Si viniera HTML, se intenta limpiar.
 */
export function FaqJsonLd({ faqs }) {
  const stripTags = (s) =>
    typeof s === 'string' ? s.replace(/<[^>]+>/g, '') : String(s ?? '');

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map((f) => ({
      '@type': 'Question',
      name: stripTags(f.q),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // stringify garantiza escapado seguro
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export { FaqItem };
export default FaqItem;
