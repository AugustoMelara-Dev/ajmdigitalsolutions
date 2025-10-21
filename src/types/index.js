// --- FILE: src/types/index.js ---
/**
 * @file index.js
 * @description Define las estructuras de datos (tipos) reutilizables para el proyecto
 * "El Jardín de la Abuela" usando JSDoc para documentación y claridad.
 * @note Mantenido en .js según solicitud. En un proyecto TypeScript, esto sería un archivo `.ts` con interfaces.
 */

/**
 * Representa la estructura de un producto (jabón) en el catálogo.
 * Se utiliza para asegurar consistencia en los datos a través de la aplicación.
 *
 * @typedef {object} Product
 * @property {string} id - Identificador único y estable para el producto (ej: "lavanda-miel-01"). Se recomienda usar slugs descriptivos. Usado como `key` en React.
 * @property {string} name - Nombre comercial completo y atractivo del jabón (ej: "Jabón Relajante de Lavanda y Miel").
 * @property {string} description - Descripción concisa (1-2 frases) enfocada en los beneficios principales, ingredientes clave, aroma o sensación (ej: "Calma tu piel y tus sentidos con lavanda francesa y miel pura. Ideal para la noche.").
 * @property {number} price - Precio de venta del producto en Lempiras (HNL), representado como un número (ej: 125). El formato se aplicará en el componente que lo muestre.
 * @property {string} imageUrl - Ruta relativa a la imagen principal del producto, comenzando desde la carpeta `public` (ej: "/images/jabon-lavanda-miel.jpg"). La imagen debe existir en `/public/images/`.
 */

// Este archivo solo define tipos usando JSDoc. No exporta ningún valor en tiempo de ejecución.
// Sirve como documentación centralizada para la estructura de datos `Product`.

// --- END OF FILE: src/types/index.js ---