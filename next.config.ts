import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* Domaines de préversion autorisés à charger les chunks HMR (évite les ChunkLoadError). */
  allowedDevOrigins: ["localhost", "127.0.0.1", "*.space-z.ai"],
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/fr",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en",
        destination: "/?lang=en",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
