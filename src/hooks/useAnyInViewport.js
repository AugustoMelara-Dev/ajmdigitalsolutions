// --- FILE: src/hooks/useAnyInViewport.js ---
import { useState, useEffect, useRef } from 'react';

/**
 * Detecta si **cualquiera** de los selectores dados es visible en el viewport.
 * - Acepta string o array de strings (se deduplican y limpian).
 * - Fallback sin IntersectionObserver con rAF para evitar jank.
 * - Reacciona si los elementos aparecen después (MutationObserver).
 * - Evita re-renders innecesarios (solo setState si cambia el valor).
 *
 * @param {string|string[]} selectors
 * @param {object} [options]
 * @param {Element|null} [options.root=null]
 * @param {string} [options.rootMargin='0px 0px -20% 0px']
 * @param {number|number[]} [options.threshold=0]
 * @returns {boolean} true si al menos uno es visible
 */
export function useAnyInViewport(selectors, options) {
  const [isIn, setIsIn] = useState(false);
  const lastVal = useRef(false);

  // Normaliza + dedup de selectores y crea una clave estable
  const selectorKey = Array.isArray(selectors)
    ? [...new Set(selectors.filter(Boolean).map((s) => String(s).trim()))].join(',')
    : (selectors || '').toString().trim();

  // Desestructura options con defaults (por valor para deps estables)
  const {
    root = null,
    rootMargin = '0px 0px -20% 0px',
    threshold = 0,
  } = options || {};

  // Claves de dependencia seguras (arrays -> JSON)
  const thresholdKey =
    Array.isArray(threshold) ? JSON.stringify(threshold) : String(threshold);

  useEffect(() => {
    if (typeof window === 'undefined' || !selectorKey) return;

    // Helper para emitir cambios sin disparar renders redundantes
    const emit = (val) => {
      if (lastVal.current !== val) {
        lastVal.current = val;
        setIsIn(val);
      }
    };

    // ===== Fallback si no hay IntersectionObserver =====
    if (!('IntersectionObserver' in window)) {
      let frame = null;

      const check = () => {
        frame = null;
        const els = document.querySelectorAll(selectorKey);
        let any = false;
        els.forEach((el) => {
          const r = el.getBoundingClientRect?.();
          if (!r) return;
          const hasArea = r.width > 0 && r.height > 0;
          const onScreen = r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
          if (hasArea && onScreen) any = true;
        });
        emit(any);
      };

      const schedule = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(check);
      };

      // Comprobación inicial y oyentes
      schedule();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);

      // Si aún no existen los elementos, observa el DOM
      const mo = new MutationObserver(schedule);
      mo.observe(document.body, { childList: true, subtree: true });

      return () => {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        mo.disconnect();
      };
    }

    // ===== Ruta con IntersectionObserver =====
    let io = null;
    let mo = null;

    const attachIO = () => {
      const elements = Array.from(document.querySelectorAll(selectorKey));
      if (!elements.length) return false;

      io = new IntersectionObserver(
        (entries) => {
          // Si cualquiera intersecta, true
          const any = entries.some((e) => e.isIntersecting);
          emit(any);
        },
        { root, rootMargin, threshold }
      );

      elements.forEach((el) => io.observe(el));
      return true;
    };

    // Intenta adjuntar de inmediato
    const attached = attachIO();

    // Si no hubo elementos todavía, observa el DOM hasta que aparezcan
    if (!attached) {
      mo = new MutationObserver(() => {
        if (attachIO()) {
          mo.disconnect();
          mo = null;
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      io?.disconnect();
      mo?.disconnect();
    };
  }, [selectorKey, root, rootMargin, thresholdKey]);

  return isIn;
}

export default useAnyInViewport;
