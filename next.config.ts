// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // (opcional) puedes dejar estos flags si te ayudan durante dev/CI
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      // 🔹 tus dominios existentes
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },

      // 🔹 Firebase Storage (URLs tipo https://firebasestorage.googleapis.com/v0/b/.../o/...)
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },

      // 🔹 Avatares / fotos de Google (si usas Google Auth o fotos de perfil)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
