// --- FILE: src/lib/data.js ---
/**
 * @file data.js
 * @description Datos de ejemplo para el catálogo de productos de "El Jardín de la Abuela".
 * @description Este archivo exporta un array de objetos `Product` que se utilizarán
 * para poblar la sección del catálogo en la landing page.
 * @note Mantenido en .js según solicitud. Idealmente, se usaría con tipos de `src/types/index.ts`.
 */

/**
 * @typedef {object} Product
 * @property {string} id - Identificador único del producto (ej: "lavanda-01").
 * @property {string} name - Nombre comercial del jabón o producto.
 * @property {string} description - Descripción breve enfocada en beneficios o ingredientes clave.
 * @property {number} price - Precio numérico en Lempiras (HNL).
 * @property {string} imageUrl - Ruta relativa a la imagen del producto en `/public/images/`.
 */

/**
 * Array con los datos de los productos (jabones) disponibles en el catálogo.
 * Cada objeto debe cumplir con la estructura definida (implícitamente) por `Product`.
 *
 * @type {Product[]}
 */
export const products = [
  {
    id: 'lavanda-miel-01',
    name: 'Jabón Relajante de Lavanda y Miel',
    description: 'Calma tu piel y tus sentidos con lavanda francesa y miel pura. Ideal para la noche.',
    price: 125, // Precio en Lempiras
    imageUrl: '/images/jabon-lavanda-miel.jpg', // Asegúrate de tener esta imagen en public/images/
  },
  {
    id: 'avena-karite-02',
    name: 'Jabón Nutritivo de Avena y Karité',
    description: 'Suavidad exfoliante con avena coloidal y nutrición profunda de manteca de karité virgen.',
    price: 115,
    imageUrl: '/images/jabon-avena-karite.jpg', // Asegúrate de tener esta imagen
  },
  {
    id: 'citricos-verbena-03',
    name: 'Jabón Energizante de Cítricos y Verbena',
    description: 'Despierta tus mañanas con la frescura vibrante de naranja, limón y un toque herbal de verbena.',
    price: 120,
    imageUrl: '/images/jabon-citricos-verbena.jpg', // Asegúrate de tener esta imagen
  },
  {
    id: 'rosa-mosqueta-04',
    name: 'Jabón Regenerador de Rosa Mosqueta',
    description: 'Un lujo para pieles maduras o secas, con aceite de rosa mosqueta rico en antioxidantes.',
    price: 135,
    imageUrl: '/images/jabon-rosa-mosqueta.jpg', // Asegúrate de tener esta imagen
  },
];

// --- END OF FILE: src/lib/data.js ---