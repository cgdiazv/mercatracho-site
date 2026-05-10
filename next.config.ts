import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Esto permite imágenes de cualquier sitio
      },
    ],
  },
};

export default nextConfig;
