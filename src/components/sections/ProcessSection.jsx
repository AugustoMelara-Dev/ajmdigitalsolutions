/* --- FILE: src/components/sections/ProcessSection.jsx --- */
"use client";

/**
 * AJM Digital Solutions — ProcessSection (enterprise-ready, consistente con cards)
 * - Tarjetitas con MISMO fondo: bg-white/5 + border-white/10 + blur + sombra
 * - Step se vuelve transparente (sin borde/sombra/padding) para no deformar
 */

import React, { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Step from "@/components/ui/Step";
import { ClipboardList, FileCheck2, Code2, Rocket, ArrowRight, MessageCircle } from "lucide-react";

/* Utils */
const cn = (...xs) => xs.filter(Boolean).join(" ");
function useEntranceAnimation(delay = 120) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
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
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        ),
  };
}
function makeWaUrl(number, text, utm = {}) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(digits)) return null;
  const params = new URLSearchParams({ text: String(text || "") });
  for (const [k, v] of Object.entries(utm)) if (v) params.append(k, String(v));
  return `https://wa.me/${digits}?${params.toString()}`;
}

/* ENV */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const WA_DEFAULT =
  process.env.NEXT_PUBLIC_WA_MESSAGE || "Hola AJM, quiero empezar mi web. ¿Me ayudas?";
const WA_HREF =
  makeWaUrl(RAW_PHONE, WA_DEFAULT, {
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "process",
  }) || "#contacto";

/* Copy */
const TITLE = "Proceso claro y sin vueltas";
const SUBTITLE =
  "Pasos simples para lanzar una web que vende. Plazos reales, comunicación directa y resultados medibles.";

const ICONS = [ClipboardList, FileCheck2, Code2, Rocket];
const BASE_STEPS = [
  { n: "01", short: "Inicio", title: "Entendemos tu negocio", desc: "Hablamos 30 minutos, definimos metas y qué vamos a medir. Sin compromiso." },
  { n: "02", short: "Plan", title: "Propuesta y diseño", desc: "Estructura clara, textos que convierten y diseño limpio. Alineamos antes de construir." },
  { n: "03", short: "Construcción", title: "Construcción y pruebas", desc: "Montamos tu web rápida y segura. Revisas avances y todo queda medido." },
  { n: "04", short: "Lanzamiento", title: "Lanzamiento y acompañamiento", desc: "Publicamos, conectamos WhatsApp/analítica y te acompañamos la primera semana." },
];
const STEPS = BASE_STEPS.map((s, i) => ({ ...s, Icon: ICONS[i] || ClipboardList }));

const CHIPS = ["Cargas rápidas", "Textos que convierten", "Entrega landing en 72h", "Soporte directo por WhatsApp"];

const ARIA = {
  list: "Pasos del proceso",
  rail: "Resumen de etapas",
  ctaTitle: "Iniciar proyecto por WhatsApp",
  ctaNote: "Respuesta promedio en 2 horas hábiles.",
};

/* JSON-LD */
function HowToJsonLd({ steps }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Proceso de trabajo — AJM Digital Solutions",
    step: steps.map((s) => ({ "@type": "HowToStep", name: s.title, text: s.desc })),
  };
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/* Estilo de “tarjetita” unificado */
const CARD = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_12px_35px_rgba(0,0,0,.30)]";
const CARD_PAD = "p-6";

/* Componente */
export default function ProcessSection() {
  const { className: entrance } = useEntranceAnimation(120);

  return (
    <Section
      id="proceso"
      title={TITLE}
      subtitle={SUBTITLE}
      className={cn("relative bg-[var(--ajm-bg)]", entrance)}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 820px" }}
    >
      {/* Fondo sutil GPU-friendly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 20% 20%, rgba(58,151,212,.10), transparent 50%), radial-gradient(50rem 30rem at 80% 30%, rgba(100,255,214,.08), transparent 55%)",
          maskImage: "radial-gradient(120rem 80rem at 50% 18%, rgba(0,0,0,.9), transparent 70%)",
        }}
      />

      <HowToJsonLd steps={STEPS} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Rail etapas (móvil/tablet) */}
        <div aria-label={ARIA.rail} className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-3 overflow-x-auto py-2 md:justify-around">
            {STEPS.map(({ short, Icon }) => (
              <div key={short} className="min-w-[64px] flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-11 h-11 rounded-full grid place-items-center",
                    "bg-white/10 border border-white/10 text-ajm-white",
                    "shadow-xl shadow-ajm-bg/20"
                  )}
                  aria-hidden="true"
                >
                  <Icon size={18} />
                </div>
                <div className="text-[12px] font-semibold text-ajm-ink text-center">{short}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjetas de pasos — MISMO FONDO EN TODA LA TARJETA */}
        <ol
          role="list"
          aria-label={ARIA.list}
          className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((s) => (
            <li key={s.n} className="contents">
              <div className={cn(CARD, CARD_PAD)}>
                {/* Hacemos Step transparente para que no agregue su propio panel */}
                <Step
                  n={s.n}
                  title={s.title}
                  desc={s.desc}
                  role="none"
                  className="!bg-transparent !border-0 !shadow-none !p-0 !m-0"
                />
              </div>
            </li>
          ))}
        </ol>

        {/* Chips */}
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {CHIPS.map((c) => (
            <li key={c} className="px-3 py-1.5 rounded-full bg-white/8 text-ajm-ink text-xs md:text-sm font-semibold border border-white/10 backdrop-blur-sm">
              {c}
            </li>
          ))}
        </ul>

        {/* CTA — Botón unificado (sección oscura → contrast) */}
        <div className="mt-6 text-center">
          <Button
            href={WA_HREF}
            variant="contrast"
            size="lg"
            leadingIcon={MessageCircle}
            trailingIcon={ArrowRight}
            target={WA_HREF.startsWith("https://wa.me/") ? "_blank" : undefined}
            rel={WA_HREF.startsWith("https://wa.me/") ? "noopener noreferrer nofollow" : undefined}
            aria-label={ARIA.ctaTitle}
            data-analytics-id="process_start_cta"
          >
            Empezar por WhatsApp
          </Button>
          <p className="mt-2 text-xs text-ajm-muted">{ARIA.ctaNote}</p>
        </div>
      </div>
    </Section>
  );
}
/* --- END FILE --- */
