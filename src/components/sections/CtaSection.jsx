/* --- FILE: src/components/sections/CtaSection.jsx (ARREGLADO Y NÍTIDO) --- */
/**
 * @file CtaSection.jsx
 * @description Sección CTA principal para WhatsApp, adaptada a Section (v2)
 * y 100% tematizada.
 */

'use client';

import React from 'react';
import Section from '@/components/ui/Section'; // Importa nuestro Section (v2)
import { Button } from '@/components/ui/Button';
import { MessageSquareText } from 'lucide-react';
import { cn, makeWaUrl } from '@/lib/utils';

// --- Configuración Específica (Esta lógica estaba perfecta) ---

/** Número de WhatsApp (sin '+', solo dígitos) desde variables de entorno. */
const RAW_PHONE = process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, '') || '';
/** Mensaje predeterminado para iniciar la conversación de pedido. */
const WA_ORDER_MESSAGE =
  'Hola El Jardín de la Abuela 🌿, vi su página y me interesan sus jabones artesanales. Quisiera hacer un pedido.';
/** URL completa para el botón de WhatsApp con UTMs específicos. */
const WA_HREF =
  makeWaUrl(RAW_PHONE, WA_ORDER_MESSAGE, {
    utm_source: 'landing-jardin-abuela',
    utm_medium: 'cta',
    utm_campaign: 'cta-order-section', // Campaña específica
  }) || null; // Null si no hay número

/**
 * Componente `CtaSection`.
 * Sección enfocada en la conversión principal: iniciar un pedido por WhatsApp.
 */
export default function CtaSection() {
  const hasWhatsApp = !!WA_HREF;

  return (
    <Section
      id="pedido" // ID para anclaje de navegación
      aria-labelledby="cta-heading"
      // --- ¡AQUÍ ESTÁ EL ARREGLO #1! ---
      // 1. Usamos la prop 'bg' para poner el fondo 'crema' (base).
      //    Esto crea un diseño "sandwich" (base -> alt -> base).
      bg="base"
      // 2. Quitamos el 'bg-*' del className.
      className={cn(
        'relative py-16 md:py-24', // Padding
        'overflow-hidden'
      )}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 350px' }}
    >
      {/* Contenedor centrado (Esto estaba perfecto) */}
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <h2
          id="cta-heading"
          className={cn(
            'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
            'text-[--color-foreground]' // Variable del tema
          )}
        >
          ¿Lista para tu Pedido?
        </h2>

        {/* Párrafo descriptivo */}
        <p
          className={cn(
            'mx-auto mt-4 max-w-xl text-lg leading-relaxed',
            'text-[--color-foreground-muted]' // Variable del tema
          )}
        >
          Haz clic en el botón para enviarnos un mensaje directo por WhatsApp.
          ¡Te atenderemos con gusto para tomar tu pedido de jabones artesanales!
        </p>

        {/* Botón Principal de WhatsApp (Esto estaba perfecto) */}
        <div className="mt-8 sm:mt-10">
          <Button
            href={hasWhatsApp ? WA_HREF : undefined}
            variant="primary" // Variante principal (ya tiene sombra)
            size="lg" // Botón grande
            leadingIcon={MessageSquareText}
            target={hasWhatsApp ? '_blank' : undefined}
            rel={hasWhatsApp ? 'noopener noreferrer nofollow' : undefined}
            disabled={!hasWhatsApp}
            aria-disabled={!hasWhatsApp}
            aria-label={
              hasWhatsApp
                ? 'Iniciar pedido por WhatsApp'
                : 'WhatsApp no configurado'
            }
            // --- ¡AQUÍ ESTÁ EL ARREGLO #3! ---
            // Se quitaron las clases 'shadow-lg hover:shadow-xl'
            // porque la variant="primary" de Button.jsx (v2) ya las maneja.
            className="transition-shadow duration-300 ease-out"
            data-analytics-id="cta_whatsapp_order_button"
          >
            {hasWhatsApp
              ? 'Hacer un Pedido por WhatsApp'
              : 'Contacto No Disponible'}
          </Button>
        </div>

        {/* Mensaje de ayuda o fallback */}
        {!hasWhatsApp && (
          <p
            className={cn(
              'mt-4 text-sm',
              // --- ¡AQUÍ ESTÁ EL ARREGLO #2! ---
              // Usa la variable destructiva del tema, sin 'dark:'.
              'text-[rgb(var(--color-destructive-rgb))]'
            )}
          >
            (El contacto por WhatsApp no está configurado actualmente)
          </p>
        )}
        {hasWhatsApp && (
          <p className="mt-3 text-xs text-[--color-foreground-muted]">
            Respuesta rápida asegurada durante horario de atención.
          </p>
        )}
      </div>
    </Section>
  );
}
// --- END FILE ---