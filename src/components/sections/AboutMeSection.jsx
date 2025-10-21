// --- FILE: src/components/sections/AboutMeSection.jsx ---
"use client";

import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Award, Timer, ShieldCheck, Rocket } from "lucide-react";

/* WA helper */
const makeWaUrl = (num, text, utm = {}) => {
  const d = String(num || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(d)) return "#contacto";
  const q = new URLSearchParams({ text: text || "" });
  Object.entries(utm).forEach(([k, v]) => v && q.append(k, String(v)));
  return `https://wa.me/${d}?${q.toString()}`;
};

/* ENV */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const WA_TEXT =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola Augusto, quiero conversar sobre un proyecto web.";
const WA_HREF = makeWaUrl(RAW_PHONE, WA_TEXT, {
  utm_source: "landing",
  utm_medium: "cta",
  utm_campaign: "about-me",
});

const PHOTO =
  process.env.NEXT_PUBLIC_ABOUT_PHOTO || ""; // p.ej. /images/augusto.jpg (cuadrada)

export default function AboutMeSection() {
  return (
    <Section
      id="sobre-mi"
      title="Hola, soy Augusto. Tu socio tecnológico."
      subtitle="Aplico ingeniería de software para que tu web sea rápida, clara y con resultados medibles."
      align="left"
      container="tight"
      pad="md"
      className="bg-[var(--ajm-bg)]"
      contentGap="md"
    >
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 md:gap-8 items-start">
        {/* Lado visual: foto + métricas */}
        <aside className="flex flex-col items-start gap-5">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
            {PHOTO ? (
              <Image
                src={PHOTO}
                alt="Foto de Augusto"
                width={224}
                height={224}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-sm text-white/60">
                AJM
              </div>
            )}
          </div>

          {/* métricas de confianza */}
          <ul className="grid grid-cols-2 gap-3 w-full max-w-[22rem]" role="list">
            <Metric icon={Award} label="Proyectos" value="10+ entregados" />
            <Metric icon={Timer} label="Entrega" value="Landing en 72 h" />
            <Metric icon={ShieldCheck} label="Propiedad" value="Código 100% tuyo" />
            <Metric icon={Rocket} label="Rendimiento" value="SEO & velocidad" />
          </ul>
        </aside>

        {/* Historia + misión + promesas */}
        <div className="text-ajm-ink space-y-4">
          <p>
            De adolescente me pasaba horas <strong>viendo videos de cómo programaban videojuegos</strong>.
            Esa curiosidad me llevó al camino profesional: hoy construyo soluciones web con foco en negocio,
            rendimiento y medición.
          </p>
          <p>
            Soy <strong>Bachiller Técnico en Informática (Froylán Turcios)</strong> y estudiante de
            <strong> Ingeniería en Ciencias de la Computación (UNICAH)</strong>.
          </p>
          <p className="text-ajm-white/90">
            <strong>Mi misión:</strong> cerrar la brecha digital de las PYMEs en Honduras y
            darles tecnología al nivel de las grandes, con procesos claros, plazos reales
            y soporte directo.
          </p>

          {/* Promesas (mini-cards) */}
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <PromiseCard
              title="Filosofía"
              bullets={["Poco ruido, mucho resultado", "Comunicación directa", "Plazos reales"]}
            />
            <PromiseCard
              title="Garantías"
              bullets={["Entrega y soporte inicial", "Código mantenible", "Propiedad total del proyecto"]}
            />
          </div>

          {/* CTA */}
          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              href={WA_HREF}
              variant="contrast" // fondo oscuro
              size="md"
              data-analytics-id="about_whatsapp_cta"
              target={WA_HREF.startsWith("https://wa.me/") ? "_blank" : undefined}
              rel={WA_HREF.startsWith("https://wa.me/") ? "noopener noreferrer nofollow" : undefined}
            >
              Hablemos de tu proyecto
            </Button>
            <Button href="#portafolio" variant="outline" className="text-ajm-white">
              Ver portafolio
            </Button>
          </div>
        </div>
      </div>

      {/* Person JSON-LD (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Augusto",
            jobTitle: "Desarrollador web",
            worksFor: { "@type": "Organization", name: "AJM Digital Solutions" },
            sameAs: [], // agrega tus redes si quieres
          }),
        }}
      />
    </Section>
  );
}

/* ---------- UI bits ---------- */
function Metric({ icon: Icon, label, value }) {
  return (
    <li className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[var(--ajm-accent)]" aria-hidden="true" />
        <span className="text-xs font-semibold text-ajm-ink">{label}</span>
      </div>
      <div className="mt-1 text-sm text-ajm-white/90">{value}</div>
    </li>
  );
}

function PromiseCard({ title, bullets = [] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h4 className="text-sm font-semibold text-ajm-white mb-2">{title}</h4>
      <ul className="list-disc pl-5 space-y-1 text-sm text-ajm-ink">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
