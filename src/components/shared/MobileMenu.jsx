// --- FILE: src/components/shared/MobileMenu.jsx (CLEAN • sin framer-motion) ---
"use client";

import React, { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { X, Moon, Sun } from "lucide-react";

/** WhatsApp CTA (E.164 sin "+") */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const WA_DEFAULT =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola, vengo desde el sitio. Quiero una cotización.";
const waHref = RAW_PHONE
  ? `https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(WA_DEFAULT)}`
  : "#contacto";

/* === Tema (dark / light) === */
const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
};

/* Helpers */
function normalizeNav(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((it) => {
      if (!it) return null;
      if (Array.isArray(it)) return { label: String(it[0] ?? ""), href: String(it[1] ?? "#") };
      if (typeof it === "object") return { label: String(it.label ?? ""), href: String(it.href ?? "#") };
      return null;
    })
    .filter(Boolean);
}

export default function MobileMenu({ onClose, id = "mobile-menu", nav }) {
  const panelRef = useRef(null);
  const lastActiveRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false); // para animación CSS de entrada
  const [reduceMotion, setReduceMotion] = useState(false);

  // Init tema + prefers-reduced-motion (siempre, sin condicionales de hooks)
  useEffect(() => {
    const th = getInitialTheme();
    setTheme(th);
    applyTheme(th);
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    setReduceMotion(!!mq?.matches);
    const onChange = () => setReduceMotion(!!mq?.matches);
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);

  const isDark = theme === "dark";
  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const links = nav && Array.isArray(nav) ? nav : normalizeNav(NAV_ITEMS);

  // Scroll lock al montar
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    // disparar transición de entrada
    const t = setTimeout(() => setOpen(true), 10);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  // Focus trap + restaurar foco
  useEffect(() => {
    lastActiveRef.current = document.activeElement;
    const panel = panelRef.current;
    if (!panel) return;

    const selectors =
      'a[href], button:not([disabled]), [tabindex="0"], select, input, textarea';
    const all = panel.querySelectorAll(selectors);
    const first = all[0];
    const last = all[all.length - 1];

    if (first) first.focus();
    else panel.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key !== "Tab" || all.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => {
      panel.removeEventListener("keydown", onKeyDown);
      if (lastActiveRef.current && lastActiveRef.current.focus) {
        lastActiveRef.current.focus();
      }
    };
  }, [onClose]);

  const panelBase =
    "absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-[var(--ajm-bg)] text-ajm-white " +
    "shadow-2xl flex flex-col outline-none border-l border-white/10 " +
    "transform transition-transform will-change-transform";
  const panelAnim = reduceMotion
    ? (open ? " translate-x-0" : " translate-x-full")
    : (open ? " translate-x-0 duration-300 ease-out" : " translate-x-full duration-300 ease-in");

  return (
    <div
      className="fixed inset-0 z-[9999] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label="Cerrar menú"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        id={id}
        tabIndex={-1}
        className={panelBase + panelAnim}
      >
        {/* Header del panel */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 id={`${id}-title`} className="text-lg font-semibold">
            Menú
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-ajm-ink hover:bg-white/10 transition"
              title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              {isDark ? "Claro" : "Oscuro"}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Menú móvil">
          <ul className="space-y-1 px-4">
            {links.map(({ label, href }) => (
              <li key={`${label}-${href}`}>
                <a
                  href={href}
                  onClick={onClose}
                  className="block px-4 py-3 rounded-lg font-medium transition
                             text-ajm-ink hover:bg-white/10 hover:text-ajm-white"
                  data-analytics={`mobilemenu_link:${label}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="p-4 border-t border-white/10 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <a
            href={waHref}
            target={RAW_PHONE ? "_blank" : undefined}
            rel={RAW_PHONE ? "noopener noreferrer" : undefined}
            onClick={onClose}
            className={[
              "block w-full text-center px-4 py-3 rounded-xl font-semibold transition",
              RAW_PHONE
                ? "bg-[var(--ajm-accent)] text-ajm-bg hover:opacity-90"
                : "bg-white/10 text-ajm-ink cursor-not-allowed pointer-events-none",
            ].join(" ")}
            aria-disabled={!RAW_PHONE}
            title={RAW_PHONE ? "Hablar por WhatsApp" : "Configura NEXT_PUBLIC_WA_NUMBER"}
            data-analytics="mobilemenu_cta_whatsapp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
