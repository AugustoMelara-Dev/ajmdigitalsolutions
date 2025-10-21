// --- FILE: src/app/layout.js ---
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/shared/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';
import Script from 'next/script';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'AJM Digital Solutions', template: '%s | AJM Digital Solutions' },
  description:
    'Desarrollo web y apps para negocios: sitios corporativos, landing pages y e-commerce. Diseño sobrio, rendimiento alto y plazos serios.',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'AJM Digital Solutions',
    title: 'AJM Digital Solutions',
    description: 'Sitios rápidos, claros y listos para vender. Trato directo con el desarrollador.',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AJM Digital Solutions',
    description: 'Desarrollo web que convierte, sin vueltas.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: { index: true, follow: true },
};

// ✅ Nav consistente con tus secciones actuales
const NAV = [
  { href: "#hero",       label: "Inicio" },
  { href: "/servicios",  label: "Servicios" }, // ← ya NO es #servicios
  { href: "#planes",     label: "Planes" },    // asegúrate que tu sección tenga id="planes"
  //{ href: "#proyectos",  label: "Portafolio" },// id="proyectos" en tu ProjectsSection
  { href: "#proceso",    label: "Proceso" },
  { href: "#faqs",       label: "FAQ" },
  { href: "#contacto",   label: "Contacto" },
];


// ✅ CTA WhatsApp
const RAW_PHONE = (process.env.NEXT_PUBLIC_WA_NUMBER || '').replace(/\D/g, '');
const WA_MSG =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  'Hola AJM, quiero cotizar mi proyecto web.';
const waHref = RAW_PHONE
  ? `https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(WA_MSG)}`
  : undefined;

export default function RootLayout({ children }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const tel = RAW_PHONE ? `+${RAW_PHONE}` : undefined;

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AJM Digital Solutions',
    url: base,
    logo: `${base}/opengraph-image.png`,
    areaServed: 'Global',
    sameAs: [],
    contactPoint: tel
      ? [{ '@type': 'ContactPoint', contactType: 'customer support', telephone: tel, availableLanguage: ['es', 'en'] }]
      : undefined,
  };

  return (
    <html lang="es" className="scroll-pt-24" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: tema y lang antes de hidratar */}
        <Script
          id="theme-and-lang-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try{
    var d = document.documentElement;
    // 1) Idioma: storage > navegador > 'es'
    var LSK='locale';
    var loc = localStorage.getItem(LSK);
    if(!loc){
      var nav = navigator;
      var cand = (nav.language || (nav.languages && nav.languages[0]) || 'es') + '';
      loc = cand.slice(0,2).toLowerCase();
      if(loc!=='es' && loc!=='en') loc='es';
    } else {
      loc = (loc+'').slice(0,2).toLowerCase();
    }
    d.setAttribute('lang', loc);
    d.dataset.locale = loc;

    // 2) Tema: storage > prefers-color-scheme
    var themeLSK = 'theme';
    var saved = localStorage.getItem(themeLSK);
    var wantDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (wantDark) d.classList.add('dark'); else d.classList.remove('dark');
  }catch(e){}
})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`}>

        <ErrorBoundary>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:rounded"
          >
            Saltar al contenido
          </a>

          <div className="min-h-screen">
            {/* ⬇️ Usa el nuevo Navbar (elimina <Header />) */}
            <Navbar nav={NAV} waHref={waHref} />

            <main id="contenido">{children}</main>
            <Footer />
          </div>
        </ErrorBoundary>

        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
