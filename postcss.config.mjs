// --- FILE: postcss.config.mjs (¡ARREGLADO SEGÚN EL ERROR!) ---
/**
 * @file postcss.config.mjs
 * @description Configuración de PostCSS usando strings (requerido por esta versión/setup).
 */

const config = {
  plugins: {
    // --- ¡AQUÍ ESTÁ EL ARREGLO! ---
    // Usamos el nombre del paquete como string, como pide el error.
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
// --- END FILE ---