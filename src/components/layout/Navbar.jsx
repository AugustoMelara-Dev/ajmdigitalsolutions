// --- FILE: src/components/layout/Navbar.jsx (responsive tablet-friendly) ---
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/* =========================
   Config SPA
   ========================= */
const DEFAULT_NAV = [
  { href: "#hero",       label: "Inicio" },
  { href: "/servicios",  label: "Servicios" },
  { href: "#proceso",    label: "Proceso" },
  { href: "#planes",     label: "Planes" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#faqs",       label: "FAQ" },
  { href: "#contacto",   label: "Contacto" },
];

/* =========================
   Helpers
   ========================= */
const cn = (...xs) => xs.filter(Boolean).join(" ");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* =========================
   Hooks utilitarios
   ========================= */
function usePrefersReducedMotionStrict() {
  const [pref, setPref] = useState(false);
  useEffect(() => {
    const m = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const on = () => setPref(!!m?.matches);
    on(); m?.addEventListener?.("change", on);
    return () => m?.removeEventListener?.("change", on);
  }, []);
  return pref;
}

function useBodyScrollLock(locked) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const ATTR = "data-lock-count";
    const getCount = () => parseInt(html.getAttribute(ATTR) || "0", 10);
    const setCount = (n) => html.setAttribute(ATTR, String(n));
    const clearAttr = () => html.removeAttribute(ATTR);
    if (!locked) return;
    const next = getCount() + 1;
    setCount(next);
    if (next === 1) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      html.style.position = "relative";
      body.style.position = "relative";
      html.style.width = "100%";
      body.style.width = "100%";
    }
    return () => {
      const remaining = Math.max(0, getCount() - 1);
      if (remaining === 0) {
        html.style.overflow = "";
        body.style.overflow = "";
        html.style.position = "";
        body.style.position = "";
        html.style.width = "";
        body.style.width = "";
        clearAttr();
      } else setCount(remaining);
    };
  }, [locked]);
}

function useNavOffset(fallback = 72) {
  const [off, setOff] = useState(fallback);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const read = () => {
      const v = window.getComputedStyle(root).getPropertyValue("--nav-h");
      const n = parseFloat(v);
      setOff(Number.isFinite(n) ? n : fallback);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(root);
    window.addEventListener("resize", read);
    window.addEventListener("load", read);
    return () => { ro.disconnect(); window.removeEventListener("resize", read); window.removeEventListener("load", read); };
  }, [fallback]);
  return off;
}

function useSectionPositions(ids) {
  const measure = () => {
    const arr = (ids || [])
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const top = (window.scrollY || 0) + rect.top;
        return { id, top };
      })
      .filter(Boolean)
      .sort((a, b) => a.top - b.top);
    return arr;
  };
  const [positions, setPositions] = useState([]);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setPositions(measure());
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); window.removeEventListener("load", update); };
  }, [ids?.join("|")]);
  return positions;
}

function useScrollSpyByPosition(ids, { offset = 0, override = "" } = {}) {
  const positions = useSectionPositions(ids);
  const [active, setActive] = useState("");
  useEffect(() => {
    let rAF = 0;
    const onScroll = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        if (override) { setActive(override); return; }
        if (!positions.length) return;
        const y = (window.scrollY || 0) + 2;
        const offY = y + offset;
        let current = positions[0].id;
        for (let i = 0; i < positions.length; i++) {
          if (positions[i].top <= offY) current = positions[i].id;
          else break;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(rAF); window.removeEventListener("scroll", onScroll); };
  }, [positions, offset, override]);
  return active;
}

function useDismiss(ref, onClose) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose?.(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, [ref, onClose]);
}

/* =========================
   UI atoms
   ========================= */
function Burger({ open }) {
  return (
    <span className="relative block h-4 w-5">
      <span className={cn("absolute left-0 top-0 h-0.5 w-full rounded bg-white transition-transform duration-300", open && "translate-y-2 rotate-45")} />
      <span className={cn("absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-white transition-opacity duration-200", open ? "opacity-0" : "opacity-100")} />
      <span className={cn("absolute left-0 bottom-0 h-0.5 w-full rounded bg-white transition-transform duration-300", open && "-translate-y-2 -rotate-45")} />
    </span>
  );
}

function Brand() {
  return (
    <span className="block leading-tight">
      <span className="block text-base lg:text-lg font-extrabold tracking-tight text-white">
        AJM Digital Solutions
      </span>
      <span className="hidden lg:block text-[11px] font-medium text-white/55">
        Páginas Web Honduras • Diseño Web
      </span>
    </span>
  );
}

/* =========================
   Componente principal
   ========================= */
export default function Navbar({ nav = DEFAULT_NAV, waHref }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overrideId, setOverrideId] = useState("");
  const headerRef = useRef(null);

  useBodyScrollLock(open);

  // Sincroniza --nav-h con altura real del header
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const root = document.documentElement;
    const update = () => {
      const h = Math.round(headerRef.current.getBoundingClientRect().height);
      root.style.setProperty("--nav-h", `${h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(headerRef.current);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    let rAF = 0;
    const onScroll = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => setScrolled((window.scrollY || 0) > 2));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(rAF); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const navOffset = useNavOffset(72);

  const ids = useMemo(
    () => (isHome ? (nav || [])
      .map(i => i.href)
      .filter(h => h?.startsWith("#"))
      .map(h => h.slice(1)) : []),
    [nav, isHome]
  );

  const activeId = useScrollSpyByPosition(ids, { offset: navOffset, override: overrideId });

  const reduced = usePrefersReducedMotionStrict();
  const smoothTo = (hash) => {
    if (!hash?.startsWith("#")) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    setOverrideId(id);
    const clearOverride = () => setTimeout(() => setOverrideId(""), 350);

    const rect = el.getBoundingClientRect();
    const start = window.scrollY || 0;
    const target = start + rect.top - clamp(navOffset, 0, 200);
    const dist = target - start;

    // ✅ Fix visual de la “línea” (outline) al enfocar programáticamente
    const focusIt = () => {
      history.replaceState(null, "", `#${id}`);
      el.setAttribute("tabindex", "-1");
      const prevOutline = el.style.outline;      // guardar inline style
      el.style.outline = "none";                 // ocultar outline mientras enfocamos
      el.focus({ preventScroll: true });
      setTimeout(() => {
        el.style.outline = prevOutline;          // restaurar
        el.removeAttribute("tabindex");
      }, 250);
      clearOverride();
    };

    if (reduced) { window.scrollTo(0, target); focusIt(); return; }

    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const t0 = performance.now(); const dur = 560;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step); else focusIt();
    };
    requestAnimationFrame(step);
  };

  const safeNav = useMemo(
    () => (nav || []).filter(i => i && typeof i.href === "string" && i.label),
    [nav]
  );

  return (
    <header
      ref={headerRef}
      role="banner"
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-[#0A1525] text-white border-b border-white/10",
        "pt-[env(safe-area-inset-top)]",
        scrolled && "shadow-[0_8px_24px_rgba(0,0,0,.25)]/50"
      )}
    >
      {/* Skip link */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-[#0A1525]"
      >
        Saltar al contenido
      </a>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3 lg:px-8 lg:py-4">
        <Link
          href="/"
          prefetch={false}
          aria-label="AJM Digital Solutions, ir al inicio"
          className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
        >
          <Brand />
        </Link>

        {/* Nav desktop: desde lg (≥1024px) */}
        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          {safeNav.map((item) => {
            const isHash = item.href.startsWith("#");
            const href = isHome || !isHash ? item.href : `/${item.href}`;
            const active =
              (isHome && isHash && activeId && `#${activeId}` === item.href) ||
              (!isHome && !isHash && (pathname === item.href || pathname.startsWith(item.href + "/")));
            return (
              <Link
                key={item.href}
                href={href}
                prefetch={false}
                onClick={(e) => { if (isHome && isHash) { e.preventDefault(); smoothTo(item.href); } }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  "text-white/80 hover:text-white hover:bg-white/10",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",
                  active && "bg-white/10 text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-[#0A1525] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 whitespace-nowrap"
            >
              Cotiza ahora
            </a>
          )}
        </nav>

        {/* Toggle móvil: visible hasta lg */}
        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/15 border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          aria-controls="mobile-nav"
          aria-expanded={open ? "true" : "false"}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <Burger open={open} />
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
        </button>
      </div>

      <MobilePanel
        open={open}
        onClose={() => setOpen(false)}
        navLinks={safeNav}
        isHome={isHome}
        onSmooth={smoothTo}
        waHref={waHref}
      />
    </header>
  );
}

/* =========================
   Panel móvil (focus-trap simple)
   ========================= */
function MobilePanel({ open, onClose, navLinks, isHome, onSmooth, waHref }) {
  const panelRef = useRef(null);
  const firstRef = useRef(null);
  const lastRef = useRef(null);

  useDismiss(panelRef, onClose);
  useEffect(() => { if (open) firstRef.current?.focus(); }, [open]);

  const onKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
    if (!focusables?.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  if (!open) return null;

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        id="mobile-nav"
        ref={panelRef}
        className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 w-[min(94vw,22rem)] rounded-2xl bg-[#0A1525] text-white border border-white/10 shadow-2xl p-2 max-h-[calc(100vh-1.5rem)] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        onKeyDown={onKeyDown}
      >
        <nav className="grid gap-1 p-1">
          {navLinks.map((l, i) => {
            const isHash = l.href.startsWith("#");
            const href = isHome || !isHash ? l.href : `/${l.href}`;
            return (
              <Link
                key={l.href}
                ref={i === 0 ? firstRef : null}
                href={href}
                prefetch={false}
                onClick={(e) => {
                  if (isHome && isHash) { e.preventDefault(); onClose(); onSmooth(l.href); }
                  else onClose();
                }}
                className="rounded-md px-3 py-2 text-white/85 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              >
                {l.label}
              </Link>
            );
          })}
          {waHref && (
            <a
              ref={lastRef}
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-white px-3 py-2 font-semibold text-[#0A1525] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            >
              Cotiza ahora
            </a>
          )}
        </nav>

        <button
          type="button"
          onClick={onClose}
          className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
