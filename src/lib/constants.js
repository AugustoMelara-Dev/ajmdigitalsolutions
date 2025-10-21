// --- FILE: src/lib/constants.js ---
/**
 * @file constants.js
 * @description Constantes globales para el proyecto "El Jardín de la Abuela".
 * @description Centraliza textos, enlaces y configuraciones reutilizables.
 */

// --- Información de la Marca ---

/** Nombre oficial del emprendimiento. */
export const BRAND_NAME = 'El Jardín de la Abuela';

/** Lema o tagline corto (opcional). */
export const BRAND_TAGLINE = 'Jabones Artesanales con Alma Natural';

/** Año actual para el copyright. */
export const CURRENT_YEAR = new Date().getFullYear();

// --- Navegación Principal (Simple para Landing Page) ---
// Define los enlaces que irán en el Navbar y posiblemente en el Footer.
// Asegúrate de que los `href` coincidan con los `id` de tus secciones.
export const NAV_ITEMS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Catálogo', href: '#catalogo' },
  // { label: 'Nosotros', href: '#nosotros' }, // Descomenta si usas la sección About
  { label: 'Pedido', href: '#pedido' }, // Enlace directo al CTA de WhatsApp
];

// --- Enlaces Sociales (Opcional) ---
// Añade aquí los enlaces si tu abuela tiene redes sociales para el emprendimiento.
export const SOCIAL_LINKS = {
  // facebook: 'https://facebook.com/usuario',
  // instagram: 'https://instagram.com/usuario',
  // whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, '') || ''}`, // Genera enlace directo si tienes el número en .env
};

// --- Textos Reutilizables (Opcional) ---
// Puedes añadir aquí textos que se repitan en varios lugares.
export const COMMON_TEXTS = {
  // handmadePromise: 'Elaborado 100% a mano con ingredientes naturales.',
  // shippingInfo: 'Envíos disponibles en San Pedro Sula.',
};

// --- Configuración Específica (Opcional) ---
// Si tienes alguna configuración específica del sitio.
// export const SITE_CONFIG = {
//   defaultLocale: 'es-HN',
// };

// Nota: Los datos de los productos (jabones) NO van aquí,
// deben ir en `src/lib/data.js` (o .ts) como ya lo planeamos.

// --- END OF FILE: src/lib/constants.js ---