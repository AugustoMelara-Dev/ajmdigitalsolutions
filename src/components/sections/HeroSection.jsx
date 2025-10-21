/* --- FILE: src/components/sections/HeroSection.jsx --- */
"use client";

/*
  HERO con MÉTRICAS (listo prod)
  - Visual de valor: panel 2x2 de métricas (HTML/CSS; sin imágenes ni jank)
  - Copy claro para gente no técnica + tooltip técnico
  - Responsive: 1 columna en móvil, 2 columnas desde lg
  - Fold seguro en móvil (max-h en el panel) + 92svh para barras del navegador
  - Sin animaciones de scroll (LCP feliz)
  - Accesibilidad: gris del párrafo +15% de brillo con fallback
*/

import React, { useEffect, useState, memo } from "react";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  MessageCircle,
  ArrowRight,
  Star,
  TrendingUp,
  TrendingDown,
  Gauge,
  Timer,
  BarChart3,
} from "lucide-react";

const cn = (...xs) => xs.filter(Boolean).join(" ");

/* Copy */
const COPY = {
  badges: ["Entrega rápida", "Soporte personal", "Precios justos"],
  headline1: "Tu negocio merece una web",
  headline2: "que realmente funcione",
  subBefore:
    "Creamos sitios y tiendas online que ayudan a negocios como el tuyo a crecer. ",
  subStrong: "Diseño limpio, carga rápida y fácil de usar.",
  subAfter: " Te acompañamos en cada paso.",
  ctas: { primary: "Contactar ahora", secondary: "Ver Planes" },
  trust: "Trabajamos con PYMEs y emprendedores que quieren crecer online",
};

/* Ancla con fallback (SSR-safe) */
function useAnchorHref(preferred = "#contacto", fallback = "#faq") {
  const [href, setHref] = useState(preferred);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = preferred.replace("#", "");
    const exists = !!document.getElementById(id);
    setHref(exists ? preferred : fallback);
  }, [preferred, fallback]);
  return href;
}

/* Analytics seguro (no rompe si no hay gtag) */
function track(event, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
  } catch {}
}

/* Indicador de confianza */
function TrustIndicator({ children, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[clamp(0.9rem,2.2vw,1rem)] text-[color:var(--ajm-ink)]/90",
        className
      )}
      aria-live="polite"
    >
      <Star size={16} className="text-[var(--ajm-accent)] fill-[var(--ajm-accent)]" />
      <span>{children}</span>
    </div>
  );
}

/* ---------- MÉTRICAS ---------- */
const METRICS = [
  {
    label: "Se abre en",
    value: "1.3 s",
    delta: "-48%",
    goodDirection: "down",
    icon: Timer,
    title: "LCP: tiempo hasta que el contenido principal está visible",
  },
  {
    label: "Velocidad (Google)",
    value: "92 / 100",
    delta: "+25",
    goodDirection: "up",
    icon: Gauge,
    title: "PageSpeed de Google: puntaje de rendimiento",
  },
  {
    label: "Consultas",
    value: "+34%",
    delta: "+34%",
    goodDirection: "up",
    icon: BarChart3,
    title: "Consultas o solicitudes de contacto generadas",
  },
  {
    label: "Gente que se va",
    value: "-22%",
    delta: "-22%",
    goodDirection: "down",
    icon: TrendingDown,
    title: "Porcentaje que abandona sin interactuar (tasa de rebote)",
  },
];

function MetricCard({ label, value, delta, goodDirection = "up", icon: Icon, title }) {
  const isPositive =
    (goodDirection === "up" && (delta + "").includes("+")) ||
    (goodDirection === "down" && (delta + "").includes("-"));

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/12 ring-1 ring-white/10",
        "bg-white/[.045] p-4 sm:p-5 shadow-md"
      )}
      role="group"
      aria-label={label}
      title={title}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid place-items-center rounded-lg border border-white/10 bg-white/[.06] p-2 shrink-0">
            <Icon size={16} className="text-[var(--ajm-ink)]" aria-hidden="true" />
          </div>
          <span className="text-sm text-[color:var(--ajm-ink)] truncate">{label}</span>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
            isPositive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300",
            "border border-white/10"
          )}
          aria-label={`Variación ${delta}`}
        >
          <TrendIcon size={14} aria-hidden="true" />
          <span className="text-[11px] font-medium">{delta}</span>
        </div>
      </div>

      <div className="mt-2 text-2xl font-semibold text-[color:var(--ajm-white)]">
        {value}
      </div>
    </div>
  );
}

function MetricsPanel() {
  return (
    <section
      aria-label="Resultados típicos que entregamos"
      className="w-full max-w-[720px] mx-auto lg:mx-0"
    >
      <div
        className={cn(
          "rounded-3xl border border-white/12 ring-1 ring-white/10 bg-white/[.035]",
          "p-4 sm:p-5 shadow-md"
        )}
      >
        {/* Top: título mini + confianza */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-sm font-medium text-[color:var(--ajm-white)]/90">
            Resultados típicos en 30–60 días*
          </p>
          <span className="text-xs text-[color:var(--ajm-ink)]">Basado en proyectos reales</span>
        </div>

        {/* Grid de métricas: 2x2 desktop, 1x2 en móvil */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        <p className="mt-4 text-[11px] text-[color:var(--ajm-ink)]/80">
          *Resultados de referencia en proyectos similares. Variarán según tu sector,
          punto de partida y volumen de tráfico.
        </p>
      </div>
    </section>
  );
}

/* ---------- HERO ---------- */
function HeroSection() {
  const contactHref = useAnchorHref("#contacto", "#faq");
  const plansHref = useAnchorHref("#planes", "#proceso");

  return (
    <section
      id="hero"
      className={cn(
        "relative bg-[var(--ajm-bg)]",
        "py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24",
        "min-h-[92svh]"
      )}
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)",
        contentVisibility: "auto",
        containIntrinsicSize: "0 750px",
      }}
      aria-label="Propuesta de valor y contacto principal"
    >
      {/* Glow sutil y barato (sin animación) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(1000px 500px at 22% 18%, rgba(58,151,212,.12), transparent 60%)",
        }}
      />

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          "grid grid-cols-1 lg:grid-cols-2 items-center",
          "gap-8 sm:gap-10 lg:gap-16"
        )}
      >
        {/* Columna de texto */}
        <div className="text-center lg:text-left">
          {/* Chips semánticos */}
          <ul
            className="mb-6 flex flex-wrap gap-2 justify-center lg:justify-start"
            aria-label="Beneficios principales"
          >
            {COPY.badges.map((b) => (
              <li key={b}>
                <Badge tone="cyan">{b}</Badge>
              </li>
            ))}
          </ul>

          <h1
            className={cn(
              "text-balance font-extrabold tracking-tight text-[color:var(--ajm-white)] mb-4",
              "text-[clamp(2.5rem,6vw,3.5rem)] leading-[1.2] sm:leading-[1.25] lg:leading-[1.3]"
            )}
            style={{
              textShadow:
                "0 1px 0 rgba(255,255,255,.06), 0 10px 24px rgba(0,0,0,.35)",
            }}
          >
            {COPY.headline1}
            <span
              className="block bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
              style={{
                backgroundImage:
                  "var(--ajm-grad, linear-gradient(180deg,#7dd3fc 0%,#38bdf8 60%,#0ea5e9 100%))",
                filter: "drop-shadow(0 10px 28px rgba(56,189,248,.28))",
              }}
            >
              {COPY.headline2}
            </span>
          </h1>

          {/* Texto descriptivo */}
          <p
            className={cn(
              "mx-auto lg:mx-0 max-w-[58ch] mb-6",
              "text-[clamp(1rem,2.5vw,1.125rem)] leading-[1.5] text-[color:var(--ajm-ink)]"
            )}
            style={{
              color: "color-mix(in srgb, var(--ajm-ink) 85%, white 15%)",
            }}
          >
            {COPY.subBefore}
            <strong className="text-[color:var(--ajm-white)]">{COPY.subStrong}</strong>
            {COPY.subAfter}
          </p>

          <div className="mb-7">
            <div className="inline-flex justify-center lg:justify-start">
              <TrustIndicator>{COPY.trust}</TrustIndicator>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2 justify-center lg:justify-start">
            <Button
              href={contactHref}
              variant="contrast"
              size="lg"
              leadingIcon={MessageCircle}
              trailingIcon={ArrowRight}
              aria-label="Ir al formulario de contacto"
              className="w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-current/35"
              onClick={() =>
                track("cta_click", { placement: "hero", cta: "contactar" })
              }
            >
              {COPY.ctas.primary}
            </Button>

            <Button
              href={plansHref}
              variant="outline"
              size="md"
              trailingIcon={ArrowRight}
              className="text-ajm-white focus-visible:ring-2 focus-visible:ring-current/35"
              onClick={() =>
                track("cta_click", { placement: "hero", cta: "ver_planes" })
              }
              aria-label="Ver Planes"
            >
              {COPY.ctas.secondary}
            </Button>
          </div>
        </div>

        {/* Columna de métricas (visual) */}
        <div className="w-full lg:justify-self-end order-last lg:order-none">
          {/* Protege el fold en móvil; en sm+ se desactiva la restricción */}
          <div className="max-h-[52vh] sm:max-h-none">
            <MetricsPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSection);
