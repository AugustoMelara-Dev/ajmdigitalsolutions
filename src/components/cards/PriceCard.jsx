'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useFadeUp } from '@/hooks/useFadeUp';

const cn = (...xs) => xs.filter(Boolean).join(' ');

// WhatsApp
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || '').replace(/\D/g, '');
const WA_DEFAULT =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  'Hola AJM. Quiero empezar con un plan. ¿Qué sigue para arrancar?';
const WA_HREF = RAW_PHONE
  ? `https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(WA_DEFAULT)}&utm_source=landing&utm_medium=cta&utm_campaign=pricing&utm_content=generic`
  : '#contacto';

const slug = (s = '') => String(s).toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '');
const waHrefFor = (title = 'un plan') => {
  if (!RAW_PHONE) return WA_HREF;
  const msg = `Hola AJM. Quiero avanzar con el plan ${title}. ¿Cuál es el siguiente paso?`;
  return `https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(msg)}&utm_source=landing&utm_medium=cta&utm_campaign=pricing&utm_content=${slug(title)}`;
};

function formatUSD(price) {
  if (typeof price === 'number' && Number.isFinite(price)) {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
    } catch { return `$${price}`; }
  }
  return price;
}

const PriceCard = memo(function PriceCard({ ribbon, title, price, features = [], popular = false, savings }) {
  const fadeUp = useFadeUp();
  const hasWA = Boolean(RAW_PHONE);

  return (
    <motion.div
      {...fadeUp}
      className={cn(
        'relative rounded-2xl border bg-white p-6 shadow-lg transition',
        popular ? 'ring-2 ring-blue-300/80 border-blue-200' : 'border-slate-200',
        'dark:bg-slate-900 dark:border-slate-800'
      )}
      data-popular={popular ? 'true' : 'false'}
    >
      {ribbon && (
        <span className="absolute -right-2 top-3 text-xs font-semibold rounded-full bg-blue-600 text-white px-3 py-1 z-10">
          {ribbon}
        </span>
      )}

      {savings && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Ahorra {savings}</span>
        </div>
      )}

      <h3 className="text-slate-900 dark:text-white font-semibold text-lg leading-snug">{title}</h3>

      <div className="mt-1 text-4xl font-bold text-slate-900 dark:text-white" aria-label={`Precio ${formatUSD(price)}`}>
        {formatUSD(price)}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Precios referenciales · Facturación en USD</p>

      <ul className="mt-4 space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <CheckCircle2 className="text-emerald-600 shrink-0" size={18} aria-hidden="true" />
            <span>{f}</span>
          </li>
        ))}
        <li className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <ShieldCheck className="text-emerald-600 shrink-0" size={18} aria-hidden="true" />
          <span>Hosting + SSL + dominio 1 año · Garantía de satisfacción 7 días</span>
        </li>
      </ul>

      <a
        href={waHrefFor(title)}
        aria-label={`Cotizar el plan ${title} — AJM Digital Solutions`}
        target={hasWA ? '_blank' : undefined}
        rel={hasWA ? 'nofollow noopener noreferrer' : undefined}
        title={hasWA ? 'Solicitar plan por WhatsApp' : 'Ir a contacto'}
        aria-disabled={!hasWA}
        className={cn(
          'inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl font-semibold border w-full justify-center transition',
          // ✅ foco de marca (sin “raya azul”)
          'focus:outline-none focus-visible:ring-2 ring-ajm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ajm-bg)]',
          popular
            ? hasWA
              ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500'
              : 'bg-slate-300 text-slate-600 border-slate-300 cursor-not-allowed'
            : hasWA
            ? 'text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            : 'bg-slate-300 text-slate-600 border-slate-300 cursor-not-allowed'
        )}
      >
        Solicitar plan <ArrowRight size={18} aria-hidden="true" />
      </a>
    </motion.div>
  );
});

export { PriceCard };
export default PriceCard;
