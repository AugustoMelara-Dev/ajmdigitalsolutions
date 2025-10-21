/* --- FILE: src/components/shared/Navbar.jsx (ADAPTADO Y LIMPIO) --- */
/**
 * @file Navbar.jsx
 * @description Barra de navegación fija y tematizada para "El Jardín de la Abuela".
 * @description Arregla el bug del menú móvil oscuro y usa 100% variables CSS.
 */

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, MessageSquareText } from 'lucide-react';

// --- DEPENDENCIAS (Asegúrate de que existan) ---
import { BRAND_NAME, NAV_ITEMS } from '@/lib/constants';
import { cn, makeWaUrl } from '@/lib/utils';
import useSmoothAnchorScroll, {
  smoothScrollToElement,
} from '@/hooks/useSmoothAnchorScroll';

// --- Hook: Detecta si se ha hecho scroll ---
function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let rAF = 0;
    const onScroll = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        setScrolled((window.scrollY || 0) > threshold);
      });
    };
    onScroll(); // Revisa el estado inicial
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);
  return scrolled;
}

// --- Hook: Detecta la sección activa en la página ---
function useSimpleScrollSpy(ids, offset = 0) {
  const [activeId, setActiveId] = useState('');
  const idTops = useRef({});

  useLayoutEffect(() => {
    const measure = () => {
      (ids || []).forEach((id) => {
        const el = document.getElementById(id);
        if (el) idTops.current[id] = el.offsetTop;
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ids]);

  useEffect(() => {
    let rAF = 0;
    const onScroll = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        const scrollY = window.scrollY + offset + 2;
        let currentId = '';
        for (const id of ids || []) {
          if (idTops.current[id] <= scrollY) {
            currentId = id;
          } else {
            break;
          }
        }
        setActiveId((prevId) => (prevId === currentId ? prevId : currentId));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids, offset]);

  return activeId;
}

// --- Componente: Logo de la Marca ---
function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label={`${
        BRAND_NAME || 'El Jardín de la Abuela'
      }, ir a la página de inicio`}
      className={cn(
        'flex items-center gap-2 rounded',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-background]'
      )}
    >
      <Sparkles
        className="h-5 w-5 text-[--color-primary]"
        aria-hidden="true"
        strokeWidth={2.5}
      />
      <span className="font-semibold text-lg text-[--color-foreground] whitespace-nowrap">
        {BRAND_NAME || 'El Jardín de la Abuela'}
      </span>
    </Link>
  );
}

// --- Componente: Icono de Hamburguesa (Animado) ---
function BurgerIcon({ open }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden="true">
      <span
        className={cn(
          'absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ease-out',
          open ? 'translate-y-[7px] rotate-45' : ''
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-current transition-opacity duration-200',
          open ? 'opacity-0' : 'opacity-100'
        )}
      />
      <span
        className={cn(
          'absolute left-0 bottom-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ease-out',
          open ? '-translate-y-[7px] -rotate-45' : ''
        )}
      />
    </span>
  );
}

// --- Componente Principal: Navbar ---
export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(10);
  const headerRef = useRef(null);

  // 1. Activa el hook de scroll suave
  useSmoothAnchorScroll();

  const navItems = NAV_ITEMS || []; // Fallback por si constants.js no carga
  const sectionIds = useMemo(
    () => navItems.map((item) => item.href.substring(1)),
    [navItems]
  );
  const activeSectionId = useSimpleScrollSpy(sectionIds, 80); // 80px offset

  // Sincroniza la altura real del header con la variable CSS
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect?.height;
      if (height) {
        document.documentElement.style.setProperty(
          '--header-height',
          `${Math.round(height)}px`
        );
      }
    });
    observer.observe(headerRef.current);
    const initialHeight = headerRef.current.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
      '--header-height',
      `${Math.round(initialHeight)}px`
    );
    return () => observer.disconnect();
  }, []);

  // Cierra el menú móvil si la ruta cambia
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  /** Manejador de clics para enlaces de navegación (activa scroll suave) */
  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMenuOpen(false);
      // 2. Llama a la función de scroll
      smoothScrollToElement(href);
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <header
      ref={headerRef}
      role="banner"
      className={cn(
        'sticky top-0 z-50 w-full backdrop-blur border-b transition-shadow duration-300',
        'border-[--color-border] bg-[--color-background]/80', // ¡Estilo translúcido del tema!
        // --- CIRUGÍA DE ESTILO ---
        // Usa la sombra del tema, no la de Tailwind por defecto
        scrolled ? 'shadow-card [box-shadow:var(--shadow-card)]' : 'shadow-none',
        'pt-[env(safe-area-inset-top)]' // Soporte para iPhone notch
      )}
    >
      <a
        href="#main-content"
        className={cn(
          'sr-only', // Oculto por defecto
          'focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md',
          'focus:bg-[--color-primary-bg]/20 focus:px-3 focus:py-2 focus:text-[--color-primary]' // Estilo de foco del tema
        )}
      >
        Saltar al contenido principal
      </a>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo />

        {/* --- Nav Desktop --- */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => {
            const isActive = item.href === `#${activeSectionId}`;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-[--color-primary-bg]/20 text-[--color-primary]' // Estilo activo
                    : 'text-[--color-foreground-muted] hover:text-[--color-foreground] hover:bg-[--color-background-hover]', // Estilo inactivo
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* --- Botón Menú Móvil --- */}
        <button
          type="button"
          className={cn(
            'md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
            'border-[--color-border] text-[--color-foreground-muted] hover:bg-[--color-background-hover] hover:text-[--color-foreground]',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]'
          )}
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <BurgerIcon open={isMenuOpen} />
        </button>
      </div>

      {/* --- Panel Menú Móvil --- */}
      <MobileMenu
        id="mobile-menu"
        isOpen={isMenuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
        onNavClick={handleNavClick}
        activeSectionId={activeSectionId} // Pasa el ID activo
      />
    </header>
  );
}

// --- Componente: Panel Menú Móvil (Accessibility-Ready) ---
function MobileMenu({
  id,
  isOpen,
  onClose,
  navItems,
  onNavClick,
  activeSectionId,
}) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastActiveRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Lógica de WhatsApp (Corregida para evitar error de hidratación)
  const [waHref, setWaHref] = useState('#pedido'); // Fallback
  const [hasWhatsApp, setHasWhatsApp] = useState(false);

  useEffect(() => {
    // Lee process.env solo en el cliente
    const rawPhone = process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, '') || '';
    const waDefaultMessage = `Hola ${
      BRAND_NAME || 'El Jardín de la Abuela'
    } 🌿, tengo una consulta desde la web.`;

    const hasWa = !!rawPhone;
    setHasWhatsApp(hasWa);

    if (hasWa) {
      const href = makeWaUrl(rawPhone, waDefaultMessage, {
        utm_source: 'landing-jardin-abuela',
        utm_medium: 'cta',
        utm_campaign: 'mobile-menu-whatsapp',
      });
      if (href) {
        setWaHref(href);
      }
    }
  }, []); // Se ejecuta solo una vez

  // Lógica de animación y montaje
  useEffect(() => {
    if (isOpen) {
      lastActiveRef.current = document.activeElement;
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
      const timer = setTimeout(() => {
        if (
          lastActiveRef.current &&
          typeof lastActiveRef.current.focus === 'function'
        ) {
          lastActiveRef.current.focus();
        }
      }, 300); // Espera que termine la transición de salida
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Enfocar botón cerrar al abrir
  useEffect(() => {
    if (isMounted) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isMounted]);

  // Focus trap (A11y)
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const panel = panelRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const focusableElements = Array.from(
        panel.querySelectorAll(focusableSelector)
      );
      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentActive = document.activeElement;
      if (e.shiftKey) {
        if (currentActive === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (currentActive === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    panel.addEventListener('keydown', handleKeyDown);
    return () => panel.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[90] md:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
      aria-hidden={!isOpen}
    >
      {/* --- Backdrop (Overlay oscuro) --- */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out', // El overlay sí puede ser negro
          isMounted ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* --- Panel Deslizable (El Menú) --- */}
      <div
        ref={panelRef}
        id={id}
        tabIndex={-1}
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-[85vw] sm:max-w-xs',
          'flex flex-col border-l shadow-2xl transition-transform duration-300 ease-out will-change-transform',
          // --- ¡AQUÍ ESTÁ EL ARREGLO! ---
          // Usa el fondo del tema (crema), no bg-black
          'border-[--color-border] bg-[--color-background]',
          isMounted ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Encabezado del Panel */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[--color-border]">
          <h2
            id="mobile-menu-title"
            className="text-lg font-semibold text-[--color-foreground]"
          >
            Menú
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors',
              'border-[--color-border] text-[--color-foreground-muted] hover:bg-[--color-background-hover] hover:text-[--color-foreground]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]'
            )}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav
          className="flex-1 overflow-y-auto px-2 py-4"
          aria-label="Navegación móvil"
        >
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === `#${activeSectionId}`;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => onNavClick(e, item.href)}
                    className={cn(
                      'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-[--color-primary-bg]/20 text-[--color-primary]' // Activo
                        : 'text-[--color-foreground-muted] hover:text-[--color-foreground] hover:bg-[--color-background-hover]', // Inactivo
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA de WhatsApp en el Footer del Menú */}
        {hasWhatsApp && (
          <div className="border-t border-[--color-border] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={cn(
                // Reutiliza los estilos de <Button variant="primary" size="md" />
                'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-colors duration-200',
                'h-11 px-4 text-[clamp(.9rem,2.4vw,1rem)]', // size="md"
                'bg-[--color-primary] text-[--color-primary-fg] hover:opacity-90', // variant="primary"
                'w-full justify-center', // Clases extra
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]'
              )}
              onClick={onClose}
              data-analytics-id="mobile_menu_whatsapp_cta"
            >
              <MessageSquareText size={18} aria-hidden="true" />
              Contactar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
// --- END FILE ---