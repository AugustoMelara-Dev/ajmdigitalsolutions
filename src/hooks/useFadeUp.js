// --- FILE: src/hooks/useFadeUp.js ---
import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Hook "fade-up" accesible y flexible.
 * - Respeta prefers-reduced-motion (sin movimiento ni demoras).
 * - Drop-in compatible con tu API actual.
 * - Extras: desplazamiento en X, opacidades, easing y helper de stagger.
 *
 * @param {object} [opts]
 * @param {number} [opts.y=12]                 Desplazamiento vertical inicial (px)
 * @param {number} [opts.x=0]                  Desplazamiento horizontal inicial (px)
 * @param {number} [opts.initialOpacity=0]     Opacidad inicial (0..1)
 * @param {number} [opts.enterOpacity=1]       Opacidad final (0..1)
 * @param {number} [opts.duration=0.45]        Duración de la animación
 * @param {number} [opts.delay=0]              Retardo inicial
 * @param {number} [opts.amount=0.2]           Porción visible para disparar (0..1)
 * @param {string} [opts.margin='0px 0px -80px 0px'] Root margin del viewport
 * @param {boolean} [opts.once=true]           Ejecutar solo una vez
 * @param {string|number[]} [opts.ease='easeOut'] Easing de Framer Motion
 * @returns {object} Props para <motion.*> (initial, whileInView, viewport, transition)
 */
export function useFadeUp(opts = {}) {
  const reduce = useReducedMotion();

  const {
    y = 12,
    x = 0,
    initialOpacity = 0,
    enterOpacity = 1,
    duration = 0.45,
    delay = 0,
    amount = 0.2,
    margin = '0px 0px -80px 0px',
    once = true,
    ease = 'easeOut',
  } = opts;

  return useMemo(
    () => ({
      initial: { opacity: initialOpacity, x: reduce ? 0 : x, y: reduce ? 0 : y },
      whileInView: { opacity: enterOpacity, x: 0, y: 0 },
      viewport: { once, amount, margin },
      transition: { duration: reduce ? 0 : duration, ease, delay: reduce ? 0 : delay },
    }),
    [reduce, x, y, initialOpacity, enterOpacity, duration, delay, amount, margin, once, ease]
  );
}

/**
 * Helper para calcular delay escalonado (stagger) sin boilerplate.
 * Ejemplo: delay={stagger(0, 0.06, idx)}
 *
 * @param {number} base   Delay base
 * @param {number} step   Incremento por índice
 * @param {number} index  Índice del ítem
 * @returns {number}
 */
export function stagger(base = 0, step = 0.05, index = 0) {
  return Math.max(0, base + step * (index || 0));
}

export default useFadeUp;
// --- END OF FILE
