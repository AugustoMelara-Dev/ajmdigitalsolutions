// --- FILE: src/components/shared/Footer.jsx ---
"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

/* Helpers */
const digitsOnly = (s = "") => String(s).replace(/\D/g, "");
function formatPhoneE164ToDisplay(rawDigits, country = "HN") {
  const digits = digitsOnly(rawDigits);
  const e164 = `+${digits}`;
  if (country.toUpperCase() === "HN" && digits.startsWith("504") && digits.length === 11) {
    const local = digits.slice(3);
    return { e164, display: `+504 ${local.slice(0, 4)}-${local.slice(4)}` };
  }
  return { e164, display: e164 };
}

/* ENV */
const RAW_PHONE = digitsOnly(process.env.NEXT_PUBLIC_WA_NUMBER || "");
const PHONE_COUNTRY = (process.env.NEXT_PUBLIC_PHONE_COUNTRY || "HN").toUpperCase();
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ajmds.contact@gmail.com";

/* Enlaces */
const NAV = [
  { label: "Inicio", href: "/#hero" },
  { label: "Servicios", href: "/servicios" },
  { label: "Planes", href: "/#planes" },
  { label: "Portafolio", href: "/#portafolio" },
  { label: "Proceso", href: "/#proceso" },
  //{ label: "Sobre mí", href: "/sobre-mi" },
];

const SOPORTE_LEGAL = [
  { label: "FAQ", href: "/#faqs" },
  { label: "Contacto", href: "/#contacto" },
  { label: "Términos y Condiciones", href: "/terminos" },
  { label: "Política de Privacidad", href: "/privacidad" },
  { label: "Política de Cookies", href: "/cookies" },
];

export default function Footer() {
  const phoneMeta = RAW_PHONE ? formatPhoneE164ToDisplay(RAW_PHONE, PHONE_COUNTRY) : null;
  const telHref = phoneMeta ? `tel:${phoneMeta.e164}` : undefined;
  const year = new Date().getFullYear();

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 ring-ajm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1525]";

  return (
    <footer id="site-footer" role="contentinfo" className="relative bg-[#0A1525] text-white">
      {/* separador sutil arriba */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* MAIN — 3 columnas equilibradas y compactas */}
        <div className="py-10 md:py-12 grid gap-10 md:grid-cols-12 items-start">
          {/* Col 1: Marca + contacto */}
          <div className="md:col-span-5">
            <h3 className="text-2xl font-bold tracking-tight">AJM Digital Solutions</h3>
            <p className="mt-2 text-white/70 max-w-md">
              Sitios claros y rápidos que convierten. SEO técnico, rendimiento y soporte directo.
            </p>

            <ul className="mt-5 space-y-2.5 text-sm text-white/85">
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-white/60" aria-hidden="true" />
                Honduras · Atención remota
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-white/60" aria-hidden="true" />
                {telHref ? (
                  <a href={telHref} className={`hover:text-white transition-colors rounded ${focusRing}`}>
                    {phoneMeta.display}
                  </a>
                ) : (
                  <span className="opacity-70">Teléfono no disponible</span>
                )}
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-white/60" aria-hidden="true" />
                <a
                  href={`mailto:${EMAIL}?subject=Contacto%20desde%20el%20sitio`}
                  className={`hover:text-white transition-colors rounded ${focusRing}`}
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Navegación */}
          <nav aria-label="Navegación" className="md:col-span-4">
            <h4 className="text-sm font-semibold text-white/90 mb-3">Navegación</h4>
            <ul className="space-y-2 text-white/80">
              {NAV.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={`hover:text-white transition-colors rounded ${focusRing}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3: Soporte y Legal (un solo bloque) */}
          <nav aria-label="Soporte y legal" className="md:col-span-3">
            <h4 className="text-sm font-semibold text-white/90 mb-3">Soporte y legal</h4>
            <ul className="space-y-2 text-white/80">
              {SOPORTE_LEGAL.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={`hover:text-white transition-colors rounded ${focusRing}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* BOTTOM — solo copyright (sin repetidos) */}
        <div className="border-t border-white/10 pt-4 pb-7 text-center md:text-left">
          <div className="text-xs md:text-sm text-white/70">
            © {year} <span className="text-white/90 font-medium">AJM Digital Solutions</span>. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
