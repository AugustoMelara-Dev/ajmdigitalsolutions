'use client'
import React, { useId } from 'react'
import { CheckCircle2 } from 'lucide-react'

const cn = (...xs) => xs.filter(Boolean).join(' ')

export default function ReasonCard({
  title, desc, icon: Icon = CheckCircle2, as: Tag = 'article', className = '',
}) {
  const headingId = useId()
  return (
    <Tag
      aria-labelledby={headingId}
      tabIndex={0}
      className={cn(
        'h-full flex flex-col',                     // ⬅️ clave para igualar alturas
        'rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm',
        'shadow-[0_12px_35px_rgba(0,0,0,.30)]',
        'transition-[box-shadow,transform] duration-200',
        'hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ajm-accent)]/40',
        className
      )}
    >
      <div className="flex items-start gap-3 grow">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--ajm-accent)]/10 text-[var(--ajm-accent)]">
          <Icon size={18} aria-hidden="true" />
        </div>
        <div>
          <h3 id={headingId} className="text-[clamp(1.1rem,3vw,1.25rem)] font-bold leading-snug text-ajm-white">
            {title}
          </h3>
          <p className="mt-1 text-[clamp(0.95rem,2.3vw,1rem)] leading-relaxed text-ajm-ink">{desc}</p>
        </div>
      </div>
    </Tag>
  )
}
