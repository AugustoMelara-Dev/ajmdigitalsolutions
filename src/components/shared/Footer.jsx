/* --- FILE: src/components/shared/Footer.jsx (NÍTIDO Y LISTO) --- */
/**
 * @file Footer.jsx
 * @description Pie de página para "El Jardín de la Abuela", 100% tematizado
 * y con corrección de bug de hidratación de Next.js.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

// Dependencias de nuestro proyecto (Asegúrate de que existan)
import { BRAND_NAME, NAV_ITEMS, CURRENT_YEAR } from '@/lib/constants';
import { cn } from '@/lib/utils';

// --- Enlaces Legales (Simplificado) ---
const LEGAL_LINKS = [{ label: 'Contacto Directo', href: '#pedido' }];

/**
 * Componente `Footer`.
 * Renderiza el pie de página del sitio con lógica segura para Next.js.
 */
export default function Footer() {
  // --- ¡CORRECCIÓN CRÍTICA (BUG DE HIDRATACIÓN)! ---
  // Usamos useState y useEffect para cargar datos del cliente de forma segura.
  const [contactInfo, setContactInfo] = useState({
    phoneDisplay: 'WhatsApp no disponible',
    whatsappHref: '#pedido',
    emailContact: '',
  });

  useEffect(() => {
    // Esta lógica ahora solo se ejecuta en el navegador, evitando errores.
    const rawPhone =
      process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, '') || '';
    const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''; // No pongas un email falso aquí

    let display = 'WhatsApp no disponible';
    if (rawPhone) {
      // Formato simple para Honduras (504 9876-5432)
      display = `+${rawPhone.slice(0, 3)} ${rawPhone.slice(
        3,
        7
      )}-${rawPhone.slice(7)}`;
    }

    setContactInfo({
      phoneDisplay: display,
      whatsappHref: rawPhone
        ? `https://wa.me/${rawPhone}?text=Hola%20${encodeURIComponent(
            BRAND_NAME
          )}%2C%20tengo%20una%20consulta%20desde%20la%20página.`
        : '#pedido',
      emailContact: email,
    });
  }, []); // El array vacío [] asegura que se ejecute solo una vez.

  // Anillo de foco adaptado al fondo oscuro del footer
  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-footer-bg] rounded';

  return (
    <footer
      id="site-footer"
      role="contentinfo"
      // Estilo: Usa las variables de footer definidas en globals.css
      className="relative bg-[--color-footer-bg] text-[--color-footer-text]"
    >
      {/* Separador superior sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[--color-footer-border]/50 to-transparent"
      />

      {/* Contenedor principal */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-12 items-start">
          {/* Col 1: Marca y Descripción */}
          <div className="sm:col-span-12 lg:col-span-5">
            <h3 className="text-2xl font-semibold tracking-tight text-[--color-footer-heading]">
              {BRAND_NAME}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[--color-footer-text-muted]">
              Jabones artesanales hechos con ingredientes naturales y amor
              familiar. Cuida tu piel con la pureza del jardín.
            </p>
          </div>

          {/* Col 2: Navegación Rápida */}
          <nav
            aria-label="Navegación del sitio"
            className="sm:col-span-6 lg:col-span-3 lg:justify-self-center"
          >
            <h4 className="text-sm font-semibold text-[--color-footer-heading] mb-3">
              Explora
            </h4>
            <ul className="space-y-2 text-sm">
              {(NAV_ITEMS || []).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-[--color-footer-link] hover:text-[--color-footer-link-hover] transition-colors',
                      focusRing
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3: Contacto y Legal */}
          <div className="sm:col-span-6 lg:col-span-4">
            <h4 className="text-sm font-semibold text-[--color-footer-heading] mb-3">
              Contacto
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  className="h-4 w-4 flex-shrink-0 text-[--color-footer-icon]"
                  aria-hidden="true"
                />
                <span className="text-[--color-footer-text-muted]">
                  San Pedro Sula, Honduras (Envíos locales)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="h-4 w-4 flex-shrink-0 text-[--color-footer-icon]"
                  aria-hidden="true"
                />
                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={cn(
                    'text-[--color-footer-link] hover:text-[--color-footer-link-hover] transition-colors',
                    focusRing
                  )}
                >
                  {contactInfo.phoneDisplay}
                </a>
              </li>
              {/* Email (solo se muestra si existe) */}
              {contactInfo.emailContact && (
                <li className="flex items-start gap-3">
                  <Mail
                    className="h-4 w-4 flex-shrink-0 text-[--color-footer-icon]"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${
                      contactInfo.emailContact
                    }?subject=Consulta%20-%20${encodeURIComponent(BRAND_NAME)}`}
                    className={cn(
                      'text-[--color-footer-link] hover:text-[--color-footer-link-hover] transition-colors',
                      focusRing
                    )}
                  >
                    {contactInfo.emailContact}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Barra Inferior: Copyright y Crédito */}
        <div className="mt-10 border-t border-[--color-footer-border] pt-6 pb-8 text-center md:text-left">
          <p className="text-xs text-[--color-footer-text-muted]">
            © {CURRENT_YEAR || new Date().getFullYear()} {BRAND_NAME}. Todos los
            derechos reservados.
          </p>
          {/* Crédito del desarrollador */}
          <p className="mt-1 text-xs text-[--color-footer-text-muted]">
            Hecho con{' '}
            <Heart
              className={cn(
                'inline h-3 w-3 fill-current',
                // --- ¡CIRUGÍA DE ESTILO! ---
                // Usa el color primario del tema, no 'pink-400'
                'text-[--color-primary]'
              )}
              aria-label="amor"
            />{' '}
            por{' '}
            <a
              href="https://ajmdigitalsolutions.com" // Tu sitio
              target="_blank"
              rel="noopener noreferrer author" // 'author' es bueno para SEO
              className={cn(
                'font-medium text-[--color-footer-link] hover:text-[--color-footer-link-hover] underline underline-offset-2 transition-colors',
                focusRing
              )}
            >
              AJM Digital Solutions
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
// --- END FILE ---