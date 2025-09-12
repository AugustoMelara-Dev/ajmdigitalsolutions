// --- FILE: src/app/robots.js ---
/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  // Dominio canonical (sin slash final)
  const envBase =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ajmdigitalsolutions.com";
  let base = envBase;
  try {
    base = new URL(envBase).origin;
  } catch {
    base = "https://ajmdigitalsolutions.com";
  }
  const baseUrl = base.replace(/\/$/, "");

  // No index en previews o si lo fuerzas por env
  const isPreview =
    process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production";
  const forceNoIndex = process.env.NEXT_PUBLIC_NOINDEX === "true";
  const disallowAll = Boolean(isPreview || forceNoIndex);

  return {
    rules: disallowAll
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/" }],
    // Solo el sitemap XML (sin feed del blog)
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
