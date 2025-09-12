// --- FILE: src/app/sitemap.js ---
import { getAllPostsMeta } from '@/lib/blog';

/**
 * @returns {import('next').MetadataRoute.Sitemap}
 */
export default function sitemap() {
  // Base canonical (sin slash final)
  const envBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://ajmdigitalsolutions.com';
  let base = envBase;
  try {
    base = new URL(envBase).origin; // normaliza y asegura esquema
  } catch {
    base = 'https://ajmdigitalsolutions.com';
  }

  const baseUrl = base.replace(/\/$/, '');

  // Blog posts
  const posts =
    getAllPostsMeta().map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.date).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) || [];

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Añade aquí otras páginas estáticas si existen:
    // { url: `${baseUrl}/servicios`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
    // { url: `${baseUrl}/contacto`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },

    ...posts,
    
  ];
  
}
