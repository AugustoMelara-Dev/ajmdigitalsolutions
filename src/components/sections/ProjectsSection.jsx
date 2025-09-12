/* --- FILE: src/components/sections/ProjectsSection.jsx (UNIVERSAL • 280px→8K) --- */
"use client";

/**
 * AJM Digital Solutions — ProjectsSection (enterprise-ready, universal responsive)
 * - Sección OSCURA → CTA: <Button variant="contrast" />
 * - Una sola animación de entrada (fade-up ≤600ms), respeta prefers-reduced-motion
 * - Tipografía y espaciado FLUIDOS con clamp() + gaps/padding 2xs→3xl
 * - Grid 1→2→3 y cards accesibles; imágenes lazy con shimmer y ratios por breakpoint (sin CLS)
 * - Contenedor “inteligente”: no choca bordes en 280px y escala hasta 8K
 * - JSON-LD SEO (ItemList)
 */

import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import { ArrowRight, CheckCircle2, TrendingUp, Timer, Star } from "lucide-react";
import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import ProjectCard from "@/components/cards/ProjectCard"; // si existe; fallback abajo
import { PROJECTS as IMPORTED_PROJECTS } from "@/lib/constants";

/* ───────────── Utils ───────────── */
const cn = (...xs) => xs.filter(Boolean).join(" ");

// Hook: una sola animación de entrada (fade-up)
function useEntranceAnimation(delay = 100) {
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

/* ───────────── ENV ───────────── */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const WA_DEFAULT =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola AJM, vengo desde el sitio. ¿Pueden enviarme el portafolio completo?";
const WA_HREF =
  makeWaUrl(RAW_PHONE, WA_DEFAULT, {
    utm_source: "landing",
    utm_medium: "cta",
    utm_campaign: "projects",
  }) || "#contacto";
const WA_IS_EXTERNAL = WA_HREF.startsWith("https://wa.me/");

/* ───────────── IO solo para lazy-load de imágenes ───────────── */
function useIntersectionObserver({ root = null, rootMargin = "300px", threshold = 0.01 } = {}) {
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
      (entries, obs) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          obs.disconnect(); // una sola vez
        }
      },
      { root, rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold]);
  return { ref, inView };
}

/* ───────────── Blur-up image (ratios universales) ───────────── */
function BlurUpImage({ src, alt, priority = false, className }) {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.01, rootMargin: "300px" });
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-[#0E1A2A]/60",
        // Aspect ratios por pantalla (sin CLS)
        "aspect-square xs:aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[16/9]",
        className
      )}
    >
      {/* Shimmer durante carga (reduce-motion OK) */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl prj-shimmer",
          loaded ? "opacity-0" : "opacity-100",
          "bg-[linear-gradient(100deg,rgba(255,255,255,0.06)_20%,rgba(255,255,255,0.12)_30%,rgba(255,255,255,0.06)_40%)]",
          "bg-[length:200%_100%] animate-[shimmer_1.8s_infinite]"
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
          /* Cobertura 280px→8K */
          sizes="(max-width: 280px) 100vw, (max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, (max-width: 2560px) 25vw, (max-width: 3840px) 22vw, 18vw"
          className={cn(
            "h-full w-full object-cover",
            loaded ? "blur-0 opacity-100" : "blur-xl opacity-90",
            "transition-[filter,opacity] duration-300 ease-out motion-reduce:transition-none"
          )}
        />
      )}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .prj-shimmer { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ───────────── Fallback data ───────────── */
const FALLBACK_PROJECTS = [
  {
    title: "Calzado Nova — E-commerce",
    desc: "Tienda rápida con catálogo y checkout. +118% conversiones desde ads.",
    image: "/images/projects/ecommerce-shoes.jpg",
    facts: ["Core Web Vitals verde", "Checkout 3 pasos", "+118% conversión"],
    badge: "Retail / 4 sem",
    href: WA_HREF,
  },
  {
    title: "DentaCare — Sitio corporativo",
    desc: "Arquitectura clara y SEO on-page. +62% leads orgánicos en 60 días.",
    image: "/images/projects/clinic-corporate.jpg",
    facts: ["Blog SEO", "WhatsApp 1-click", "+62% leads"],
    badge: "Salud / 2 sem",
    href: WA_HREF,
  },
  {
    title: "EduMax — Academia online",
    desc: "Landing de captación y pasarela de pagos para cursos on-demand.",
    image: "/images/projects/edtech-landing.jpg",
    facts: ["Stripe", "Video CDN", "Tasa de rebote −32%"],
    badge: "EdTech / 3 sem",
    href: WA_HREF,
  },
];

/* ───────────── JSON-LD ───────────── */
function ProjectsJsonLd({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p?.title || `Proyecto ${i + 1}`,
        description: p?.desc || "Proyecto realizado por AJM Digital Solutions",
        url: p?.href || "https://ajmdigitalsolutions.com/#proyectos",
      },
    })),
  };
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

/* ───────────── Project Card (fallback universal) ───────────── */
function ProjectLite({ title, desc, image, facts = [], badge, href = WA_HREF, priority }) {
  const isExternal = href?.startsWith("https://wa.me/");
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 xs:p-4",
        "backdrop-blur-sm shadow-[0_12px_35px_rgba(0,0,0,.30)] transition-shadow duration-200",
        "hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]",
        "motion-reduce:transition-none"
      )}
    >
      {badge && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-ajm-white ring-1 ring-white/20">
          {badge}
        </span>
      )}

      <BlurUpImage
        src={image || "/hero-mockup.jpg"}
        alt={title || "Proyecto AJM"}
        priority={priority}
      />

      <div className="mt-4">
        <h3 className="text-[clamp(1.125rem,3vw,1.25rem)] md:text-[clamp(1.25rem,2.6vw,1.375rem)] font-bold text-ajm-white leading-tight">
          {title}
        </h3>
        <p className="mt-1 text-[clamp(1rem,2.5vw,1.0625rem)] leading-relaxed text-ajm-ink">
          {desc}
        </p>

        {facts.length > 0 && (
          <ul
            className={cn(
              "pointer-events-none mt-3 hidden list-none gap-2 md:flex md:flex-wrap",
              "opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
            )}
            role="list"
          >
            {facts.slice(0, 4).map((f) => (
              <li
                key={f}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full ring-1 ring-white/10 bg-white/10",
                  "px-3 py-1.5 text-[clamp(0.75rem,1.5vw,0.875rem)] font-semibold text-ajm-ink"
                )}
              >
                <CheckCircle2 size={14} className="text-[var(--ajm-accent)]" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-ajm-muted">¿Quieres ver más casos?</span>

          {/* Botón unificado: sección oscura → contrast */}
          <Button
            href={href}
            variant="contrast"
            size="sm"
            trailingIcon={ArrowRight}
            className="min-h-[44px] min-w-[44px]"
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer nofollow" : undefined}
          >
            Pedir portafolio
          </Button>
        </div>
      </div>
    </article>
  );
}

/* ───────────── Componente ───────────── */
function ProjectsSection() {
  const { className: entrance } = useEntranceAnimation(120);

  // 3 proyectos (prioriza featured si existen)
  const projects = useMemo(() => {
    const source = Array.isArray(IMPORTED_PROJECTS) ? [...IMPORTED_PROJECTS] : [];
    const featuredFirst = source.sort((a, b) => Number(!!b?.featured) - Number(!!a?.featured));
    return (featuredFirst.length ? featuredFirst : FALLBACK_PROJECTS).slice(0, 3);
  }, []);

  return (
    <Section
      id="proyectos"
      title="Proyectos recientes"
      subtitle="Un vistazo rápido a lo que entregamos: claro, rápido y enfocado en resultados."
      className={cn(
        "relative bg-[var(--ajm-bg)]",
        // Spacing universal 2xs→3xl
        "py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28 3xl:py-32",
        entrance
      )}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" }}
    >
      {/* Fondo estático (GPU-friendly) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-35"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 20% 20%, rgba(58,151,212,.10), transparent 50%), radial-gradient(50rem 30rem at 80% 30%, rgba(100,255,214,.08), transparent 55%)",
          maskImage: "radial-gradient(120rem 80rem at 50% 18%, rgba(0,0,0,.9), transparent 70%)",
        }}
      />

      <ProjectsJsonLd items={projects} />

      {/* Container universal 2xs→5xl */}
      <div
        className={cn(
          "w-full mx-auto",
          "max-w-sm xs:max-w-md sm:max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl",
          "px-4 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24"
        )}
      >
        {/* Grid sin animar (1→2→3) + gaps progresivos */}
        <div
          className={cn(
            "mt-2",
            "grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            "gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12"
          )}
        >
          {projects.map((p, i) => (
            <div key={p?.title || i}>
              {ProjectCard ? (
                // Si tienes un ProjectCard propio, úsalo; internamente debería seguir las mismas reglas de responsive.
                // <ProjectCard {...p} />
                <ProjectLite {...p} priority={i < 2} />
              ) : (
                <ProjectLite {...p} priority={i < 2} />
              )}
            </div>
          ))}
        </div>

        {/* Mini stats */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-4"
          aria-label="Indicadores rápidos"
        >
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[clamp(0.875rem,2.3vw,1rem)] text-ajm-ink">
            <TrendingUp size={16} className="text-[var(--ajm-accent)]" /> Enfocados en conversión
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[clamp(0.875rem,2.3vw,1rem)] text-ajm-ink">
            <Timer size={16} className="text-[var(--ajm-accent)]" /> Entregas claras
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[clamp(0.875rem,2.3vw,1rem)] text-ajm-ink">
            <Star size={16} className="text-[var(--ajm-accent)]" /> Soporte directo
          </span>
        </div>

        {/* CTA final — botón unificado (contrast) */}
        <div className="mt-10 text-center">
          <Button
            href={WA_HREF}
            variant="contrast"
            size="lg"
            className="min-h-[44px] min-w-[44px]"
            trailingIcon={ArrowRight}
            target={WA_IS_EXTERNAL ? "_blank" : undefined}
            rel={WA_IS_EXTERNAL ? "noopener noreferrer nofollow" : undefined}
          >
            Solicitar portafolio completo
          </Button>
        </div>
      </div>
    </Section>
  );
}

export default memo(ProjectsSection);
/* --- END FILE --- */
