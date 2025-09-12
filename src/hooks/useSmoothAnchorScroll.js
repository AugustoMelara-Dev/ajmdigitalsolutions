// --- FILE: src/hooks/useSmoothAnchorScroll.js ---
'use client';

import { useEffect, useMemo } from 'react';

/**
 * useSmoothAnchorScroll
 * - Intercepta clics en anchors del mismo documento (#id o /#id).
 * - Desplaza con offset para headers sticky (auto-detecta <header role="banner">).
 * - Respeta prefers-reduced-motion: reduce => desplazamiento instantáneo.
 * - Enfoca el destino para accesibilidad y opcionalmente actualiza el hash.
 * - Reacciona al hash inicial y a cambios de hash.
 *
 * Ejemplo rápido:
 *   useSmoothAnchorScroll();
 *
 * Con opciones:
 *   useSmoothAnchorScroll({
 *     selector: 'a[href^="#"], a[href^="/#"]',
 *     headerSelector: 'header[role="banner"]',
 *     offset: undefined,           // número px o función (el) => px
 *     duration: 420,               // ms
 *     easing: 'easeOutCubic',      // 'linear' | 'easeOutCubic' | función (t) => t'
 *     updateHash: 'replace',       // 'push' | 'replace' | false
 *     focusTarget: true,           // enfocar el destino tras el scroll
 *     watchHashOnLoad: true,       // desplazar si la URL ya trae #hash
 *     watchHashChanges: true,      // desplazar en futuros cambios de hash
 *   });
 */
export function useSmoothAnchorScroll(userOpts) {
  const opts = useMemo(
    () => ({
      selector: 'a[href^="#"], a[href^="/#"]',
      headerSelector: 'header[role="banner"]',
      offset: undefined,
      duration: 420,
      easing: 'easeOutCubic',
      updateHash: 'replace',
      focusTarget: true,
      watchHashOnLoad: true,
      watchHashChanges: true,
      ...userOpts,
    }),
    [userOpts]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const prefersReduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSamePageAnchor = (a) => {
      try {
        const url = new URL(a.href, window.location.href);
        // mismo origen + misma ruta (ignorando trailing slash)
        const norm = (s) => s.replace(/\/+$/, '');
        return (
          url.origin === window.location.origin &&
          norm(url.pathname) === norm(window.location.pathname) &&
          (url.hash?.startsWith('#') || a.getAttribute('href')?.startsWith('#'))
        );
      } catch {
        return false;
      }
    };

    const decodeHash = (hash) => {
      if (!hash) return '';
      const h = hash.startsWith('#') ? hash.slice(1) : hash;
      try {
        return decodeURIComponent(h);
      } catch {
        return h;
      }
    };

    const getHeaderOffset = () => {
      // Prioridad:
      // 1) props.offset si es número o función
      // 2) CSS var --header-offset (en px)
      // 3) alto de header[role=banner]
      // 4) fallback 72
      if (typeof opts.offset === 'number') return opts.offset;
      if (typeof opts.offset === 'function') {
        try {
          const v = opts.offset();
          if (Number.isFinite(v)) return v;
        } catch {}
      }
      const fromVar = getCssPxVar('--header-offset');
      if (Number.isFinite(fromVar)) return fromVar;

      const header = document.querySelector(opts.headerSelector);
      if (header && header instanceof HTMLElement && header.offsetHeight) {
        return header.offsetHeight;
      }
      return 72;
    };

    const getCssPxVar = (name) => {
      try {
        const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        if (!raw) return undefined;
        const n = parseFloat(raw);
        return Number.isFinite(n) ? n : undefined;
      } catch {
        return undefined;
      }
    };

    const easings = {
      linear: (t) => t,
      easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    };

    const resolveEasing = (fn) => {
      if (typeof fn === 'function') return fn;
      if (easings[fn]) return easings[fn];
      return easings.easeOutCubic;
    };

    const smoothScrollToY = (toY, { duration = 420, easing = 'easeOutCubic' } = {}) =>
      new Promise((resolve) => {
        const startY = window.scrollY || window.pageYOffset || 0;
        const change = toY - startY;

        if (duration <= 0 || prefersReduce) {
          window.scrollTo(0, Math.round(toY));
          resolve();
          return;
        }

        const ease = resolveEasing(easing);
        let rafId = 0;
        const start = performance.now();

        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const y = startY + change * ease(t);
          window.scrollTo(0, Math.round(y));
          if (t < 1) {
            rafId = requestAnimationFrame(step);
          } else {
            resolve();
          }
        };

        rafId = requestAnimationFrame(step);
      });

    const computeTargetY = (el) => {
      const rect = el.getBoundingClientRect();
      const absoluteTop = rect.top + (window.scrollY || window.pageYOffset);
      const off = getHeaderOffset();
      // Pequeño colchón para no “pegar” el título al borde
      const cushion = 6;
      return Math.max(0, absoluteTop - off - cushion);
    };

    const focusForA11y = (el) => {
      if (!opts.focusTarget || !el) return;
      const focusable = el.matches(
        [
          'a[href]',
          'button:not([disabled])',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(', ')
      );
      if (focusable) {
        try {
          el.focus({ preventScroll: true });
          return;
        } catch {}
      }
      const prev = el.getAttribute('tabindex');
      el.setAttribute('tabindex', '-1');
      try {
        el.focus({ preventScroll: true });
      } catch {}
      // Restaurar si no tenía tabindex explícito
      if (prev === null) {
        const onBlur = () => {
          el.removeAttribute('tabindex');
          el.removeEventListener('blur', onBlur);
        };
        el.addEventListener('blur', onBlur);
      }
    };

    const scrollToHash = async (hashRaw, { updateHistory = opts.updateHash } = {}) => {
      const id = decodeHash(hashRaw);
      if (!id) return;
      const el =
        document.getElementById(id) ||
        // Soporte por name= para algunos contenidos antiguos
        document.querySelector(`[name="${CSS.escape(id)}"]`);
      if (!el) return;

      const y = computeTargetY(el);
      await smoothScrollToY(y, { duration: opts.duration, easing: opts.easing });
      focusForA11y(el);

      if (updateHistory === 'push') {
        history.pushState(null, '', `#${id}`);
      } else if (updateHistory === 'replace') {
        history.replaceState(null, '', `#${id}`);
      }
    };

    const onClick = (e) => {
      // Ignorar si el click viene con modificadores (abrir nueva pestaña, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;
      const target = e.target instanceof Element ? e.target.closest(opts.selector) : null;
      if (!target) return;

      // Permitir saltar comportamiento con data-no-smooth
      if (target.hasAttribute('data-no-smooth')) return;

      // Solo anchors del mismo documento
      if (!isSamePageAnchor(target)) return;

      const href = target.getAttribute('href') || '';
      const hash = href.startsWith('/#') ? href.slice(1) : href; // normaliza /#id => #id
      const id = decodeHash(hash);

      const el =
        document.getElementById(id.replace(/^#/, '')) ||
        document.querySelector(`[name="${CSS.escape(id.replace(/^#/, ''))}"]`);

      if (!el) return; // si no existe, deja el default por si el router resuelve luego

      e.preventDefault();
      scrollToHash(id);
    };

    const onHashChange = () => {
      if (!opts.watchHashChanges) return;
      const h = window.location.hash || '';
      // Evitar hacer scroll si el nodo ya está prácticamente en viewport (p.e. el navegador ya movió)
      const id = decodeHash(h);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      // Si el título está ya visible arriba, no rehacer
      const top = el.getBoundingClientRect().top;
      if (top > 12 && top < getHeaderOffset() + 24) return;
      scrollToHash(h, { updateHistory: false });
    };

    // Listeners
    document.addEventListener('click', onClick, { passive: false });
    window.addEventListener('hashchange', onHashChange);

    // Al cargar con #hash, desplazar tras el paint inicial
    if (opts.watchHashOnLoad && window.location.hash) {
      // Timeout corto para que el layout esté estable (fuentes/CLS)
      setTimeout(() => {
        scrollToHash(window.location.hash, { updateHistory: false });
      }, 0);
    }

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [opts]);
}

/**
 * Utilidad imperativa por si quieres usarla fuera del hook,
 * por ejemplo tras montar una sección o al terminar una transición.
 *
 *   await smoothScrollToElement('#planes', { offset: 80 })
 */
export async function smoothScrollToElement(target, cfg = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const prefersReduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resolveEl = (t) => {
    if (!t) return null;
    if (typeof t === 'string') {
      const id = t.startsWith('#') ? t.slice(1) : t;
      return document.getElementById(id) || document.querySelector(t);
    }
    return t;
  };

  const el = resolveEl(target);
  if (!el) return;

  const getOffset = () => {
    if (typeof cfg.offset === 'number') return cfg.offset;
    if (typeof cfg.offset === 'function') {
      try {
        const v = cfg.offset(el);
        if (Number.isFinite(v)) return v;
      } catch {}
    }
    const header = document.querySelector('header[role="banner"]');
    return header?.offsetHeight || 72;
  };

  const rect = el.getBoundingClientRect();
  const toY = Math.max(0, rect.top + (window.scrollY || window.pageYOffset) - getOffset() - 6);

  if (prefersReduce || !cfg.duration || cfg.duration <= 0) {
    window.scrollTo(0, Math.round(toY));
  } else {
    const startY = window.scrollY || window.pageYOffset || 0;
    const delta = toY - startY;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    await new Promise((res) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / (cfg.duration || 420));
        window.scrollTo(0, Math.round(startY + delta * ease(t)));
        if (t < 1) requestAnimationFrame(step);
        else res();
      };
      requestAnimationFrame(step);
    });
  }

  // Foco accesible opcional (por defecto true)
  if (cfg.focusTarget !== false) {
    try {
      el.setAttribute('tabindex', el.getAttribute('tabindex') ?? '-1');
      el.focus({ preventScroll: true });
    } catch {}
  }
}

export default useSmoothAnchorScroll;
// --- END OF FILE
