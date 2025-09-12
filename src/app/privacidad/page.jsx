// --- FILE: app/privacidad/page.jsx ---
import Section from "@/components/ui/Section";

export const metadata = {
  title: "Política de Privacidad | AJM Digital Solutions",
  description: "Cómo recopilamos, usamos y protegemos tus datos personales.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  const updatedAt = new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <Section
      id="privacidad"
      title="Política de Privacidad"
      subtitle="Transparencia sobre el uso de tus datos."
      className="relative bg-[var(--ajm-bg)]"
      align="center"          // título y subtítulo centrados
      container="tight"
      contentGap="md"
    >
      <article
        className="
          prose prose-invert mx-auto max-w-3xl
          text-ajm-ink
          prose-headings:text-ajm-white
          prose-strong:text-ajm-white
          prose-a:text-ajm-white
          prose-li:marker:text-ajm-ink/70
        "
      >
        <p className="mt-0">
          <strong>Última actualización:</strong> {updatedAt}
        </p>

        <h3>1. Información que recopilamos</h3>
        <ul>
          <li>
            <strong>Formulario de contacto:</strong> nombre, email, teléfono y mensaje.
          </li>
          <li>
            <strong>Métricas anónimas:</strong> datos de uso (p. ej., Google Analytics).
          </li>
        </ul>

        <h3>2. Para qué usamos la información</h3>
        <ul>
          <li>Responder consultas y coordinar proyectos.</li>
          <li>Mejorar el contenido y rendimiento del sitio.</li>
          <li>Comunicaciones puntuales relacionadas a tu solicitud.</li>
        </ul>

        <h3>3. Compartición de datos</h3>
        <p>
          No vendemos tus datos. Solo los compartimos con servicios necesarios para operar
          (p. ej., hosting, analítica) respetando su propia normativa.
        </p>

        <h3>4. Conservación y seguridad</h3>
        <p>
          Conservamos los datos el tiempo mínimo necesario y aplicamos medidas razonables de
          seguridad para protegerlos.
        </p>

        <h3>5. Tus derechos</h3>
        <p>
          Puedes solicitar acceso, corrección o eliminación de tus datos escribiendo a{" "}
          <a href="mailto:ajmds.contact@gmail.com?subject=Solicitud%20de%20datos">
            ajmds.contact@gmail.com
          </a>.
        </p>

        <h3>6. Cambios</h3>
        <p>
          Podemos actualizar esta política. Publicaremos la nueva versión con fecha de vigencia.
        </p>
      </article>
    </Section>
  );
}
