// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AJM Digital Solutions';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background:
            'radial-gradient(60% 50% at 10% 0%, #e0f2fe 0%, transparent 60%), radial-gradient(40% 40% at 100% 10%, #cffafe 0%, transparent 60%), #fff',
          color: '#0f172a',
          fontSize: 44,
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: '#0369a1' }}>
          AJM Digital Solutions
        </div>
        <div style={{ lineHeight: 1.2 }}>
          Páginas web, Tiendas en línea y Landings que convierten
        </div>
        <div style={{ fontSize: 26, marginTop: 16, color: '#334155' }}>
          72h · SEO técnico · Accesibilidad · Demo gratis
        </div>
      </div>
    ),
    { ...size }
  );
}
