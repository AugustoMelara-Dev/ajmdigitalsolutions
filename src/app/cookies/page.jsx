// --- FILE: app/cookies/page.jsx ---
import Section from "@/components/ui/Section";

export const metadata = {
  title: "Política de Cookies | AJM Digital Solutions",
  description: "Qué cookies utiliza este sitio y con qué finalidad.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  const updatedAt = new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <Section
      id="cookies"
      title="Política de Cookies"
      subtitle="Lo que necesitas saber sobre las cookies de este sitio."
      className="relative bg-[var(--ajm-bg)]"
      align="center"          // centrado real del header
      container="tight"
      contentGap="md"
    >
      <article
        className="
          prose prose-invert mx-auto max-w-3xl
          text-ajm-ink
          prose-headings:text-ajm-white
          prose-strong:text-ajm-white
          prose-li:marker:text-ajm-ink/70
        "
      >
        <p className="mt-0">
          <strong>Última actualización:</strong> {updatedAt}
        </p>

        <h3>1. ¿Qué son las cookies?</h3>
        <p>
          Pequeños archivos que se almacenan en tu navegador para recordar
          preferencias, entender el uso del sitio y mejorar la experiencia.
        </p>

        <h3>2. Tipos de cookies que usamos</h3>
        <ul>
          <li>
            <strong>Técnicas/esenciales:</strong> permiten el funcionamiento
            básico del sitio.
          </li>
          <li>
            <strong>Analíticas (p. ej., Google Analytics):</strong> nos ayudan a
            entender visitas y uso del sitio de forma agregada.
          </li>
        </ul>

        <h3>3. Gestión de cookies</h3>
        <p>
          Puedes deshabilitarlas desde la configuración de tu navegador. Ten en
          cuenta que algunas funciones podrían dejar de operar correctamente.
        </p>
      </article>
    </Section>
  );
}
