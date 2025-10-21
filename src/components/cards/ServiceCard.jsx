'use client';

/**
 * ServiceCard (PRO • lite)
 * - Sin framer-motion ni hooks → evita doble animación por sección
 * - Tipografía fluida (clamp), hover sutil (≤200ms) y focus visible
 * - CTA touch-friendly (min-h 44px), accesible y robusto
 * - Sin '@/lib/utils' → util local `cn`
 * - WhatsApp E.164 (solo dígitos) + fallback a #contacto
 */

import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

/* Utils locales */
const cn = (...xs) => xs.filter(Boolean).join(' ');
const makeWaUrl = (number, text, utm = {}) => {
  const d = String(number || '').replace(/\D/g, '');
  if (!/^\d{7,15}$/.test(d)) return null; // E.164 sin '+'
  const q = new URLSearchParams({ text: String(text || '') });
  for (const [k, v] of Object.entries(utm)) if (v) q.append(k, String(v));
  return `https://wa.me/${d}?${q.toString()}`;
};

/* ENV */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || '').replace(/\D/g, '');
const BASE_MSG =
  process.env.NEXT_PUBLIC_WA_MESSAGE || 'Hola, vengo desde el sitio. Quiero información.';
const WA_HREF =
  makeWaUrl(RAW_PHONE, BASE_MSG, {
    utm_source: 'landing',
    utm_medium: 'cta',
    utm_campaign: 'services',
  }) || '#contacto';

const ServiceCard = React.memo(function ServiceCard({
  icon: Icon = CheckCircle2,
  title,
  desc,
  points = [],
  time,
  popular,
  className = '',
}) {
  const hasWa = WA_HREF && WA_HREF.startsWith('https://wa.me/');

  return (
    <article
      aria-labelledby={`${title || 'servicio'}-heading`}
      className={cn(
        // Base premium coherente con el sistema
        'rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm',
        'shadow-[0_12px_35px_rgba(0,0,0,.30)]',

        // Micro-interacciones sutiles (≤200ms)
        'transition-[box-shadow,transform] duration-200',
        'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]',

        // A11y: focus visible
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ajm-accent)]/40',
        className
      )}
    >
      {/* Header: icono + pills */}
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--ajm-accent)]/10 text-[var(--ajm-accent)]">
          <Icon size={22} aria-hidden="true" />
        </div>

        <div className="flex gap-2">
          {popular && (
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-semibold text-ajm-white">
              Más elegido
            </span>
          )}
          {time && (
            <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-xs font-semibold text-ajm-ink">
              {time}
            </span>
          )}
        </div>
      </div>

      {/* Título + descripción */}
      <h3
        id={`${title || 'servicio'}-heading`}
        className="mt-3 text-[clamp(1.1rem,3vw,1.25rem)] font-bold leading-snug text-ajm-white"
      >
        {title}
      </h3>
      {desc && (
        <p className="mt-1 text-[clamp(0.95rem,2.3vw,1rem)] leading-relaxed text-ajm-ink">
          {desc}
        </p>
      )}

      {/* Puntos/beneficios */}
      {Array.isArray(points) && points.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-[clamp(0.95rem,2.3vw,1rem)] text-ajm-ink">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--ajm-accent)]" size={16} aria-hidden="true" />
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <div className="mt-4">
        <a
          href={WA_HREF}
          target={hasWa ? '_blank' : undefined}
          rel={hasWa ? 'noopener noreferrer nofollow' : undefined}
          aria-label={`Solicitar información sobre ${title || 'este servicio'}`}
          aria-disabled={!hasWa}
          title={hasWa ? 'Solicitar información por WhatsApp' : 'Ir a contacto'}
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold',
            'min-h-[44px]',
            hasWa
              ? 'bg-[var(--ajm-accent)] text-[var(--ajm-bg)] shadow-lg hover:shadow-xl transition-[box-shadow,background-color] duration-200'
              : 'cursor-not-allowed bg-white/10 text-ajm-muted'
          )}
          data-analytics-id="service_card_cta"
        >
          Solicitar información <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
});

export default ServiceCard;
