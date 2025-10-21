// src/components/sections/ContactSection.jsx (o .tsx)
"use client";
import Section from "@/components/ui/Section";
import ContactForm from "@/components/shared/ContactForm";

export default function ContactSection() {
  return (
    <Section
      id="contacto"
      title="Solicita tu cotización"
      subtitle="Cuéntanos tu proyecto y te respondemos en menos de 24h."
      className="relative bg-[var(--ajm-bg)]"
    >
      <div className="mx-auto max-w-6xl">
        <ContactForm />   {/* ← solo el formulario, sin sidecards */}
      </div>
    </Section>
  );
}
