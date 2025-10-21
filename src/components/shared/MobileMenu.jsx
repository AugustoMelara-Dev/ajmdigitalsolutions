// --- FILE: src/components/shared/Navbar.jsx ---
/**
 * @file Navbar.jsx
 * @description Barra de navegación superior fija y menú móvil para "El Jardín de la Abuela".
 * @description Muestra el nombre de la marca, enlaces de navegación con scroll suave,
 * y un panel lateral móvil accesible.
 * @requires react - Hooks (useState, useEffect, useRef, useLayoutEffect).
 * @requires next/link - Para el enlace de la marca.
 * @requires next/navigation - Hook usePathname (aunque menos relevante en one-page).
 * @requires lucide-react - Iconos (Menu, X, Sparkles).
 * @requires @/lib/constants - Para BRAND_NAME y NAV_ITEMS. Asume existencia.
 * @requires @/lib/utils - Para `cn` y `makeWaUrl`. Asume existencia.
 * @requires @/hooks/useSmoothAnchorScroll - Para scroll suave. Asume existencia.
 * @requires @/hooks/useScrollSpy - (Opcional) Hook para resaltar enlace activo. Asume existencia o adaptación.
 */

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, MessageSquareText } from 'lucide-react'; // Añadido MessageSquareText para WA

// Asumiendo existencia y adaptación de estos archivos/hooks
import { BRAND_NAME, NAV_ITEMS } from '@/lib/constants';
import { cn, makeWaUrl } from '@/lib/utils'; // Asegúrate que makeWaUrl esté aquí
import { useSmoothAnchorScroll } from '@/hooks/useSmoothAnchorScroll';
// import { useScrollSpy } from '@/hooks/useScrollSpy'; // O usa useSimpleScrollSpy si lo prefieres

// --- Hooks y Helpers Internos --- (Adaptados del MobileMenu original)

// Hook básico para detectar scroll
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
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(rAF); window.removeEventListener('scroll', onScroll); };
  }, [threshold]);
  return scrolled;
}

// Hook simplificado para scroll spy (requiere ajustes)
function useSimpleScrollSpy(ids, offset = 0) {
    const [activeId, setActiveId] = useState('');
    const idTops = useRef({});

    useLayoutEffect(() => {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) idTops.current[id] = el.offsetTop;
        });
    }, [ids]);

    useEffect(() => {
        let rAF = 0;
        const onScroll = () => {
             cancelAnimationFrame(rAF);
             rAF = requestAnimationFrame(() => {
                const scrollY = window.scrollY + offset + 2;
                let currentId = '';
                for (const id of ids) {
                    if (idTops.current[id] <= scrollY) {
                        currentId = id;
                    } else {
                        break;
                    }
                }
                setActiveId(prevId => prevId === currentId ? prevId : currentId);
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { cancelAnimationFrame(rAF); window.removeEventListener('scroll', onScroll); }
    }, [ids, offset]);

    return activeId;
}

// WhatsApp Config (dentro de Navbar para MobilePanel)
const RAW_PHONE = process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, '') || '';
const WA_DEFAULT_MESSAGE = 'Hola El Jardín de la Abuela 🌿, tengo una consulta desde la web.'; // Mensaje más general para el menú
const WA_HREF_GLOBAL = makeWaUrl(RAW_PHONE, WA_DEFAULT_MESSAGE, {
    utm_source: 'landing-jardin-abuela',
    utm_medium: 'cta',
    utm_campaign: 'mobile-menu-whatsapp', // Campaña específica
}) || '#pedido'; // Fallback al CTA principal si no hay número global

// --- Componente BrandLogo ---
function BrandLogo() {
  // ... (igual que en la versión anterior de Navbar.jsx)
  return (
    <Link
      href="/"
      aria-label={`${BRAND_NAME}, ir a la página de inicio`}
      className="flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-background]"
    >
      <Sparkles
        className="h-5 w-5 text-[--color-primary]"
        aria-hidden="true"
        strokeWidth={2.5}
      />
      <span className="font-semibold text-lg text-[--color-foreground] whitespace-nowrap">
        {BRAND_NAME}
      </span>
    </Link>
  );
}

// --- Componente BurgerIcon ---
function BurgerIcon({ open }) {
    // ... (igual que en la versión anterior de Navbar.jsx)
  return (
    <span className="relative block h-4 w-5" aria-hidden="true">
      <span className={cn(
        "absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ease-out",
        open ? "translate-y-[7px] rotate-45" : ""
      )} />
      <span className={cn(
        "absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-current transition-opacity duration-200",
        open ? "opacity-0" : "opacity-100"
      )} />
      <span className={cn(
        "absolute left-0 bottom-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ease-out",
        open ? "-translate-y-[7px] -rotate-45" : ""
      )} />
    </span>
  );
}

// --- Componente Principal Navbar ---
export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isMenuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(10);
  const headerRef = useRef(null);
  const { smoothScrollTo } = useSmoothAnchorScroll();
  const sectionIds = useMemo(() => NAV_ITEMS.map(item => item.href.substring(1)), []);
  const activeSectionId = useSimpleScrollSpy(sectionIds, 80); // Ajusta offset

  useLayoutEffect(() => {
    // ... (lógica para --header-height igual que antes)
    if (!headerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const height = entries[0]?.contentRect?.height;
      if (height) {
        document.documentElement.style.setProperty('--header-height', `${Math.round(height)}px`);
      }
    });
    observer.observe(headerRef.current);
    const initialHeight = headerRef.current.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', `${Math.round(initialHeight)}px`);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMenuOpen(false); // Cierra menú en cambio de ruta
  }, [pathname]);

    // Bloquea scroll del body si menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMenuOpen(false);
      smoothScrollTo(href);
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
        'border-[--color-border] bg-[--color-background]/80', // Usa variables del tema
        scrolled ? 'shadow-md shadow-black/5 dark:shadow-black/10' : 'shadow-none',
        'pt-[env(safe-area-inset-top)]' // Soporte para notch/isla
      )}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only ...">
        Saltar al contenido principal
      </a>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo />

        {/* Nav Desktop */}
        <nav aria-label="Navegación principal" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
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
                    ? 'bg-[--color-primary-bg]/10 text-[--color-primary]' // Estilo activo
                    : 'text-[--color-foreground-muted] hover:text-[--color-foreground] hover:bg-[--color-background-hover]', // Estilo normal y hover
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Botón Menú Móvil */}
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

      {/* Panel Menú Móvil (Adaptado de MobileMenu.jsx original) */}
      <MobilePanel
        id="mobile-menu" // ID para aria-controls
        isOpen={isMenuOpen}
        onClose={() => setMenuOpen(false)}
        navLinks={NAV_ITEMS} // Pasa los NAV_ITEMS correctos
        onNavClick={handleNavClick} // Pasa la función para cerrar y scrollear
      />
    </header>
  );
}

// --- Componente Panel Menú Móvil --- (Adaptado e integrado)
function MobilePanel({ id, isOpen, onClose, navLinks, onNavClick }) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null); // Ref para el botón cerrar
  const lastActiveRef = useRef(null); // Para restaurar foco al cerrar
  const [isMounted, setIsMounted] = useState(false); // Para controlar la animación de entrada

  // Lógica de animación y montaje
  useEffect(() => {
    if (isOpen) {
      // Guarda el elemento activo antes de abrir
      lastActiveRef.current = document.activeElement;
      // Pequeño delay para permitir la transición CSS
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
      // Restaura el foco al elemento que estaba activo antes de abrir el menú
      // Se necesita un timeout para asegurar que ocurra después de la transición de cierre
      const timer = setTimeout(() => {
         if (lastActiveRef.current && typeof lastActiveRef.current.focus === 'function') {
           lastActiveRef.current.focus();
         }
      }, 300); // Duración de la transición
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
      closeButtonRef.current?.focus();
    }
  }, [isMounted]);

  // Focus trap simple (solo Tab dentro del panel)
   useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = Array.from(panel.querySelectorAll(focusableSelector));
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentActive = document.activeElement;

      if (e.shiftKey) { // Shift + Tab
        if (currentActive === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else { // Tab
        if (currentActive === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    panel.addEventListener('keydown', handleKeyDown);
    return () => panel.removeEventListener('keydown', handleKeyDown);

  }, [isOpen]);


  // Determina si hay WA configurado globalmente
  const hasWhatsApp = !!WA_HREF_GLOBAL && WA_HREF_GLOBAL !== '#pedido';

  return (
    <div
      className={cn(
        'fixed inset-0 z-[90] md:hidden', // Alto z-index, oculto en desktop
        isOpen ? 'pointer-events-auto' : 'pointer-events-none' // Controla interactividad
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out',
          isMounted ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel Deslizable */}
      <div
        ref={panelRef}
        id={id}
        tabIndex={-1} // Permite enfocar el panel si no hay focusables dentro
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-[85vw] sm:max-w-xs', // Ancho responsivo
          'flex flex-col border-l shadow-2xl transition-transform duration-300 ease-out will-change-transform',
          'border-[--color-border] bg-[--color-background]', // Colores del tema
          isMounted ? 'translate-x-0' : 'translate-x-full' // Animación
        )}
      >
        {/* Encabezado del Panel */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[--color-border]">
          <h2 id={`${id}-title`} className="text-lg font-semibold text-[--color-foreground]">
            Menú
          </h2>
          <button
            ref={closeButtonRef} // Referencia para enfocar
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
        <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Navegación móvil">
          <ul className="space-y-1">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => onNavClick(e, item.href)}
                   className={cn(
                    'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                     // Estilo similar al desktop pero más grande
                     typeof window !== 'undefined' && window.location.hash === item.href
                       ? 'bg-[--color-primary-bg]/10 text-[--color-primary]'
                       : 'text-[--color-foreground-muted] hover:text-[--color-foreground] hover:bg-[--color-background-hover]',
                     'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring]'
                  )}
                  aria-current={typeof window !== 'undefined' && window.location.hash === item.href ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Opcional de WhatsApp en el Footer del Menú */}
        {hasWhatsApp && (
           <div className="border-t border-[--color-border] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
             <Button
                href={WA_HREF_GLOBAL}
                variant="primary" // Botón primario aquí
                size="md" // Tamaño adecuado
                leadingIcon={MessageSquareText}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full justify-center" // Ocupa todo el ancho
                onClick={onClose} // Cierra el menú al hacer clic
                data-analytics-id="mobile_menu_whatsapp_cta"
              >
                Contactar por WhatsApp
              </Button>
           </div>
        )}
      </div>
    </div>
  );
}

// --- END FILE ---