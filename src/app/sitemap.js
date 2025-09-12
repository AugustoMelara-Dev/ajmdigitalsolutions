// --- FILE: src/app/sitemap.js ---
/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
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
  const now = new Date().toISOString();

  // Solo rutas REALES (no anchors #).
  // Añade/quita según tus páginas.
  const routes = [
    { path: "/", changeFrequency: "monthly", priority: 1.0 },
    { path: "/servicios", changeFrequency: "monthly", priority: 0.9 },
    { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 }, // bórrala si no existe
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
