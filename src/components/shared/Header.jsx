// --- FILE: src/components/shared/Header.jsx (CLEAN • AJM-consistent) ---
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import MobileMenu from "@/components/shared/MobileMenu";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";

/* WhatsApp CTA */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const DEFAULT_MSG =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola, vengo desde el sitio. Quiero una cotización.";
const WA_HREF = RAW_PHONE
  ? `https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(DEFAULT_MSG)}`
  : "#contacto";

/* Tema (dark / light) */
function useTheme() {
  const initial = () => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const [theme, setTheme] = useState(initial);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

function ThemeToggle({
  labelLight = "Cambiar a tema claro",
  labelDark = "Cambiar a tema oscuro",
}) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <button
      type="button"
      aria-label={isDark ? labelLight : labelDark}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "inline-flex items-center justify-center w-11 h-11 rounded-xl",
        "border border-white/10 text-ajm-ink hover:bg-white/10 transition-colors duration-200",
        "min-w-[44px] min-h-[44px]",
        mounted ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

/* Normaliza NAV_ITEMS */
function normalizeNav(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((it) => {
      if (!it) return null;
      if (Array.isArray(it)) return { label: String(it[0] ?? ""), href: String(it[1] ?? "#") };
      if (typeof it === "object")
        return { label: String(it.label ?? ""), href: String(it.href ?? "#") };
      return null;
    })
    .filter(Boolean);
}

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  // Hash activo (sin IO)
  useEffect(() => {
    const applyHash = () => setActiveHash(window.location.hash || "");
    applyHash();
    window.addEventListener("hashchange", applyHash, { passive: true });
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // ⚠️ Importante: NO bloquear scroll aquí. Lo maneja MobileMenu.

  const isActive = (href) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const normalized = href.startsWith("/#") ? href.slice(1) : href;
      return activeHash === normalized;
    }
    return pathname === href;
  };

  const nav = useMemo(() => normalizeNav(NAV_ITEMS), []);

  return (
    <>
      {/* Skip link (a11y) */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-lg focus:bg-[var(--ajm-bg)] focus:px-4 focus:py-2 focus:text-ajm-white"
      >
        Saltar al contenido
      </a>

      <header
        role="banner"
        className={[
          "sticky top-0 z-50 border-b shadow-sm",
          "backdrop-blur supports-[backdrop-filter]:bg-[color:var(--ajm-bg)/0.75]",
          "border-white/10",
        ].join(" ")}
      >
        <div
          className={[
            "w-full mx-auto",
            "max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl",
            "px-4 xs:px-4 sm:px-6 md:px-8",
            "flex items-center justify-between gap-3",
          ].join(" ")}
        >
          {/* Marca */}
          <Link href="/" className="flex items-center gap-2 py-3 md:py-2">
            <span className="font-semibold tracking-tight text-ajm-white text-[clamp(1rem,2.5vw,1.125rem)] md:text-[clamp(1.125rem,3vw,1.25rem)] leading-[1.2]">
              AJM Digital Solutions
            </span>
            <span className="sr-only">— Web & Apps</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            {nav.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <a
                  key={`${label}-${href}`}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "px-3 py-2 rounded-xl transition-colors duration-200",
                    "text-[clamp(0.95rem,2.3vw,1rem)]",
                    active
                      ? "text-[var(--ajm-accent)] bg-white/10"
                      : "text-ajm-ink hover:bg-white/10 hover:text-ajm-white",
                  ].join(" ")}
                >
                  {label}
                </a>
              );
            })}

            <div className="mx-1">
              <ThemeToggle />
            </div>

            {/* CTA WhatsApp (unificado con <Button />) */}
            <Button
              href={WA_HREF}
              variant="contrast"
              size="sm"
              className="ml-1 min-h-[44px] min-w-[44px]"
              target={RAW_PHONE ? "_blank" : undefined}
              rel={RAW_PHONE ? "noopener noreferrer" : undefined}
              aria-label="Abrir WhatsApp"
              title="Hablar por WhatsApp"
            >
              WhatsApp
            </Button>
          </nav>

          {/* Botón menú móvil */}
          <button
            className="md:hidden inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-white/10 text-ajm-ink hover:bg-white/10 transition-colors duration-200"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Menú móvil */}
      {isMenuOpen && (
        <MobileMenu id="mobile-menu" onClose={() => setMenuOpen(false)} nav={nav} />
      )}
    </>
  );
}
