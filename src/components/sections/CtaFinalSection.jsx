// --- FILE: src/components/sections/CtaFinalSection.jsx (UNIVERSAL • 280px→8K) ---
"use client";

/*
  Cambios clave:
  - Sistema universal: tipografías fluidas (clamp), contenedores y spacing que escalan 2xs→5xl.
  - Targets táctiles ≥44px, safe-area, y gaps progresivos sin scroll horizontal.
  - Mantiene: hook sin check redundante de window, keys con id en métricas, y email no duplicado por defecto.
*/

import React, { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { MessageCircle, ArrowRight } from "lucide-react";

/* ───────────── Utils ───────────── */
const cn = (...xs) => xs.filter(Boolean).join(" ");
const makeWaUrl = (number, text) => {
  const d = String(number || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(d)) return null;
  const qs = new URLSearchParams({
    text: String(text || ""),
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "cta-final",
  }).toString();
  return `https://wa.me/${d}?${qs}`;
};
const fmtUSD = (n) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `USD $${n}`;
  }
};

/* ───────────── Animación única de entrada ───────────── */
function useEntranceAnimation(delay = 100) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    setPrefersReduced(!!mq?.matches);
    const t = window.setTimeout(() => setIsVisible(true), delay);
    return () => window.clearTimeout(t);
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

/* ───────────── ENV ───────────── */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ajmds.contact@gmail.com";
const WA_DEFAULT =
  process.env.NEXT_PUBLIC_WA_MESSAGE || "Hola, vengo desde el sitio. Quiero una consulta.";
const WA_HREF = makeWaUrl(RAW_PHONE, WA_DEFAULT); // null si inválido
const START_USD = Number.isFinite(Number(process.env.NEXT_PUBLIC_START_PRICE_USD))
  ? Number(process.env.NEXT_PUBLIC_START_PRICE_USD)
  : 199;

/* ───────────── JSON-LD ───────────── */
function ContactJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AJM Digital Solutions",
    contactPoint: [
      WA_HREF && {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: WA_HREF,
        areaServed: "Worldwide",
        availableLanguage: ["es", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "email",
        email: EMAIL,
      },
    ].filter(Boolean),
  };
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/* ───────────── Componente ───────────── */
export default function CtaFinalSection({ emailAsLinkOnly = true }) {
  const { className: entrance } = useEntranceAnimation(100);

  const metrics = [
    { id: "delivery", value: "72h", label: "Entrega express" },
    { id: "from", value: fmtUSD(START_USD), label: "Desde" },
    { id: "warranty", value: "7 días", label: "Garantía total" },
  ];

  const secondaryIsWa = Boolean(WA_HREF);
  const secondaryHref = secondaryIsWa
    ? WA_HREF
    : `mailto:${EMAIL}?subject=${encodeURIComponent("Solicitud de consulta — AJM Digital Solutions")}`;

  return (
    <Section
      id="cta-final"
      anchor={false}
      // Título/subtítulo: deja que Section los pinte, aquí reforzamos spacing universal
      title="¿Listo para que tu negocio compita online?"
      subtitle="Mientras lo piensas, tus clientes están buscando a tu competencia."
      className={cn(
        "relative bg-[var(--ajm-bg)]",
        // Spacing universal (alto adaptativo)
        "py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28 3xl:py-32 short:py-8 tall:py-24",
        entrance
      )}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "0 680px",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <ContactJsonLd />

      {/* Fondo sutil premium (sin animaciones) */}
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

      {/* Contenido */}
      <div
        className={cn(
          "text-center mx-auto",
          // Container universal que escala hasta 8K (sin tocar bordes)
          "w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-[80rem] 4xl:max-w-[96rem] 5xl:max-w-[120rem]",
          "px-4 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24"
        )}
      >
        {/* Métricas: tarjetas que escalan sin romper en 280px */}
        <div
          className={cn(
            "mb-8 xs:mb-9 sm:mb-10",
            "grid grid-cols-1 md:grid-cols-3",
            "gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12"
          )}
        >
          {metrics.map((m) => (
            <div
              key={m.id}
              className={cn(
                "rounded-2xl border border-white/10 bg-white/8 backdrop-blur-sm shadow-md",
                // Padding progresivo + radios escalan
                "p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-10",
              )}
            >
              <div
                className={cn(
                  "font-extrabold text-ajm-white",
                  // Valor con clamp para 280px→8K
                  "text-[clamp(1.375rem,4vw,2rem)] 3xl:text-[clamp(1.75rem,2vw,2.5rem)]",
                  "leading-tight xs:leading-snug md:leading-normal"
                )}
              >
                {m.value}
              </div>
              <div
                className={cn(
                  "text-ajm-ink",
                  "text-[clamp(0.9rem,2.4vw,1rem)] 3xl:text-[clamp(1rem,1vw,1.125rem)]",
                  "mt-1"
                )}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs — coherentes en fondo oscuro, táctiles y flex-wrap para 280px */}
        <div
          className={cn(
            "flex flex-wrap justify-center",
            "gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          )}
        >
          {/* Principal: CONTRAST (blanco) → #contacto */}
          <Button
            href="#contacto"
            variant="contrast"
            trailingIcon={ArrowRight}
            aria-label="Ir a la sección de contacto"
            data-analytics-id="cta_final_primary"
            className={cn(
              // Garantiza targets táctiles en cualquier dispositivo
              "min-h-[44px] min-w-[44px]",
              // Tipografía y paddings escalables
              "text-[clamp(0.95rem,2.4vw,1rem)]",
            )}
          >
            Solicitar consulta
          </Button>

          {/* Secundario:
              - Si hay WhatsApp → botón OUTLINE (texto blanco)
              - Si NO hay WhatsApp → por defecto solo mostramos el párrafo con el mail (sin botón) */}
          {secondaryIsWa ? (
            <Button
              href={secondaryHref}
              variant="outline"
              className={cn(
                "text-ajm-white",
                "min-h-[44px] min-w-[44px]",
                "text-[clamp(0.95rem,2.4vw,1rem)]"
              )}
              leadingIcon={MessageCircle}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label="Escribir por WhatsApp"
              data-analytics-id="cta_final_secondary"
            >
              Escribir por WhatsApp
            </Button>
          ) : (
            !emailAsLinkOnly && (
              <Button
                href={secondaryHref}
                variant="outline"
                className={cn(
                  "text-ajm-white",
                  "min-h-[44px] min-w-[44px]",
                  "text-[clamp(0.95rem,2.4vw,1rem)]"
                )}
                leadingIcon={MessageCircle}
                aria-label="Enviar correo"
                data-analytics-id="cta_final_secondary_email"
              >
                Enviar correo
              </Button>
            )
          )}
        </div>

        {/* Nota email visible si no hay WhatsApp (evita duplicación por defecto) */}
        {!secondaryIsWa && (
          <p
            className={cn(
              "mt-3 xs:mt-3.5 sm:mt-4",
              "text-ajm-muted",
              "text-[clamp(0.875rem,2.2vw,0.9375rem)] 3xl:text-[clamp(0.95rem,1vw,1rem)]"
            )}
          >
            También puedes escribirnos a{" "}
            <a
              className="text-ajm-white underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ajm-accent)] rounded"
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("Solicitud de consulta — AJM Digital Solutions")}`}
            >
              {EMAIL}
            </a>.
          </p>
        )}
      </div>
    </Section>
  );
}

/* --- END FILE --- */
