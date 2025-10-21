// --- FILE: src/lib/constants.js ---
import {
  Globe,
  Building2,
  ShoppingCart,
  Cpu,
  Rocket,
  Wrench,
  CheckCircle2,
  ShieldCheck as ShieldCheckIcon,
  CreditCard as CreditCardIcon,
  Layers as LayersIcon,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';

/* =========================
 * Servicios (tono multinacional)
 * ========================= */
export const SERVICES = [
  {
    icon: Globe,
    title: 'Landing Pages',
    desc: 'Páginas de alto impacto enfocadas en conversión y velocidad.',
    points: ['Entrega en 72h', 'Optimizada para anuncios/SEO', 'Analítica incluida'],
    time: '72h',
    popular: true,
  },
  {
    icon: Building2,
    title: 'Sitios Web Corporativos',
    desc: 'Arquitectura clara, 4–6 secciones, blog y SEO técnico base.',
    points: ['Copy orientado a negocio', 'SEO on-page completo', 'Integración con WhatsApp/Email'],
    time: '1–2 semanas',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce',
    desc: 'Tienda online completa con pagos, catálogo y gestión de inventario.',
    points: ['Pasarela de pago', 'Panel administrativo', 'Capacitación incluida'],
    time: '2–4 semanas',
  },
  {
    icon: Rocket,
    title: 'SEO & Posicionamiento',
    desc: 'Mejora de ranking, visibilidad local y orgánica.',
    points: ['Research de keywords', 'Fichas de negocio', 'Reportes mensuales'],
  },
  {
    icon: Cpu,
    title: 'Aplicaciones Web a Medida',
    desc: 'Dashboards, sistemas internos y herramientas personalizadas.',
    points: ['Autenticación segura', 'Panel admin', 'API REST/GraphQL'],
  },
  {
    icon: Wrench,
    title: 'Mantenimiento Web',
    desc: 'Soporte técnico, actualizaciones y backups automatizados.',
    points: ['Monitoreo básico', 'Backups diarios', 'Actualizaciones seguras'],
  },
];

/* =========================
 * Razones (sin localismos)
 * ========================= */
export const REASONS = [
  {
    title: 'Plazos serios y medibles',
    desc: 'Cronograma claro desde el día 1. Compromiso con la fecha de entrega.',
    icon: CheckCircle2,
  },
  {
    title: 'Código mantenible',
    desc: 'Buenas prácticas, componentes reutilizables y handoff ordenado.',
    icon: LayersIcon,
  },
  {
    title: 'Precios transparentes',
    desc: 'Sin costos ocultos. 50% anticipo, 50% al finalizar. Facturación en USD.',
    icon: CreditCardIcon,
  },
  {
    title: 'Soporte directo',
    desc: 'Comunicación por WhatsApp/Email con tiempos de respuesta definidos.',
    icon: MessageCircle,
  },
  {
    title: 'Seguridad y rendimiento',
    desc: 'SSL, hosting confiable y optimización Core Web Vitals.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'SEO técnico base',
    desc: 'Sitemap, metadatos, estructura semántica y velocidad listas desde el inicio.',
    icon: TrendingUp,
  },
];

/* =========================
 * Planes (USD por defecto)
 * ========================= */
export const PLANS = [
  {
    title: 'Landing Express',
    price: 160, // USD
    savings: '$40',
    features: [
      '1 página orientada a conversión',
      'Formulario de contacto',
      'Integración WhatsApp',
      'Dominio .com incluido',
      'Certificado SSL incluido',
      'Hosting 1 año incluido',
    ],
  },
  {
    title: 'Sitio Corporativo',
    price: 320, // USD
    ribbon: 'Más elegido',
    popular: true,
    savings: '$120',
    features: [
      '4–6 páginas profesionales',
      'Blog con 3 artículos',
      'SEO técnico completo',
      'Google Analytics configurado',
      'Formularios múltiples',
      'Integración redes sociales',
      'Capacitación de uso',
    ],
  },
  {
    title: 'E-commerce Pro',
    price: 560, // USD
    savings: '$80',
    features: [
      'Tienda online completa',
      'Hasta 50 productos',
      'Pasarela de pago segura',
      'Panel administrativo',
      'Gestión de inventario',
      'Reportes de ventas',
      'Capacitación completa',
    ],
  },
];

/* =========================
 * FAQ (neutrales, multinacionales)
 * ========================= */
export const FAQS = [
  {
    q: '¿Cuánto cuesta una página web profesional?',
    a: 'Los proyectos inician en USD $160 para una landing page y desde USD $560 para un e-commerce completo. Incluyen dominio, hosting 1 año y garantía. Sin costos ocultos.',
  },
  {
    q: '¿Realmente entregan en 72 horas?',
    a: 'Sí, para landing pages. Trabajamos con procesos ágiles y componentes probados. Sitios corporativos toman 1–2 semanas; e-commerce, 2–4 semanas.',
  },
  {
    q: '¿Mi sitio aparecerá en Google?',
    a: 'Incluimos SEO técnico base: títulos y descripciones optimizadas, sitemap, SSL y performance. Para keywords específicas ofrecemos planes de SEO avanzado.',
  },
  {
    q: '¿Qué necesito para empezar?',
    a: 'Logo (si tienes), textos clave y fotografías. Si no cuentas con contenido, lo redactamos y curamos con enfoque en ventas y SEO.',
  },
  {
    q: '¿Puedo hacer cambios después de entregar?',
    a: 'Sí. Incluimos revisiones durante el desarrollo y 30 días de ajustes menores. Para cambios mayores ofrecemos tarifas preferenciales.',
  },
  {
    q: '¿Hay pagos mensuales obligatorios?',
    a: 'No. Pagas el proyecto una vez. Hosting y dominio van incluidos el primer año. Luego puedes renovar con nosotros o migrar a otro proveedor.',
  },
  {
    q: '¿Soy dueño del código?',
    a: 'Sí. Tienes propiedad total del código y acceso al repositorio si lo deseas.',
  },
  {
    q: '¿Trabajan de forma remota?',
    a: 'Sí. Atendemos clientes en distintos países con comunicación por WhatsApp, correo y videollamadas.',
  },
];

/* =========================
 * Navegación
 * ========================= */
export const NAV_ITEMS = [
  ['Inicio', '/#inicio'],
  ['Servicios', '/#servicios'],
  ['Blog', '/blog'],
  ['Precios', '/#precios'], // <-- coincide con id de PlansSection
  ['Sobre nosotros', '/#sobre'],
  ['Contacto', '/#contacto'],
];

/* =========================
 * Proyectos (placeholders)
 * ========================= */
export const PROJECTS = [
  {
    title: 'Clínica Santa Paz',
    desc: 'Landing 72h enfocada en agendar citas. SEO local + WhatsApp.',
    tags: ['Salud', 'Landing 72h', 'SEO local'],
    img: 'https://placehold.co/600x400/0ea5e9/ffffff?text=Cl%C3%ADnica+Demo',
    demo: '#',
  },
  {
    title: 'La Palma Café',
    desc: 'Sitio corporativo con menú digital y reservas.',
    tags: ['Restaurante', 'Sitio corporativo', 'Optimizado móvil'],
    img: 'https://placehold.co/600x400/f97316/ffffff?text=Caf%C3%A9+Demo',
    demo: '#',
  },
  {
    title: 'Ferretería Colón',
    desc: 'E-commerce con 120 SKUs, pagos y gestión de inventario.',
    tags: ['E-commerce', 'Pago en línea', 'Inventario'],
    img: 'https://placehold.co/600x400/f59e0b/ffffff?text=Ferreter%C3%ADa+Demo',
    demo: '#',
  },
];
// --- END OF FILE: src/lib/constants.js ---
