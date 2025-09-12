"use client";

import React from "react";
import Link from "next/link";

// --- FIX: Define the 'cn' utility function ---
const cn = (...xs) => xs.filter(Boolean).join(" ");

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-2xl " +
  "transition-[background,opacity,transform] duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)] focus:ring-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none min-h-[44px]";

const sizes = {
  sm: "h-9 px-3 text-[clamp(.85rem,2.2vw,.95rem)]",
  md: "h-11 px-4 text-[clamp(.9rem,2.4vw,1rem)]",
  lg: "h-12 px-5 text-[clamp(1rem,2.6vw,1.125rem)]",
};

const variants = {
  /** Botón principal en fondos claros */
  primary:
    "bg-brand text-white hover:opacity-90 active:opacity-95 " +
    "shadow-lg shadow-ajm-accent/20",
  /** Acción alternativa en fondos claros */
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 " +
    "border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700",
  /** Para fondos oscuros (tu “botón blanco”) */
  contrast:
    "bg-white text-[#0A192F] hover:bg-[#EFF3F8] active:bg-[#E7EDF5] " +
    "shadow-lg shadow-ajm-accent/20",
  /** Neutro dentro de cards/listas */
  outline:
    "bg-transparent border border-slate-300 text-slate-900 hover:bg-slate-50 " +
    "dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800/50",
  /** Acción de muy bajo peso visual */
  ghost:
    "bg-transparent text-brand hover:bg-brand/10 active:bg-brand/15 " +
    "dark:text-brand",
  /** Peligro/destruir */
  destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  /** Link con subrayado animado */
  link:
    "relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] " +
    "after:bg-current after:transition-all after:duration-200 hover:after:w-full " +
    "bg-transparent text-brand px-0",
};

export function Button({
  as = "button",
  href,
  variant = "primary",
  size = "md",
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}) {
  const Comp = href ? Link : as;
  const classes = cn(base, sizes[size], variants[variant], className);

  return (
    <Comp
      href={href}
      className={classes}
      aria-label={ariaLabel}
      {...props}
    >
      {LeadingIcon ? <LeadingIcon aria-hidden="true" className="-ml-0.5" /> : null}
      <span className="whitespace-nowrap">{children}</span>
      {TrailingIcon ? <TrailingIcon aria-hidden="true" className="-mr-0.5" /> : null}
    </Comp>
  );
}
