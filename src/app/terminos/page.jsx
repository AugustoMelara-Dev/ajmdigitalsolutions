// --- FILE: app/terminos/page.jsx ---
import Section from "@/components/ui/Section";

export const metadata = {
  title: "Términos y Condiciones | AJM Digital Solutions",
  description:
    "Condiciones de uso del sitio y de los servicios de AJM Digital Solutions.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  const updatedAt = new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <Section
      id="terminos"
      title="Términos y Condiciones"
      subtitle="Reglas claras para un trabajo claro."
      className="relative bg-[var(--ajm-bg)]"
      align="center"         // Encabezado centrado
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

        <h3>1. Aceptación de los términos</h3>
        <p>
          Al usar este sitio o solicitar nuestros servicios, aceptas estos Términos y cualquier
          política vinculada desde aquí.
        </p>

        <h3>2. Propiedad intelectual</h3>
        <p>
          El contenido de este sitio (texto, diseño, gráficos y código) es propiedad de
          AJM Digital Solutions. No está permitido copiarlo o reutilizarlo sin autorización.
        </p>

        <h3>3. Descripción de servicios</h3>
        <p>
          Desarrollamos sitios web y soluciones digitales. Cada proyecto se rige por una
          propuesta/alcance aprobado que detalla entregables, plazos y precios.
        </p>

        <h3>4. Responsabilidades</h3>
        <ul>
          <li>Entregamos trabajo de calidad acorde al alcance acordado.</li>
          <li>
            No garantizamos resultados económicos específicos (ventas, posiciones exactas en buscadores, etc.).
          </li>
          <li>El cliente provee contenido veraz, materiales y aprobaciones en tiempo.</li>
        </ul>

        <h3>5. Pagos y reembolsos</h3>
        <p>
          A menos que se indique lo contrario, trabajamos con 50% anticipo y 50% al finalizar.
          Los reembolsos se evaluarán caso por caso según el avance real del proyecto.
        </p>

        <h3>6. Soporte y correcciones</h3>
        <p>
          Incluimos correcciones dentro del alcance propuesto. Cambios adicionales o nuevas
          funcionalidades se cotizan aparte.
        </p>

        <h3>7. Legislación aplicable</h3>
        <p>
          Estos Términos se rigen por las leyes de Honduras. Cualquier disputa se resolverá en la
          jurisdicción competente.
        </p>
      </article>
    </Section>
  );
}
