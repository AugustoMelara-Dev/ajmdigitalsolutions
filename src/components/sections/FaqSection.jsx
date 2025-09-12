// --- FILE: src/components/sections/FaqSection.jsx ---
"use client";

/**
 * AJM Digital Solutions — FaqSection (enterprise-ready, accesible y ultra-liviana)
 * Sección OSCURA → CTA principal: <Button variant="contrast" />
 * (Si agregas uno secundario: <Button variant="outline" className="text-ajm-white" />)
 */

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";

/* ───────────── Helpers ───────────── */
const cn = (...xs) => xs.filter(Boolean).join(" ");

// Animación única de entrada (fade-up) — sin scroll
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

const makeWaUrl = (number, text) => {
  const d = String(number || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(d)) return null;
  const qs = new URLSearchParams({
    text: String(text || ""),
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "faq",
  }).toString();
  return `https://wa.me/${d}?${qs}`;
};

const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const WA_DEFAULT =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola, vengo desde el sitio de AJM. Tengo unas preguntas.";
const WA_HREF = makeWaUrl(RAW_PHONE, WA_DEFAULT); // null si inválido

/* Fallback (6–8 entradas) */
const FALLBACK_FAQS = [
  { q: "¿En cuánto tiempo entregan?", a: "La landing Express se entrega en 72h hábiles. Proyectos corporativos: 1–2 semanas. E-commerce: 2–4 semanas según alcance." },
  { q: "¿Qué incluye y qué no incluye?", a: "Incluye diseño/desarrollo, SEO on-page y conexión con WhatsApp/email. No incluye dominio/hosting ni fotos de stock Premium (opcionales)." },
  { q: "¿Dominio y hosting están incluidos?", a: "Podemos gestionarlo por ti. Recomendamos opciones rápidas y seguras; el costo es externo y transparente." },
  { q: "¿Formas de pago y facturación?", a: "Pago por hitos: 50% al iniciar y 50% al entregar. Facturación disponible y contrato claro." },
  { q: "¿Cuántas revisiones incluye?", a: "Una ronda compacta por etapa. Cambios fuera del alcance se cotizan aparte para cuidar tiempos y calidad." },
  { q: "¿Tienen garantía?", a: "Sí: 7 días de satisfacción total tras el lanzamiento. Ajustes menores incluidos." },
  { q: "¿Pueden mantener mi web?", a: "Sí. Ofrecemos mantenimiento mensual con actualizaciones y backups automatizados." },
  { q: "¿Puedo crecer a e-commerce o más secciones?", a: "Claro. Diseñamos pensando en escalar: más páginas, pasarela de pago o integraciones." },
];

/* JSON-LD */
function FaqJsonLd({ faqs }) {
  if (!faqs?.length) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/* Roving focus (↑ ↓ Home End) */
function useRovingFocus(length) {
  const btnRefs = useRef(Array.from({ length }, () => React.createRef()));
  const focusAt = (i) => btnRefs.current?.[i]?.current?.focus();
  const onKeyDown = (i) => (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); focusAt((i + 1) % length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); focusAt((i - 1 + length) % length); }
    else if (e.key === "Home") { e.preventDefault(); focusAt(0); }
    else if (e.key === "End") { e.preventDefault(); focusAt(length - 1); }
  };
  return { btnRefs, onKeyDown };
}

function AccordionItem({ idx, q, a, open, toggle, btnRef, onKeyDown, groupId }) {
  const panelId = `${groupId}-panel-${idx}`;
  const buttonId = `${groupId}-button-${idx}`;
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm",
        "shadow-[0_10px_30px_rgba(0,0,0,.25)]"
      )}
    >
      <h3>
        <button
          ref={btnRef}
          id={buttonId}
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => toggle(idx)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(idx); }
            onKeyDown?.(e);
          }}
          className={cn(
            "group w-full text-left px-4 py-4 sm:px-5 sm:py-5 min-h-[44px]",
            "flex items-center justify-between gap-4 rounded-2xl",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ajm-accent)]",
            "transition-colors duration-200 ease-out motion-reduce:transition-none"
          )}
        >
          <span className="font-semibold text-ajm-white text-[clamp(1rem,2.6vw,1.0625rem)]">{q}</span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={cn(
              "shrink-0 transition-transform duration-200 ease-out",
              open ? "rotate-180" : "rotate-0",
              "text-ajm-ink group-hover:text-ajm-white",
              "motion-reduce:transition-none"
            )}
          />
        </button>
      </h3>

      {/* Panel con transición corta (sin CLS) */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid overflow-hidden px-4 pb-4 sm:px-5",
          "transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden text-[clamp(0.95rem,2.3vw,1rem)] leading-relaxed text-ajm-ink">
          {a}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Componente ───────────── */
export default function FaqSection({ items }) {
  const { className: entrance } = useEntranceAnimation(120); // ✅ una sola animación

  const faqs = useMemo(() => (Array.isArray(items) && items.length ? items : FALLBACK_FAQS), [items]);

  // Todas CERRADAS por defecto
  const [openSet, setOpenSet] = useState(() => new Set());
  const toggle = (i) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const { btnRefs, onKeyDown } = useRovingFocus(faqs.length);
  const groupId = useId();

  const hasWa = Boolean(WA_HREF);
  const isExternal = hasWa && WA_HREF.startsWith("https://wa.me/");
  const ctaHref = hasWa ? WA_HREF : "#contacto";

  return (
    <Section
      id="faq"
      headerAction={<span id="faqs" className="sr-only" aria-hidden="true" />}
      title="Preguntas frecuentes"
      subtitle="Resolvemos las dudas más comunes para que avances con certeza."
      className={cn("relative bg-[var(--ajm-bg)]", entrance)}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 860px" }}
    >
      <FaqJsonLd faqs={faqs} />

      {/* Fondo sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 20% 20%, rgba(58,151,212,.10), transparent 50%), radial-gradient(50rem 30rem at 80% 30%, rgba(100,255,214,.08), transparent 55%)",
          maskImage: "radial-gradient(120rem 80rem at 50% 18%, rgba(0,0,0,.9), transparent 70%)",
        }}
      />

      {/* Lista */}
      <div className="mx-auto grid max-w-6xl gap-4 sm:gap-5 md:grid-cols-2" role="list" aria-label="Preguntas frecuentes">
        {faqs.map((item, i) => (
          <div key={item.q} role="listitem">
            <AccordionItem
              idx={i}
              q={item.q}
              a={item.a}
              open={openSet.has(i)}
              toggle={toggle}
              btnRef={btnRefs.current[i]}
              onKeyDown={onKeyDown(i)}
              groupId={groupId}
            />
          </div>
        ))}
      </div>

      {/* CTA final (unificada: Button contrast) */}
      <div className="mt-8 text-center">
        <Button
          href={ctaHref}
          variant="contrast"
          leadingIcon={MessageCircle}
          trailingIcon={ArrowRight}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer nofollow" : undefined}
          data-analytics-id="faq_bottom_cta"
        >
          ¿Tienes más preguntas? Contáctanos
        </Button>

        <p className="mt-3 text-[clamp(0.875rem,2.2vw,0.9375rem)] text-ajm-muted">
          Respuesta promedio en 2–48&nbsp;h. También desde{" "}
          <a href="#contacto" className="text-ajm-white underline-offset-4 hover:underline">contacto</a>.
        </p>
      </div>
    </Section>
  );
}

// --- END FILE
