// --- FILE: src/components/sections/WhyUsSection.jsx ---
"use client";

/**
 * AJM Digital Solutions — WhyUsSection (enterprise-ready, sin animaciones por scroll)
 * - Sección OSCURA → CTA principal: <Button variant="contrast" />
 * - Secundario: <Button variant="outline" className="text-ajm-white" />
 * - Sin mezclar con "primary" celeste
 */

import React, { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import ReasonCard from "@/components/cards/ReasonCard"; // opcional; fallback abajo
import { REASONS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { MessageCircle, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

/* ───────────── Helpers ───────────── */
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
  const d = String(number || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(d)) return null;
  const q = new URLSearchParams({ text: String(text || "") });
  for (const [k, v] of Object.entries(utm)) if (v) q.append(k, String(v));
  return `https://wa.me/${d}?${q.toString()}`;
}

/* ENV */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const WA_DEFAULT =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola AJM, vi su sitio y quiero conversar sobre un proyecto.";
const WA_HREF =
  makeWaUrl(RAW_PHONE, WA_DEFAULT, {
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "why-us",
  }) || "#contacto";

/* ───────────── JSON-LD ───────────── */
function WhyUsJsonLd({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Razones para elegir AJM Digital Solutions",
    itemListElement: items.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Thing",
        name: r?.title || `Razón ${i + 1}`,
        description: r?.desc || "Valor diferencial de AJM Digital Solutions",
      },
    })),
  };
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/* ───────────── Fallback Card ───────────── */
function FallbackReasonCard({ icon: Icon = ShieldCheck, title, desc, chips = [] }) {
  return (
    <article
      className={cn(
        "group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
        "shadow-[0_12px_35px_rgba(0,0,0,.30)] transition-transform duration-200",
        "hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,.45)] motion-reduce:transition-none"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-1 text-[var(--ajm-accent)]" size={22} aria-hidden="true" />
        <div>
          <h3 className="font-bold text-ajm-white text-[clamp(1.1rem,3vw,1.25rem)]">{title}</h3>
          <p className="mt-1 text-ajm-ink leading-relaxed text-[clamp(0.95rem,2.3vw,1rem)]">{desc}</p>
          {chips?.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2" role="list">
              {chips.slice(0, 4).map((c) => (
                <li
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-ajm-ink ring-1 ring-white/10"
                >
                  <CheckCircle2 size={14} className="text-[var(--ajm-accent)]" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

/* ───────────── Componente ───────────── */
export default function WhyUsSection() {
  const hasReasons = Array.isArray(REASONS) && REASONS.length > 0;
  const { className: entrance } = useEntranceAnimation(120);
  const isExternal = WA_HREF.startsWith("https://wa.me/");

  return (
    <Section
      id="por-que"
      title="¿Por qué elegir AJM Digital Solutions?"
      subtitle="Estándares de clase mundial, plazos serios y soporte directo. Resultados sin humo."
      className={cn("relative bg-[var(--ajm-bg)] overflow-hidden", entrance)}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 640px" }}
    >
      {/* Fondo sutil premium (GPU friendly) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-1px] -z-10 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 20% 20%, rgba(58,151,212,.10), transparent 50%), radial-gradient(50rem 30rem at 80% 30%, rgba(100,255,214,.08), transparent 55%)",
          maskImage: "radial-gradient(120rem 80rem at 50% 18%, rgba(0,0,0,.9), transparent 70%)",
        }}
      />

      <WhyUsJsonLd items={hasReasons ? REASONS : []} />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Grid 1–2–3 sin animaciones de scroll */}
        {hasReasons ? (
          <div
            className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Razones para elegirnos"
          >
            {REASONS.map((reason, i) => {
              const Card = ReasonCard || FallbackReasonCard;
              return (
                <div key={reason?.title || i} role="listitem">
                  <Card {...reason} />
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={cn(
              "rounded-2xl p-6 text-center",
              "bg-white/8 backdrop-blur-sm border border-white/10",
              "shadow-xl shadow-ajm-bg/20 text-ajm-ink"
            )}
          >
            Aún no hay razones cargadas.{" "}
            <a
              className="underline font-medium text-ajm-white"
              href={WA_HREF}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer nofollow" : undefined}
            >
              Escríbenos
            </a>{" "}
            y te contamos nuestro enfoque.
          </div>
        )}

        {/* CTA coherente (unificada para fondo oscuro) */}
        <div className="text-center mt-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-3">
            <Button
              href={WA_HREF}
              variant="contrast"
              leadingIcon={MessageCircle}
              trailingIcon={ArrowRight}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer nofollow" : undefined}
              data-analytics-id="whyus_whatsapp_cta"
            >
              Conversemos ahora
            </Button>

            <Button
              href="/servicios"
              variant="outline"
              className="text-ajm-white"
              trailingIcon={ArrowRight}
              data-analytics-id="whyus_services_cta"
            >
              Ver servicios
            </Button>
          </div>

          <p className="mt-3 text-xs text-ajm-muted">
            Transparencia total: precios fijos y soporte directo.
          </p>
        </div>
      </div>
    </Section>
  );
}

// --- END FILE
