/* --- FILE: src/components/mockups/BrowserMockup.jsx (CORREGIDO) --- */
"use client";

import Image from "next/image";
import React, { memo } from "react";

const cn = (...xs) => xs.filter(Boolean).join(" ");

function sanitize(href = "") {
  try {
    return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
  } catch { return href; }
}

function BrowserMockup({
  src = "/hero/laptop.webp",
  alt = "Vista previa de un proyecto web en navegador",
  href = "https://cliente-ejemplo.com",
  ratio = "16/10",
  priority = true, // <-- CORRECCIÓN: Cambiado a 'true' por defecto
  className = "",
}) {
  return (
    <figure
      className={cn(
        "relative mx-auto overflow-hidden rounded-3xl",
        "border border-white/12 bg-white/[.045] backdrop-blur-sm",
        "ring-1 ring-white/12 shadow-md hover:shadow-lg transition-shadow duration-200",
        className
      )}
      style={{ aspectRatio: ratio }}
      aria-label="Navegador con captura de sitio web"
    >
      {/* Barra del navegador */}
      <div
        className={cn(
          "absolute left-0 right-0 top-0 z-10 flex items-center gap-2",
          "h-9 px-4 border-b border-white/10",
          "bg-black/30 backdrop-blur-md"
        )}
        role="presentation"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
          <span className="h-3 w-3 rounded-full bg-green-400/90" />
        </div>
        <div className="ml-3 flex-1">
          <div
            className="mx-auto max-w-[72%] rounded-lg px-3 py-1 text-xs border border-white/10 bg-white/5 text-white/85 truncate"
            aria-label="Barra de direcciones"
          >
            {sanitize(href)}
          </div>
        </div>
      </div>

      {/* Lienzo */}
      <div className="absolute inset-0 pt-9">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          className="object-contain select-none"
          fetchPriority={priority ? "high" : undefined}
          draggable={false}
        />
      </div>
    </figure>
  );
}

export default memo(BrowserMockup);