"use client";

/**
 * AJM Digital Solutions — PlansSection (PRO • sin scroll-appear)
 * - Una sola animación de entrada (fade-up al montar, ≤600ms)
 * - Respeta prefers-reduced-motion
 * - Sin framer-motion, sin whileInView
 * - Grid 1→3 cols, tipografía fluida con clamp(), CTAs ≥44px
 * - JSON-LD OfferCatalog
 * - content-visibility + containIntrinsicSize para evitar CLS
 */

import React, { useEffect, useMemo, useState } from "react";
import Section from "@/components/ui/Section";
import PriceCard from "@/components/cards/PriceCard"; // opcional; usamos fallback lite abajo
import { ShieldCheck, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { PLANS as IMPORTED_PLANS } from "@/lib/constants";

/* ───────────── Utils locales (sin '@/lib/utils') ───────────── */
const cn = (...xs) => xs.filter(Boolean).join(" ");
const makeWaUrl = (number, text, utm = {}) => {
  const d = String(number || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(d)) return null;
  const q = new URLSearchParams({ text: String(text || "") });
  for (const [k, v] of Object.entries(utm)) if (v) q.append(k, String(v));
  return `https://wa.me/${d}?${q.toString()}`;
};
const fmtUSD = (n) => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `USD $${n}`;
  }
};
const getPriceUSD = (plan) => {
  for (const k of ["priceUSD", "price", "from", "startingAt"]) {
    const v = plan?.[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const num = Number(v.replace(/[^0-9.]/g, ""));
      if (Number.isFinite(num) && num > 0) return num;
    }
  }
  return null;
};

/* ───────────── ENV ───────────── */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const WA_DEFAULT =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola AJM, vengo desde el sitio. Quiero una consulta sobre planes.";
const WA_HREF =
  makeWaUrl(RAW_PHONE, WA_DEFAULT, {
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "pricing",
  }) || "#contacto";

/* ───────────── Animación de entrada única (sin scroll) ───────────── */
function useEntranceAnimation(delay = 100) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    setPrefersReduced(Boolean(mq?.matches));
    const t = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return {
    className: prefersReduced
      ? "opacity-100"
      : cn(
          "transition-all duration-500 ease-out", // ≤600ms
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        ),
  };
}

/* ───────────── JSON-LD (OfferCatalog) ───────────── */
function PricingJsonLd({ plans = [] }) {
  const items = plans.map((p) => {
    const price = getPriceUSD(p);
    const base = { "@type": "Offer", name: p?.title || "Plan", url: WA_HREF };
    return typeof price === "number" ? { ...base, price, priceCurrency: "USD" } : base;
  });
  const json = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "AJM Digital Solutions — Pricing Plans",
    itemListElement: items,
    provider: { "@type": "Organization", name: "AJM Digital Solutions" },
  };
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/* ───────────── Fallback plans (si no llegan por constants) ───────────── */
const FALLBACK_PLANS = [
  {
    title: "Express",
    subtitle: "Landing lista en 72h. Ideal para campañas.",
    priceUSD: 160,
    badge: "Rápido",
    features: ["1 sección (scroll)", "Copy base + SEO on-page", "Integración WhatsApp", "Entrega en 72h"],
    popular: false,
  },
  {
    title: "Corporativo",
    subtitle: "Sitio 4–6 secciones, imagen sólida.",
    priceUSD: 320,
    features: ["Arquitectura clara", "SEO técnico inicial", "Formularios/CTAs", "Blog opcional"],
    popular: true,
  },
  {
    title: "Pro",
    subtitle: "E-commerce o web a medida.",
    priceUSD: 560,
    badge: "Escalable",
    features: ["Pasarela de pago", "Panel admin", "Analítica avanzada", "Capacitación"],
    popular: false,
  },
];

/* ───────────── Card lite (sin animación interna) ───────────── */
function PriceCardLite({ title, subtitle, priceUSD, features = [], popular, badge }) {
  const showBadge = Boolean(badge) && !popular;
  return (
    <article
      className={cn(
        "relative h-full rounded-2xl border border-white/10 bg-white/5",
        "p-5 pt-12 sm:p-6 sm:pt-14",
        "backdrop-blur-sm shadow-[0_12px_35px_rgba(0,0,0,.30)]",
        "transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]",
        popular && "ring-1 ring-[var(--ajm-accent)]/60"
      )}
    >
      {/* Pills */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2 sm:right-4 sm:top-4">
        {showBadge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-[3px] text-[10px] font-semibold text-ajm-white ring-1 ring-white/20 sm:px-2.5 sm:py-1 sm:text-[11px]">
            <Sparkles size={12} /> {badge}
          </span>
        )}
        {popular && (
          <span
            aria-label="Más elegido"
            className="rounded-full bg-[var(--ajm-accent)]/20 px-2 py-[3px] text-[10px] font-semibold text-ajm-white ring-1 ring-[var(--ajm-accent)]/40 sm:px-2.5 sm:py-1 sm:text-[11px]"
          >
            Más elegido
          </span>
        )}
      </div>

      {/* Header */}
      <header>
        <h3 className="text-[clamp(1.125rem,3vw,1.25rem)] font-bold text-ajm-white">{title}</h3>
        {subtitle && <p className="mt-1 text-[clamp(0.95rem,2.3vw,1rem)] leading-relaxed text-ajm-ink">{subtitle}</p>}
      </header>

      {/* Price */}
      <div className="mt-4">
        {typeof priceUSD === "number" ? (
          <div className="text-ajm-white">
            <span className="tabular-nums font-extrabold text-[clamp(1.75rem,3.5vw,2.5rem)]">{fmtUSD(priceUSD)}</span>
            <span className="ml-1 text-[clamp(0.85rem,2vw,0.95rem)] text-ajm-ink">USD</span>
          </div>
        ) : (
          <div className="text-[clamp(0.95rem,2.3vw,1rem)] text-ajm-ink">Precio según alcance</div>
        )}
      </div>

      {/* Features */}
      {!!features.length && (
        <ul className="mt-4 flex-1 space-y-2 text-[clamp(0.95rem,2.3vw,1rem)] text-ajm-ink">
          {features.slice(0, 8).map((f) => (
            <li key={f} className="relative pl-5 break-words">
              <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[var(--ajm-accent)]/80" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <div className="mt-6">
        <a
          href={WA_HREF}
          target={WA_HREF.startsWith("https://wa.me/") ? "_blank" : undefined}
          rel={WA_HREF.startsWith("https://wa.me/") ? "noopener noreferrer nofollow" : undefined}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl font-semibold",
            "px-5 py-3 min-h-[44px]",
            "bg-white text-[#0A1525] shadow-lg hover:shadow-xl transition-[box-shadow,background-color] duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)] focus:ring-offset-2 focus:ring-offset-[var(--ajm-bg)]",
            "motion-reduce:transition-none"
          )}
          aria-label={`Solicitar plan ${title}`}
        >
          Solicitar plan <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

/* ───────────── Componente ───────────── */
export default function PlansSection() {
  // Datos de planes
  const PLANS = useMemo(() => {
    const src = Array.isArray(IMPORTED_PLANS) ? [...IMPORTED_PLANS] : FALLBACK_PLANS;
    // Mantén el "popular" centrado si existe (solo estética, no cambia DOM order real)
    return src;
  }, []);
  const minPrice = useMemo(() => {
    const nums = PLANS.map(getPriceUSD).filter((n) => typeof n === "number");
    return nums.length ? Math.min(...nums) : null;
  }, [PLANS]);

  // Animación de entrada única (sección completa)
  const { className: enterClass } = useEntranceAnimation(100);

  return (
    <Section
      id="planes"
      title="Planes transparentes"
      subtitle="Elige tu plan y empieza a generar clientes desde tu web. Precios fijos, sin letra pequeña."
      className="relative bg-[var(--ajm-bg)]"
    >
      {/* Fondo premium muy ligero (estático, GPU-friendly) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 20% 20%, rgba(58,151,212,.10), transparent 50%), radial-gradient(50rem 30rem at 80% 30%, rgba(100,255,214,.08), transparent 55%)",
          maskImage: "radial-gradient(120rem 80rem at 50% 18%, rgba(0,0,0,.9), transparent 70%)",
        }}
      />

      {/* JSON-LD */}
      <PricingJsonLd plans={PLANS} />

      {/* Wrapper animado UNA SOLA VEZ */}
      <div className={enterClass} style={{ contentVisibility: "auto", containIntrinsicSize: "0 900px" }}>
        {/* “Desde …” si hay precios */}
        {typeof minPrice === "number" && (
          <p className="mb-6 text-center text-[clamp(0.9rem,2vw,1rem)] text-ajm-muted" aria-live="polite">
            Desde <span className="font-semibold text-ajm-ink tabular-nums">{fmtUSD(minPrice)}</span>
          </p>
        )}

        {/* Grid responsive (alturas iguales con items-stretch + h-full) */}
        <div
          role="list"
          aria-label="Lista de planes"
          className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 sm:gap-7 md:grid-cols-3 lg:gap-8"
        >
          {PLANS.map((plan, i) => (
            <div key={plan?.title || i} role="listitem" className="h-full">
              {/** Si quieres usar tu PriceCard con animaciones, reemplaza la línea siguiente:
               *   <PriceCard {...plan} />
               * Por política de una sola animación por sección, usamos el lite sin animación interna:
               */}
              <PriceCardLite {...plan} />
            </div>
          ))}
        </div>

        {/* Franja de garantía + CTA secundaria */}
        <div className="mt-12 text-center">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-6 py-3",
              "bg-white/8 backdrop-blur-sm border border-white/10",
              "shadow-xl shadow-ajm-bg/20"
            )}
          >
            <ShieldCheck className="text-[var(--ajm-accent)]" size={20} aria-hidden="true" />
            <span className="font-semibold text-ajm-ink">
              Incluye soporte directo, optimización de rendimiento y SEO on-page.
            </span>
          </div>

          <div className="mt-8">
            <a
              href={WA_HREF}
              target={WA_HREF.startsWith("https://wa.me/") ? "_blank" : undefined}
              rel={WA_HREF.startsWith("https://wa.me/") ? "noopener noreferrer nofollow" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl font-semibold",
                "px-5 py-3 min-h-[44px]",
                "bg-white text-[#0A1525] shadow-lg hover:shadow-xl transition-[box-shadow,background-color] duration-200",
                "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)] focus:ring-offset-2 focus:ring-offset-[var(--ajm-bg)]",
                "motion-reduce:transition-none"
              )}
              data-analytics-id="plans_whatsapp_cta"
            >
              <MessageCircle size={18} aria-hidden="true" />
              ¿Dudas sobre el plan ideal? Hablemos
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
