/* --- FILE: components/sections/ServicesSection.jsx --- */
"use client";

/**
 * AJM Digital Solutions — ServicesSection (unificada, con WhatsApp dinámico)
 * - Mensajes por botón (card / detail / footer) con UTM y texto natural.
 * - Copy orientado a beneficios, sin jerga.
 * - Sin animaciones por scroll; A11Y y JSON-LD.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  X,
} from "lucide-react";
import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import ServiceCard from "@/components/cards/ServiceCard"; // opcional
import { SERVICES as IMPORTED_SERVICES } from "@/lib/constants";

/* ───────────── Helpers ───────────── */
const cn = (...xs) => xs.filter(Boolean).join(" ");

function makeWaUrl(number, text, utm = {}) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(digits)) return null;
  const params = new URLSearchParams({ text: String(text || "") });
  for (const [k, v] of Object.entries(utm)) if (v) params.append(k, String(v));
  return `https://wa.me/${digits}?${params.toString()}`;
}

const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");

// ✅ Mensaje natural y consistente por contexto
const slug = (s = "") => s.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "");
const waMessageFor = (title = "tu servicio", context = "card") => {
  const t = title.replace(/"/g, "").trim();
  const tail =
    context === "footer"
      ? "¿Me orientan para una propuesta breve?"
      : "¿Cuál es el siguiente paso?";
  return `Hola AJM. Quiero avanzar con ${t}. ${tail}`;
};
const waHrefFor = (title = "tu servicio", context = "card") =>
  makeWaUrl(RAW_PHONE, waMessageFor(title, context), {
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "services",
    utm_content: `${slug(title)}-${context}`,
  });

const WA_DEFAULT =
  "Hola AJM. Necesito orientación sobre un servicio. ¿Podemos hablar?";
const WA_HREF = waHrefFor("un servicio", "footer") ||
  makeWaUrl(RAW_PHONE, WA_DEFAULT, {
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "services",
    utm_content: "footer-general",
  }) ||
  "#contacto";

/* ───────────── Servicios por defecto (copy que cierra) ───────────── */
const FALLBACK_SERVICES = [
  {
    title: "Landing Express (72h)",
    desc: "Convierte tráfico en consultas en 72 horas. Ideal para anuncios, lanzamientos y promociones.",
    features: [
      "Estructura que vende (titular, prueba social y CTA claro)",
      "Copy y layout enfocados a que te escriban",
      "Analítica lista para medir resultados",
    ],
    price: 160,
    tag: "Más elegido",
    time: "72h",
    image: "/images/services/landing-express.jpg",
  },
  {
    title: "Sitio Web Corporativo",
    desc: "Presenta tu empresa con claridad y gana confianza: secciones bien pensadas y contacto fácil.",
    features: [
      "Arquitectura de 4–6 secciones clave",
      "Diseño alineado a tu marca (responsive)",
      "Formularios con validación y envío a correo/WhatsApp",
    ],
    price: 320,
    time: "1–2 semanas",
    image: "/images/services/corporativo.jpg",
  },
  {
    title: "E-commerce Pro",
    desc: "Tienda lista para vender: catálogo, carrito y cobro sencillo con confirmación inmediata.",
    features: [
      "Catálogo administrable (fotos, precios, variantes)",
      "Checkout claro y rápido para el cliente",
      "Confirmaciones y notificaciones por correo/WhatsApp",
    ],
    price: 560,
    time: "2–4 semanas",
    image: "/images/services/ecommerce-pro.jpg",
  },
  {
    title: "SEO Avanzado",
    desc: "Más visibilidad y leads: auditoría, contenidos y mejoras on-page.",
    features: ["Research de keywords", "Fichas de negocio", "Reportes mensuales"],
    price: null,
    time: "Mensual",
    image: "/images/services/seo.jpg",
  },
  {
    title: "Aplicaciones a Medida",
    desc: "Sistemas y dashboards que ahorran tiempo: autenticación y APIs limpias.",
    features: ["Autenticación segura", "Panel admin", "API REST/GraphQL"],
    price: null,
    time: "A medida",
    image: "/images/services/apps.jpg",
  },
  {
    title: "Mantenimiento Web",
    desc: "Tu sitio al día y sin sobresaltos: soporte técnico, actualizaciones y copias automáticas.",
    features: ["Monitoreo básico", "Backups diarios", "Actualizaciones seguras"],
    price: null,
    time: "Mensual",
    image: "/images/services/mantenimiento.jpg",
  },
];

/* ───────────── Hooks (SSR-safe) ───────────── */
function useIntersectionObserver({
  root = null,
  rootMargin = "300px",
  threshold = 0.01,
  once = true,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver !== "function") {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold, once]);
  return { ref, inView };
}

/* ───────────── JSON-LD ───────────── */
function ServicesJsonLd({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s?.title || `Servicio ${i + 1}`,
        description: s?.desc || "Servicio ofrecido por AJM Digital Solutions",
        provider: { "@type": "Organization", name: "AJM Digital Solutions", founder: "Augusto José Melara Milla" },
        offers: s?.price
          ? {
              "@type": "Offer",
              priceCurrency: "USD",
              price: String(s.price),
              url: waHrefFor(s?.title || `servicio-${i}`, "card") || WA_HREF,
              availability: "https://schema.org/InStock",
            }
          : undefined,
      },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/* ───────────── Blur-up image ───────────── */
function BlurUpImage({ src, alt, className, ratio = "16/10", priority = false }) {
  const { ref, inView } = useIntersectionObserver();
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-[#0E1A2A]/60", className)}
      style={{ aspectRatio: ratio }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-2xl",
          loaded ? "opacity-0" : "opacity-100",
          "bg-[linear-gradient(100deg,rgba(255,255,255,0.06)_20%,rgba(255,255,255,0.12)_30%,rgba(255,255,255,0.06)_40%)]",
          "bg-[length:200%_100%] animate-[shimmer_1.8s_infinite] motion-reduce:animate-none"
        )}
        aria-hidden
      />
      {inView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "h-full w-full object-cover",
            loaded ? "blur-0 opacity-100" : "blur-xl opacity-90",
            "transition-[filter,opacity] duration-300 ease-out motion-reduce:transition-none"
          )}
        />
      )}
      <style jsx>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}

/* ───────────── Skeleton ───────────── */
function ServiceSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,.25)]">
      <div className="h-40 w-full rounded-xl bg-white/10 animate-pulse" />
      <div className="mt-4 h-5 w-2/3 rounded bg-white/10 animate-pulse" />
      <div className="mt-2 h-4 w-4/5 rounded bg-white/10 animate-pulse" />
      <div className="mt-2 h-4 w-3/5 rounded bg-white/10 animate-pulse" />
      <div className="mt-4 h-10 w-28 rounded-xl bg-white/10 animate-pulse" />
    </div>
  );
}

/* ───────────── Stat ───────────── */
function Stat({ icon: Icon, label, to = 0, suffix = "" }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[clamp(0.875rem,2.3vw,1rem)] text-ajm-ink">
      <Icon size={16} className="text-[var(--ajm-accent)]" aria-hidden="true" />
      <div className="font-semibold text-ajm-white">
        <span className="tabular-nums">{to}</span>
        {suffix && <span className="ml-0.5">{suffix}</span>}
        <span className="ml-2 text-ajm-ink font-medium">{label}</span>
      </div>
    </div>
  );
}

/* ───────────── Slide-over ───────────── */
function ServiceDetail({ open, onClose, service }) {
  const overlayRef = useRef(null);
  const firstBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => firstBtnRef.current?.focus(), 0);
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const href = waHrefFor(service?.title || "un servicio", "detail") || WA_HREF;
  const isExternal = href.startsWith("https://wa.me/");

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${service?.title} — Detalles`}
      className="fixed inset-0 z-[70] flex"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-100 transition-opacity duration-200 motion-reduce:transition-none" />
      <aside className="ml-auto h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[var(--ajm-bg)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-ajm-white leading-[1.2] sm:leading-[1.3] lg:leading-[1.4]">
            {service?.title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 p-1 text-ajm-ink hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          <BlurUpImage src={service?.image || "/hero-mockup.jpg"} alt={service?.title} ratio="16/10" priority />
        </div>

        <p className="mt-4 text-[clamp(1rem,2.5vw,1.125rem)] leading-[1.5] text-ajm-ink">
          {service?.desc}
        </p>

        {Array.isArray(service?.features) && service.features.length > 0 && (
          <ul className="mt-4 space-y-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[clamp(0.95rem,2.3vw,1rem)] text-ajm-ink">
                <CheckCircle2 size={16} className="text-[var(--ajm-accent)]" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-between">
          {service?.price ? (
            <div className="text-ajm-white">
              <span className="text-[clamp(1.375rem,3vw,1.75rem)] font-extrabold tabular-nums">${service.price}</span>
              <span className="ml-1 text-[clamp(0.9rem,2.2vw,1rem)] text-ajm-ink">USD</span>
            </div>
          ) : (
            <span className="text-[clamp(0.95rem,2.3vw,1rem)] text-ajm-ink">Precio según alcance</span>
          )}
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-ajm-white ring-1 ring-white/15">
            {service?.time || "Tiempo estimado"}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            ref={firstBtnRef}
            href={href}
            variant="contrast"
            leadingIcon={MessageCircle}
            trailingIcon={ArrowRight}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer nofollow" : undefined}
          >
            Consultar por WhatsApp
          </Button>

          <Button href="#contacto" variant="outline" className="text-ajm-white" trailingIcon={ArrowRight}>
            Ver opciones de contacto
          </Button>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-ajm-muted">
          <ShieldCheck size={14} className="text-[var(--ajm-accent)]" />
          7 días de satisfacción total • Soporte directo • Entrega y alcance claros
        </p>
      </aside>
    </div>
  );
}

/* ───────────── Componente principal ───────────── */
export default function ServicesSection() {
  const services =
    Array.isArray(IMPORTED_SERVICES) && IMPORTED_SERVICES.length > 0 ? IMPORTED_SERVICES : FALLBACK_SERVICES;

  return (
    <Section
      id="servicios"
      title="Servicios hechos para crecer con solidez"
      subtitle="Landing Pages (72h), E-commerce Pro y SEO Avanzado con estándares de clase mundial. Diseño sobrio, rendimiento alto y soporte directo."
      className="relative bg-[var(--ajm-bg)]"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 760px" }}
    >
      {/* Fondo sutil (estático) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-35"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 20% 20%, rgba(58,151,212,.10), transparent 50%), radial-gradient(50rem 30rem at 80% 30%, rgba(100,255,214,.08), transparent 55%)",
          maskImage: "radial-gradient(120rem 80rem at 50% 18%, rgba(0,0,0,.9), transparent 70%)",
        }}
      />

      <ServicesJsonLd items={services} />

      <div className="mx-auto w-full max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl px-4 xs:px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 xs:gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <CardLite key={s?.title || i} service={s} priority={i < 2} onOpenDetails={() => (window.__openService = s)} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3" aria-label="Indicadores de confianza">
          <Stat icon={Timer} to={72} suffix="h" label="Landing Express" />
          <Stat icon={TrendingUp} to={5} suffix="x" label="Leads esperados" />
          <Stat icon={Star} to={7} label="días de garantía" />
        </div>

        {/* CTA final */}
        <div className="mt-10 text-center">
          <div
            className={cn(
              "rounded-2xl p-6 sm:p-8 lg:p-10",
              "bg-white/8 backdrop-blur-sm border border-white/10",
              "shadow-xl shadow-ajm-bg/20"
            )}
          >
            <h3 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold text-ajm-white leading-[1.2]">
              ¿No encuentras lo que necesitas?
            </h3>
            <p className="text-ajm-ink mt-2 mx-auto max-w-2xl text-[clamp(1rem,2.5vw,1.125rem)] leading-[1.5]">
              Cuéntanos tu caso y preparamos una propuesta a la medida. Respuesta en 24–48&nbsp;h.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                href={waHrefFor("un servicio a medida", "footer") || WA_HREF}
                variant="contrast"
                leadingIcon={MessageCircle}
                trailingIcon={ArrowRight}
                target={(waHrefFor("un servicio a medida", "footer") || WA_HREF).startsWith("https://wa.me/") ? "_blank" : undefined}
                rel={(waHrefFor("un servicio a medida", "footer") || WA_HREF).startsWith("https://wa.me/") ? "noopener noreferrer nofollow" : undefined}
              >
                Hablar por WhatsApp
              </Button>

              <Button href="#contacto" variant="outline" className="text-ajm-white" trailingIcon={ArrowRight}>
                Ver opciones de contacto
              </Button>
            </div>
          </div>

          <p className="mt-3 text-xs text-ajm-muted">Transparencia total: precios fijos y soporte directo.</p>
        </div>
      </div>
    </Section>
  );
}

/* ─────────── Card Lite ─────────── */
function CardLite({ service, onOpenDetails, priority = false }) {
  const features = Array.isArray(service?.features) ? service.features.slice(0, 3) : [];
  const href = waHrefFor(service?.title || "un servicio", "card") || WA_HREF;
  const isExternal = href.startsWith("https://wa.me/");

  if (ServiceCard) {
    // Si prefieres tu <ServiceCard/>, asegúrate de pasarle href={waHrefFor(service.title,'card')}
    // return <ServiceCard {...service} href={href} />;
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm",
        "shadow-[0_12px_35px_rgba(0,0,0,.30)] transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]"
      )}
    >
      {/* Chips */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        {service?.time && (
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-ajm-white ring-1 ring-white/20">
            {service.time}
          </span>
        )}
        {service?.tag && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-ajm-white ring-1 ring-white/20">
            <Sparkles size={12} /> {service.tag}
          </span>
        )}
      </div>

      {/* Imagen */}
      <BlurUpImage
        src={service?.image || "/hero-mockup.jpg"}
        alt={service?.title || "Servicio AJM"}
        ratio="16/10"
        priority={priority}
      />

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-[clamp(1.125rem,3vw,1.25rem)] font-bold text-ajm-white leading-[1.2]">{service?.title}</h3>
        <p className="mt-1 text-[clamp(1rem,2.5vw,1.125rem)] leading-[1.5] text-ajm-ink">{service?.desc}</p>

        {/* Hover bullets (desktop) */}
        {features.length > 0 && (
          <ul
            className={cn(
              "pointer-events-none mt-3 hidden list-none gap-2 md:flex md:flex-wrap",
              "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            )}
            role="list"
          >
            {features.map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-ajm-ink ring-1 ring-white/10"
              >
                <CheckCircle2 size={14} className="text-[var(--ajm-accent)]" /> {f}
              </li>
            ))}
          </ul>
        )}

        {/* Precio + Acciones */}
        <div className="mt-4 flex items-center justify-between">
          {service?.price ? (
            <div className="text-ajm-white">
              <span className="text-[clamp(1.375rem,3vw,1.75rem)] font-extrabold tabular-nums">${service.price}</span>
              <span className="ml-1 text-[clamp(0.9rem,2.2vw,1rem)] text-ajm-ink">USD</span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button onClick={onOpenDetails} variant="outline" size="sm" className="text-ajm-white hidden md:inline-flex">
              Ver detalles
            </Button>

            <Button
              href={href}
              variant="contrast"
              size="sm"
              trailingIcon={ArrowRight}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer nofollow" : undefined}
            >
              Consultar
            </Button>
          </div>
        </div>

        {/* En móvil mostramos “Ver detalles” debajo del CTA */}
        <Button onClick={onOpenDetails} variant="outline" size="sm" className="mt-3 w-full text-ajm-white md:hidden" trailingIcon={ArrowRight}>
          Ver detalles
        </Button>
      </div>
    </div>
  );
}
