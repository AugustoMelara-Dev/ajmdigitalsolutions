// --- FILE: src/components/shared/WhatsAppFab.jsx ---
"use client";

import { useAnyInViewport } from "@/hooks/useAnyInViewport";
import { MessageCircle } from "lucide-react";

/* ====================== Config / Env ====================== */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, ""); // E.164 sin "+"
const DEFAULT_MSG =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola, vengo desde el sitio. Quiero una cotización.";

/* ====================== Helper: teléfono bonito ====================== */
// Soporta HN (+504 9999-9999) y US (+1 (AAA) BBB-CCCC). Fallback genérico por grupos.
const prettyPhone = (raw) => {
  if (!raw) return "";
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("504")) {
    const n = d.slice(3);
    if (n.length === 8) return `+504 ${n.slice(0, 4)}-${n.slice(4)}`;
    return `+504 ${n}`;
  }
  if (d.startsWith("1") && d.length >= 11) {
    const area = d.slice(1, 4),
      b = d.slice(4, 7),
      c = d.slice(7, 11);
    return `+1 (${area}) ${b}-${c}`;
  }
  // Fallback: +CC XXXX-XXXX-...
  if (d.length > 4) {
    const cc = d.slice(0, Math.max(1, d.length - 9)); // heurística
    const rest = d.slice(cc.length).replace(/(\d{4})(?=\d)/g, "$1-");
    return `+${cc} ${rest}`;
  }
  return `+${d}`;
};

/* ====================== Component ====================== */
export default function WhatsAppFab({
  hideWhenInView = ["#site-footer", "#contacto"],
  label = "WhatsApp",
  title = "Hablar por WhatsApp",
}) {
  // Oculta el FAB cuando el footer o la sección de contacto están visibles (no estorbar).
  const hide = useAnyInViewport(hideWhenInView);

  // Si no hay número, no renderizamos (evita enlace muerto)
  if (!RAW_PHONE) return null;

  const telPretty = prettyPhone(RAW_PHONE);

  const handleClick = () => {
    try {
      const ts = new Date();
      const stamp = ts.toLocaleString("es-HN", { hour12: false });

      // Mensaje enriquecido con fuente, URL y fecha (útil para contexto y analítica cualitativa).
      const body = [
        DEFAULT_MSG,
        "",
        "— Origen: FAB",
        `— URL: ${typeof window !== "undefined" ? window.location.href : "sitio"}`,
        `— Fecha: ${stamp}`,
      ].join("\n");

      const url = `https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(body)}`;

      // Tracking opcional (no rompe si no existe)
      try {
        window.plausible?.("cta_whatsapp", {
          props: { location: "FAB", path: window.location.pathname },
        });
        window.gtag?.("event", "click_whatsapp_fab", {
          event_category: "engagement",
          event_label: window.location.pathname,
        });
      } catch {}

      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // Silencio: FAB no debe romper UX
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Hablar por WhatsApp (${telPretty})`}
      title={title}
      className={[
        "fixed right-4 md:right-6 bottom-4 md:bottom-6 z-40",
        "inline-flex items-center gap-2 px-4 py-3 rounded-full font-semibold",
        "bg-emerald-600 text-white shadow-card hover:opacity-90",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        "transition will-change-transform",
        "motion-safe:hover:translate-y-0.5 motion-safe:active:translate-y-0",
        "motion-reduce:transition-none motion-reduce:transform-none",
        "dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white",
        "pb-[env(safe-area-inset-bottom)]", // iOS safe area
        hide ? "opacity-0 pointer-events-none" : "opacity-100",
      ].join(" ")}
      data-analytics="whatsapp_fab"
    >
      <MessageCircle size={20} aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only">{telPretty}</span>
    </button>
  );
}
