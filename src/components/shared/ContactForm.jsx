// --- FILE: src/components/forms/ContactForm.jsx ---
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, CheckCircle, AlertCircle, MessageCircle } from "lucide-react";
import { ContactSchema } from "@/lib/validation";
import { submitContactForm } from "@/lib/contactSubmission";

/* Utils */
const cn = (...xs) => xs.filter(Boolean).join(" ");
const clamp = (s, n) => String(s || "").slice(0, n);
const makeWaUrl = (number, text, utm = {}) => {
  const d = String(number || "").replace(/\D/g, "");
  if (!/^\d{7,15}$/.test(d)) return null; // E.164 7–15 dígitos
  const q = new URLSearchParams({ text: String(text || "") });
  for (const [k, v] of Object.entries(utm)) if (v) q.append(k, String(v));
  return `https://wa.me/${d}?${q.toString()}`;
};
const toE164 = (v) => {
  const d = String(v || "").replace(/\D/g, "");
  return d ? `+${d}` : "";
};
const collectUtm = () => {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const p = url.searchParams;
  return {
    source: p.get("utm_source") || "direct",
    medium: p.get("utm_medium") || "",
    campaign: p.get("utm_campaign") || "",
    content: p.get("utm_content") || "",
    term: p.get("utm_term") || "",
    referrer: document.referrer || "",
    page: url.pathname + url.search,
  };
};

/* -------- Rate limit (cliente) — cuenta SOLO envíos exitosos -------- */
const RATE_LIMIT_KEY = "contact_form_submissions";
const MAX_SUBMISSIONS = 3;
const TIME_WINDOW = 60 * 60 * 1000; // 1h

const readTimes = () => {
  try { return JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || "[]"); }
  catch { return []; }
};
const pruneTimes = (ts) => ts.filter((t) => Date.now() - t < TIME_WINDOW);
const isRateLimited = () =>
  (process.env.NODE_ENV !== "production")
    ? false
    : pruneTimes(readTimes()).length >= MAX_SUBMISSIONS;
const noteSubmission = () => {
  const arr = pruneTimes(readTimes());
  arr.push(Date.now());
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(arr));
};

/* reCAPTCHA v3 opcional */
async function executeRecaptcha() {
  if (typeof window === "undefined" || !window.grecaptcha) return null;
  try {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return null;
    return await window.grecaptcha.execute(siteKey, { action: "contact_form" });
  } catch {
    return null;
  }
}

/* ENV */
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
const DEFAULT_MSG =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Hola AJM. Vi su sitio web y me gustaría recibir orientación sobre sus servicios. ¡Gracias!";

/* UX */
const DRAFT_KEY = "ajm_contact_draft_secure";
const MAX_MSG = 500;

/* -------- Modal centrado (overlay) -------- */
function CenterNotice({ show, type = "success", text, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [show, onClose]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  useEffect(() => {
    if (show) closeBtnRef.current?.focus?.();
  }, [show]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 grid place-items-center transition-all",
        show ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!show}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
          show ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative mx-4 w-full max-w-md rounded-2xl border border-white/10 p-5 text-center",
          "bg-[#0A1525] shadow-2xl transition-all",
          show ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-1 opacity-0"
        )}
      >
        <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full border border-white/15">
          {type === "success" ? (
            <CheckCircle className="text-emerald-400" size={22} aria-hidden="true" />
          ) : (
            <AlertCircle className="text-red-400" size={22} aria-hidden="true" />
          )}
        </div>
        <p className={cn("text-sm leading-relaxed", type === "success" ? "text-emerald-200" : "text-red-200")}>
          {text}
        </p>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0A1525] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)] focus:ring-offset-2 focus:ring-offset-[#0A1525]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function ContactForm() {
  const startedAtRef = useRef(Date.now());
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
    website: "", // honeypot
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const [notice, setNotice] = useState({ show: false, type: "success", text: "" });

  /* Draft */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm((p) => ({ ...p, ...JSON.parse(saved) }));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      const { website, ...toSave } = form;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
    } catch {}
  }, [form.nombre, form.telefono, form.email, form.mensaje]);

  /* Validación por campo (Zod v3 → error.issues) */
  const validateField = (name, value) => {
    const shape = ContactSchema.shape?.[name];
    if (!shape) return "";
    const parsed = shape.safeParse(value);
    return parsed.success ? "" : parsed.error.issues?.[0]?.message || "Valor inválido";
  };

  const handleChange = (name) => (e) => {
    const value = name === "mensaje" ? clamp(e.target.value, MAX_MSG) : e.target.value;
    setForm((p) => ({ ...p, [name]: value }));
    const msg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const focusFirstInvalid = (errs) => {
    const first = Object.keys(errs).find((k) => errs[k]);
    if (first) document.querySelector(`[name="${first}"]`)?.focus?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.website) return; // honeypot

    if (isRateLimited()) {
      setNotice({ show: true, type: "error", text: "Demasiados envíos. Intenta en una hora." });
      return;
    }

    const parsed = ContactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path?.[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      focusFirstInvalid(fieldErrors);
      return;
    }

    setBusy(true);
    try {
      const utm = collectUtm();
      const recaptchaToken = await executeRecaptcha();
      const durationMs = Date.now() - startedAtRef.current;

      const res = await submitContactForm({
        ...parsed.data,
        telefonoE164: toE164(parsed.data.telefono),
        recaptchaToken,
        utm,
        durationMs,
      });

      if (!res?.success) throw new Error("No se pudo enviar");

      // ✓ contar envío exitoso
      noteSubmission();

      setNotice({
        show: true,
        type: "success",
        text: "¡Tu mensaje fue enviado con éxito! Te contactaremos muy pronto.",
      });
      setForm({ nombre: "", telefono: "", email: "", mensaje: "", website: "" });
      setErrors({});
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ nombre: "", telefono: "", email: "", mensaje: "" }));
      } catch {}
    } catch (err) {
      setNotice({
        show: true,
        type: "error",
        text: err?.message || "Ocurrió un error. Inténtalo nuevamente.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* WhatsApp directo (separado del formulario) */
  const waCTA =
    RAW_PHONE &&
    makeWaUrl(RAW_PHONE, DEFAULT_MSG, {
      utm_source: "form",
      utm_medium: "whatsapp",
      utm_campaign: "contact_direct",
    });

  return (
    <>
      <CenterNotice
        show={notice.show}
        type={notice.type}
        text={notice.text}
        onClose={() => setNotice((s) => ({ ...s, show: false }))}
      />

      <div
        className={cn(
          "mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5",
          "p-6 md:p-8 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,.25)]"
        )}
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 680px" }}
      >
        <div className="mb-5">
          <h3 className="text-[clamp(1.25rem,3.6vw,1.5rem)] font-semibold text-ajm-white">
            Solicita tu consulta
          </h3>
          <p className="text-[clamp(.9rem,2.4vw,1rem)] text-ajm-ink">Te respondemos en &lt; 24h.</p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-5" aria-busy={busy}>
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange("website")}
            className="absolute left-[-9999px] opacity-0"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div>
            <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-ajm-ink">
              Nombre *
            </label>
            <input
              id="nombre"
              name="nombre"
              autoComplete="name"
              value={form.nombre}
              onChange={handleChange("nombre")}
              className={cn(
                "w-full rounded-xl border bg-white/8 px-4 py-3 text-ajm-white placeholder:text-ajm-muted backdrop-blur-sm",
                "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)]",
                errors.nombre ? "border-red-400/40" : "border-white/10"
              )}
              placeholder="Tu nombre"
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? "err-nombre" : undefined}
              maxLength={50}
            />
            {errors.nombre && (
              <p id="err-nombre" className="mt-1 text-xs text-red-300" role="alert">
                {errors.nombre}
              </p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-ajm-ink">
                Teléfono *
              </label>
              <input
                id="telefono"
                name="telefono"
                inputMode="tel"
                autoComplete="tel"
                value={form.telefono}
                onChange={handleChange("telefono")}
                className={cn(
                  "w-full rounded-xl border bg-white/8 px-4 py-3 text-ajm-white placeholder:text-ajm-muted backdrop-blur-sm",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)]",
                  errors.telefono ? "border-red-400/40" : "border-white/10"
                )}
                placeholder="+506 8888 8888, +52 55 1234 5678…"
                aria-invalid={!!errors.telefono}
                aria-describedby={errors.telefono ? "err-telefono hint-tel" : "hint-tel"}
                maxLength={20}
              />
              <small id="hint-tel" className="mt-1 block text-xs text-ajm-muted">
                Formato internacional con código de país (E.164).
              </small>
              {errors.telefono && (
                <p id="err-telefono" className="mt-1 text-xs text-red-300" role="alert">
                  {errors.telefono}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ajm-ink">
                Correo (opcional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                className={cn(
                  "w-full rounded-xl border bg-white/8 px-4 py-3 text-ajm-white placeholder:text-ajm-muted backdrop-blur-sm",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)]",
                  errors.email ? "border-red-400/40" : "border-white/10"
                )}
                placeholder="tu@email.com (opcional)"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
                maxLength={100}
              />
              {errors.email && (
                <p id="err-email" className="mt-1 text-xs text-red-300" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="mensaje" className="mb-1.5 block text-sm font-medium text-ajm-ink">
              Mensaje *
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              value={form.mensaje}
              onChange={handleChange("mensaje")}
              className={cn(
                "w-full resize-y rounded-xl border bg-white/8 px-4 py-3 text-ajm-white placeholder:text-ajm-muted backdrop-blur-sm",
                "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)]",
                errors.mensaje ? "border-red-400/40" : "border-white/10"
              )}
              placeholder="Cuéntame brevemente tu proyecto…"
              aria-invalid={!!errors.mensaje}
              aria-describedby={errors.mensaje ? "err-mensaje msg-count" : "msg-count"}
              maxLength={MAX_MSG}
            />
            <div id="msg-count" className="mt-1 text-xs text-ajm-muted">
              {MAX_MSG - (form.mensaje?.length || 0)} caracteres restantes
            </div>
            {errors.mensaje && (
              <p id="err-mensaje" className="mt-1 text-xs text-red-300" role="alert">
                {errors.mensaje}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={busy}
              aria-disabled={busy ? "true" : "false"}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold",
                "min-h-[44px] bg-white text-[#0A192F] shadow-lg shadow-ajm-accent/20",
                "hover:bg-[#EFF3F8] transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)] focus:ring-offset-2 focus:ring-offset-[var(--ajm-bg)]",
                busy && "opacity-60 cursor-not-allowed"
              )}
            >
              {busy ? "Enviando…" : <Send size={18} aria-hidden="true" />} {busy ? "" : "Enviar mensaje"}
            </button>

            {RAW_PHONE && (
              <a
                href={
                  waCTA || "#contacto"
                }
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold",
                  "min-h-[44px] border border-white/10 bg-white/5 text-ajm-white backdrop-blur-sm",
                  "hover:bg-white/10 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--ajm-accent)] focus:ring-offset-2 focus:ring-offset-[var(--ajm-bg)]"
                )}
                title="Escribir por WhatsApp"
              >
                <MessageCircle size={16} aria-hidden="true" /> Escribir por WhatsApp
              </a>
            )}
          </div>

          <p className="text-[clamp(.8rem,2.2vw,.9rem)] text-ajm-muted">
            Al enviar aceptas nuestra <a className="underline" href="/privacidad">Política de Privacidad</a>.
            Respuesta promedio: <strong>~2 horas</strong> hábiles.
          </p>
        </form>
      </div>
    </>
  );
}
