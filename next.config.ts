import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: '',
            pathname: '/**',
          },
        ],
      },
     transpilePackages: ['framer-motion'],
};

export default nextConfig;

// --- FILE: next.config.js (Simulación) ---
// Para que <Image> de Next.js funcione con imágenes externas, debes autorizar
// el dominio en tu archivo de configuración `next.config.js`.
/*
    const nextConfig = {
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: '',
            pathname: '/**',
          },
        ],
      },
    };
    module.exports = nextConfig;
*/