// src/lib/contactSubmission.js
export async function submitContactForm(payload) {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production" && data?.code) {
      console.warn("[Lead API error code]", data.code);
    }
    throw new Error(data?.message || "No pudimos enviar tu mensaje. Intenta nuevamente.");
  }

  return data;
}
