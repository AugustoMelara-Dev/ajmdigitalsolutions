// --- FILE: src/app/robots.js ---
/**
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
  // Base canonical (sin slash final), usa dominio de prod por defecto
  const envBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://ajmdigitalsolutions.com';
  let base = envBase;
  try {
    base = new URL(envBase).origin;
  } catch {
    base = 'https://ajmdigitalsolutions.com';
  }
  const baseUrl = base.replace(/\/$/, '');

  // No index en entornos no productivos o si se fuerza por env
  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  const forceNoIndex = process.env.NEXT_PUBLIC_NOINDEX === 'true';
  const disallowAll = Boolean(isPreview || forceNoIndex);

  return {
    rules: disallowAll
      ? [{ userAgent: '*', disallow: '/' }]
      : [{ userAgent: '*', allow: '/' }],
    // Incluye el sitemap HTML y el feed RSS del blog
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/blog/feed.xml`],
    host: baseUrl,
  };
}
