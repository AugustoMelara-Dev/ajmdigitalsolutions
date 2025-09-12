// src/app/api/lead/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validation";
import DOMPurify from "isomorphic-dompurify";
import crypto from "node:crypto";
import { getAdminDb, AdminFieldValue } from "@/lib/firebase-admin";

const sanitize = (s) =>
  DOMPurify.sanitize(String(s ?? ""), { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true }).trim();

// CORS (opcional)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const okOrigin = (h) => {
  if (!ALLOWED_ORIGINS.length) return true; // mismo dominio
  const o = h.get("origin");
  const r = h.get("referer");
  return (o && ALLOWED_ORIGINS.includes(o)) || (r && ALLOWED_ORIGINS.some((x) => r.startsWith(x)));
};

const corsHeaders = (reqHeaders) => {
  if (!ALLOWED_ORIGINS.length) return {};
  const origin = reqHeaders.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }
  return {};
};

// Helpers
const ipFrom = (h) => h.get("x-forwarded-for")?.split(",")[0].trim() || "0.0.0.0";
const ipHash = (ip, ua) =>
  crypto.createHmac("sha256", process.env.RATE_LIMIT_SALT || "salt").update(`${ip}|${ua || ""}`).digest("hex");

async function checkRate(db, hash) {
  const ref = db.collection("rate_limits").doc(hash);
  const now = Date.now();
  const W = 60 * 60 * 1000; // 1h
  const MAX = 5;

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : null;
    let count = 0;
    let start = now;

    if (data && typeof data.windowStart === "number" && now - data.windowStart < W) {
      count = data.count || 0;
      start = data.windowStart;
    }
    if (count >= MAX) throw new Error("E_RATE_LIMIT");

    tx.set(
      ref,
      {
        count: count + 1,
        windowStart: start,
        updatedAt: AdminFieldValue.serverTimestamp(),
        // TTL: configura una política de TTL sobre expiresAt (Firestore → Reglas y TTL)
        expiresAt: new Date(now + W),
      },
      { merge: true },
    );
  });
}

async function verifyRecaptcha(token, ip) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !token) return { ok: true, score: null }; // opcional
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const j = await r.json();
    // si quieres, aplica umbral: if (j.score < 0.3) return { ok:false, score:j.score }
    return { ok: !!j.success, score: j.score ?? null };
  } catch (e) {
    console.error("[RECAPTCHA] Error:", e?.message);
    return { ok: false, score: null };
  }
}

export async function OPTIONS(req) {
  // Responder preflight si usas otros dominios
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers) });
}

export async function POST(req) {
  const H = req.headers;

  try {
    if (!okOrigin(H)) {
      return NextResponse.json(
        { success: false, code: "E_ORIGIN", message: "Origen no permitido" },
        { status: 403, headers: corsHeaders(H) },
      );
    }

    const len = Number(H.get("content-length") || 0);
    if (len > 25_000) {
      return NextResponse.json(
        { success: false, code: "E_PAYLOAD", message: "Payload demasiado grande" },
        { status: 413, headers: corsHeaders(H) },
      );
    }

    if (typeof ContactSchema?.safeParse !== "function") {
      console.error("[LEAD_API] ContactSchema inválido/mal importado");
      throw new Error("E_SCHEMA");
    }

    const { recaptchaToken, utm, ...raw } = await req.json().catch(() => ({}));

    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      // Zod v3 → error.issues
      const first = parsed.error.issues?.[0];
      return NextResponse.json(
        { success: false, code: "E_INPUT", message: first?.message || "Datos inválidos" },
        { status: 400, headers: corsHeaders(H) },
      );
    }

    const ip = ipFrom(H);
    const ua = H.get("user-agent") || "";
    const hash = ipHash(ip, ua);

    const db = getAdminDb();
    await checkRate(db, hash);

    const rec = await verifyRecaptcha(recaptchaToken, ip);
    if (!rec.ok) {
      return NextResponse.json(
        { success: false, code: "E_RECAPTCHA", message: "Fallo reCAPTCHA" },
        { status: 400, headers: corsHeaders(H) },
      );
    }

    const clean = {
      nombre: sanitize(parsed.data.nombre),
      email: sanitize(parsed.data.email),
      telefono: sanitize(parsed.data.telefono || ""),
      mensaje: sanitize(parsed.data.mensaje),
    };

    const payload = {
      ...clean,
      status: "new",
      source: "website_contact_form",
      utm: {
        source: sanitize(utm?.source || ""),
        medium: sanitize(utm?.medium || ""),
        campaign: sanitize(utm?.campaign || ""),
        content: sanitize(utm?.content || ""),
        term: sanitize(utm?.term || ""),
        referrer: sanitize(utm?.referrer || ""),
        page: sanitize(utm?.page || ""),
      },
      meta: { ipHash: hash, userAgent: sanitize(ua), recaptchaScore: rec.score },
      createdAt: AdminFieldValue.serverTimestamp(),
    };

    const ref = await db
      .collection("contactos")
      .add(payload)
      .catch((e) => {
        console.error("[FB_WRITE] Error:", { code: e.code, message: e.message });
        throw new Error("E_FB_WRITE");
      });

    return NextResponse.json(
      { success: true, id: ref.id, message: "Mensaje enviado correctamente" },
      { headers: corsHeaders(H) },
    );
  } catch (e) {
    const code = e?.message || "E_UNKNOWN";
    const map = {
      E_SCHEMA: { s: 500, m: "Error de configuración del servidor" },
      E_ORIGIN: { s: 403, m: "Origen no permitido" },
      E_PAYLOAD: { s: 413, m: "Payload demasiado grande" },
      E_INPUT: { s: 400, m: "Datos inválidos" },
      E_RECAPTCHA: { s: 400, m: "Fallo reCAPTCHA" },
      E_RATE_LIMIT: { s: 429, m: "Demasiados envíos. Intenta en una hora." },
      E_FB_INIT: { s: 500, m: "Error de inicialización de servicio" },
      E_FB_WRITE: { s: 500, m: "No se pudo guardar el mensaje" },
      E_FB_ENV_MISSING: { s: 500, m: "Configuración incompleta del servidor" },
      E_UNKNOWN: { s: 500, m: "Error del servidor" },
    };
    const { s, m } = map[code] || map.E_UNKNOWN;
    console.error("[LEAD_API]", code);
    return NextResponse.json({ success: false, code, message: m }, { status: s, headers: corsHeaders(req.headers) });
  }
}
