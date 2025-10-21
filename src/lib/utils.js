/* --- FILE: src/lib/utils.js (¡ARCHIVO CRÍTICO NUEVO!) --- */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @function cn
 * @description Combina clases de Tailwind de forma inteligente,
 * evitando conflictos y condicionales.
 * @param {...(string | boolean | null | undefined)} inputs - Clases a combinar.
 * @returns {string} Las clases fusionadas.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * @function makeWaUrl
 * @description Crea una URL de WhatsApp segura con UTMs.
 * @param {string} phone - Número de teléfono (solo dígitos, ej. 504...).
 * @param {string} message - Mensaje predeterminado (ya encodeado).
 * @param {object} [utmParams] - Parámetros UTM opcionales.
 * @returns {string} La URL completa de WhatsApp.
 */
export function makeWaUrl(
  phone,
  message = '',
  utmParams = {}
) {
  if (!phone) return null;

  // Asegura que el mensaje esté encodeado
  const encodedMessage = encodeURIComponent(message);
  const baseUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Añade UTMs si existen
  const utmQuery = Object.entries(utmParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  // Devuelve la URL final
  return utmQuery ? `${baseUrl}&${utmQuery}` : baseUrl;
}
// --- END FILE ---