/* --- FILE: components/sections/PlansSection.jsx --- */
"use client";

/**
 * AJM Digital Solutions — PlansSection (PRO, parejo y confiable)
 * - Tarjetas con mismas alturas y CTA al fondo
 * - Badges consistentes (lucide-react)
 * - Nota * automática si hay priceSuffix (“+”)
 */

import React, { useEffect, useMemo, useState } from "react";
import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { MessageCircle, ShieldCheck, TrendingUp, Clock, ShoppingCart } from "lucide-react";

/* Utils */
const cn = (...xs) => xs.filter(Boolean).join(" ");

function useEntranceAnimation(delay = 120) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const t = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return {
    className: prefersReduced
      ? "opacity-100"
      : cn(
          "transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        ),
  };
}

function makeWaUrl(number, text, utm = {}) {
  const d = String(number || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(d)) return null;
  const q = new URLSearchParams({ text: String(text || "") });
  for (const [k, v] of Object.entries(utm)) if (v) q.append(k, String(v));
  return `https://wa.me/${d}?${q.toString()}`;
}

const getPriceHNL = (plan) => {
  const v = plan?.priceHNL;
  return typeof v === "number" && Number.isFinite(v) ? v : null;
};

const fmtHNL = (n) => {
  try {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `L ${n}`;
  }
};

/* ENV */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const WA_DEFAULT = "Hola AJM. Quiero empezar con un plan. ¿Qué sigue para arrancar?";
const WA_HREF =
  makeWaUrl(RAW_PHONE, WA_DEFAULT, {
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "pricing",
  }) || "#contacto";

/* Copy orientado a resultado */
const PLANS_DATA = [
  {
    title: "Landing Page",
    subtitle:
      "En 7 días pasas de invisible a elegido. Optimizada para que te encuentren y te escriban por WhatsApp.",
    priceHNL: 6500,
    badge: "Entrega rápida",
    deliveryTime: "Entrega en ~7 días hábiles",
    features: [
      "Dominio y hosting rápido por 1 año",
      "Apareces en Google por tu servicio y zona",
      "WhatsApp visible que convierte visitas en mensajes",
      "Testimonios que dan confianza",
      "Textos que venden por ti 24/7",
    ],
    popular: false,
    ctaLabel: "Quiero empezar",
  },
  {
    title: "Sitio Corporativo",
    subtitle:
      "Imagen seria que justifica mejores precios y abre puertas. Tu marca luce como empresa.",
    priceHNL: 9500,
    deliveryTime: "Entrega en ~14 días hábiles",
    popular: true,
    features: [
      "Dominio y hosting rápido por 1 año",
      "Inicio, Servicios, Nosotros, Casos y Contacto",
      "Estructura lista para posicionar en Google",
      "Diseño que transmite valor",
      "Formulario/WhatsApp para captar consultas",
    ],
    ctaLabel: "Quiero verme profesional",
  },
  {
    title: "Tienda en Línea",
    subtitle:
      "Vende mientras duermes: catálogo, pagos y notificaciones. Operativa en 21 días.",
    priceHNL: 16000,
    priceSuffix: "+",
    badge: "E-commerce",
    deliveryTime: "Operativa en ~21 días hábiles",
    features: [
      "Dominio y hosting rápido por 1 año",
      "Catálogo con filtros y búsqueda",
      "Carrito y checkout que convierten",
      "Pasarela de pago e informes",
      "Notificaciones a tu WhatsApp",
    ],
    popular: false,
    ctaLabel: "Quiero vender 24/7",
  },
];

/* JSON-LD */
function PricingJsonLd({ plans }) {
  const items = plans.map((p) => {
    const price = getPriceHNL(p);
    const base = { "@type": "Offer", name: p?.title || "Plan", url: WA_HREF };
    return typeof price === "number"
      ? { ...base, price, priceCurrency: "HNL", availability: "https://schema.org/InStock" }
      : base;
  });
  const json = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "AJM Digital Solutions — Planes de Inversión",
    itemListElement: items,
    provider: { "@type": "Organization", name: "AJM Digital Solutions" },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/* Tarjeta compacta, alturas iguales y CTA al fondo */
function PriceCardLite({
  title,
  subtitle,
  priceHNL,
  priceSuffix,
  features = [],
  popular,
  badge,
  deliveryTime,
  ctaLabel,
}) {
  const planHref =
    makeWaUrl(
      RAW_PHONE,
      `Hola AJM. Quiero empezar con el plan ${title}. ¿Qué sigue para arrancar?`,
      {
        utm_source: "landing",
        utm_medium: "cta",
        utm_campaign: "pricing",
        utm_content: title.toLowerCase().replace(/\s+/g, "-"),
      }
    ) || WA_HREF;
  const planIsExternal = planHref?.startsWith("https://wa.me/");

  // Icono coherente por tipo de badge
  const badgeLower = (badge || "").toLowerCase();
  const BadgeIcon = badgeLower.includes("e-commerce") ? ShoppingCart : Clock;

  return (
    <article
      className={cn(
        "relative h-full min-h-[420px] sm:min-h-[440px]",
        "rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm",
        "p-4 sm:p-5 lg:p-6",
        "shadow-[0_10px_28px_rgba(0,0,0,.22)]",
        "grid grid-rows-[auto_auto_1fr_auto] gap-3",
        popular && "ring-2 ring-ajm-accent/75"
      )}
    >
      {/* Badges */}
      {(badge || popular) && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          {badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-[3px] text-[10px] font-semibold text-ajm-white ring-1 ring-white/20">
              <BadgeIcon size={12} /> {badge}
            </span>
          )}
          {popular && (
            <span
              aria-label="Más elegido"
              className="rounded-full bg-ajm-accent px-2 py-[3px] text-[10px] font-bold text-ajm-bg ring-1 ring-ajm-accent/40"
            >
              MÁS ELEGIDO
            </span>
          )}
        </div>
      )}

      {/* 1) Header */}
      <header>
        <h3 className="text-[clamp(1.05rem,2.2vw,1.22rem)] font-bold text-ajm-white">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-[clamp(0.92rem,2vw,0.98rem)] leading-relaxed text-ajm-ink">
            {subtitle}
          </p>
        )}
      </header>

      {/* 2) Precio + entrega */}
      <div className="text-ajm-white">
        {typeof priceHNL === "number" ? (
          <>
            <span className="tabular-nums font-extrabold text-[clamp(1.45rem,2.8vw,2rem)]">
              {fmtHNL(priceHNL)}
              {priceSuffix && <span className="text-base align-super">{priceSuffix}</span>}
            </span>
            {deliveryTime && (
              <div className="mt-0.5 text-[0.85rem] text-ajm-accent font-medium">🚀 {deliveryTime}</div>
            )}
          </>
        ) : (
          <span className="text-[clamp(0.9rem,2vw,0.98rem)] text-ajm-ink">Precio a medida</span>
        )}
      </div>

      {/* 3) Features (ocupan el espacio flexible) */}
      <ul className="space-y-1.5 text-[clamp(0.9rem,2vw,0.98rem)] text-ajm-ink">
        {features.slice(0, 6).map((f, i) => (
          <li key={`${i}-${f}`} className="relative pl-4 break-words">
            <span className="absolute left-0 top-[0.55rem] h-1.5 w-1.5 rounded-full bg-ajm-accent/80" aria-hidden />
            {f}
          </li>
        ))}
      </ul>

      {/* 4) CTA (siempre al fondo y mismo tamaño) */}
      <div className="mt-1">
        <Button
          href={planHref}
          variant={popular ? "contrast" : "outline"}
          size="lg"
          className="w-full justify-center text-ajm-white"
          leadingIcon={MessageCircle}
          target={planIsExternal ? "_blank" : undefined}
          rel={planIsExternal ? "noopener noreferrer nofollow" : undefined}
          aria-label={`Iniciar con plan ${title}`}
        >
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}

/* Skeleton */
function PriceSkeleton() {
  return (
    <div className="h-full min-h-[420px] rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg grid grid-rows-[auto_auto_1fr_auto] gap-3">
      <div className="h-5 w-1/2 rounded bg-white/10 animate-pulse" />
      <div className="h-7 w-28 rounded-xl bg-white/10 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
    </div>
  );
}

/* Principal */
export default function PlansSection() {
  const { className: entrance } = useEntranceAnimation(120);
  const PLANS = useMemo(() => [...PLANS_DATA], []);
  const [loading] = useState(false);

  const showFootnote = PLANS.some((p) => p.priceSuffix);

  return (
    <Section
      id="planes"
      title="Una Inversión Inteligente para tu Crecimiento"
      subtitle="Soluciones claras para cada etapa de tu negocio en Honduras. Sin sorpresas, solo resultados."
      className={cn("relative bg-ajm-bg", "py-12 sm:py-16 md:py-20 lg:py-24", entrance)}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 1100px" }}
    >
      {/* Fondo sobrio */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 20% 20%, rgba(58,151,212,.10), transparent 50%), radial-gradient(50rem 30rem at 80% 30%, rgba(100,255,214,.08), transparent 55%)",
          maskImage:
            "radial-gradient(120rem 80rem at 50% 18%, rgba(0,0,0,.9), transparent 70%)",
        }}
      />

      <PricingJsonLd plans={PLANS} />

      {/* Mensaje directo */}
      <div className="mb-8 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
          <TrendingUp className="text-ajm-accent" size={20} />
          <p className="text-sm text-ajm-ink font-medium">
            Hoy mismo te buscan en Google. Si no te encuentran, <strong>le escriben a otro</strong>.
            Empecemos esta semana.
          </p>
        </div>
      </div>

      {/* GRID — tarjetas parejas */}
      <div
        role="list"
        aria-label="Lista de planes"
        className={cn(
          "w-full mx-auto max-w-7xl",
          "px-4 sm:px-6 lg:px-8",
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch",
          "gap-3 sm:gap-4"
        )}
      >
        {loading
          ? [...Array(3)].map((_, i) => <PriceSkeleton key={i} />)
          : PLANS.map((plan) => (
              <div key={plan.title} role="listitem" className="h-full">
                <PriceCardLite {...plan} />
              </div>
            ))}
      </div>

      {/* Nota de asterisco si aplica + nota de tiempos */}
      {showFootnote && (
        <>
          <p className="mt-3 text-center text-[11px] text-ajm-ink px-4">
            * El precio puede variar según alcance, integraciones y número de productos.
          </p>
          <p className="mt-1 text-center text-[11px] text-ajm-ink px-4">
            Los tiempos son estimados y comienzan cuando recibimos todo el contenido (textos, logos e imágenes).
          </p>
        </>
      )}

      {/* Reglas claras (transparencia de renovación) */}
      <div className="mt-10 text-center max-w-4xl mx-auto px-4">
        <div
          className={cn(
            "inline-flex flex-col sm:flex-row items-center gap-3 rounded-2xl",
            "p-4 sm:p-5",
            "bg-white/8 backdrop-blur-sm border border-white/10 shadow-xl"
          )}
        >
          <ShieldCheck className="text-ajm-accent shrink-0" size={24} aria-hidden="true" />
          <p className="font-semibold text-[clamp(0.9rem,2.3vw,1rem)] text-ajm-ink text-center sm:text-left">
            <strong className="text-ajm-white block sm:inline">Reglas Claras:</strong>{" "}
            2 rondas de revisión. Incluimos tu <strong>dominio y hosting de alta velocidad</strong> por todo el primer año.
            Para que no te lleves sorpresas, la renovación anual a partir del segundo año tiene un{" "}
            <strong>costo fijo y accesible de L 1,200</strong>.
          </p>
        </div>
      </div>
    </Section>
  );
}
